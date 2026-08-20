import { NextRequest, NextResponse } from "next/server"

import { getCurrentUser } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"
import { IDCard } from "@/lib/models/IDCard"

function normalizeHexColor(value: unknown, fallback = "#2563EB") {
  if (typeof value !== "string") return fallback

  const trimmed = value.trim()

  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) {
    return trimmed.toUpperCase()
  }

  if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
    return (
      "#" +
      trimmed
        .slice(1)
        .split("")
        .map((char) => char + char)
        .join("")
    ).toUpperCase()
  }

  return fallback
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      )
    }

    await connectDB()

    const cards = await IDCard.find({ userId: user.userId })
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json(
      cards.map((card) => ({
        ...card,
        cardColor: normalizeHexColor(card.cardColor),
        textColor: normalizeHexColor(card.textColor, "#FFFFFF"),
      })),
    )
  } catch (error) {
    console.error("[cards] Get cards error:", error)

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Internal server error"

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      )
    }

    await connectDB()

    const data = await request.json()

    const card = await IDCard.create({
      userId: user.userId,
      ...data,
      cardColor: normalizeHexColor(data?.cardColor),
      textColor: normalizeHexColor(data?.textColor, "#FFFFFF"),
    })

    return NextResponse.json(card, { status: 201 })
  } catch (error) {
    console.error("[cards] Create card error:", error)

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Internal server error"

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 },
    )
  }
}