"use client"

import { useEffect, useState } from "react"

import { useRouter } from "next/navigation"

import { useAuth } from "@/lib/auth-context"

import Link from "next/link"

import { motion } from "framer-motion"

import {
  Plus,
  LogOut,
  Trash2,
  Edit,
  Loader,
  GraduationCap,
} from "lucide-react"

interface Card {
  _id: string
  firstName: string
  lastName: string
  title?: string
  company?: string
  rollNumber?: string
  dateOfBirth?: string
  bloodGroup?: string
  phone?: string
  department?: string
  address?: string
  collegeName?: string
  collegeAddress?: string
  collegePhone?: string
  collegeLogo?: string
  photo?: string
  validTill?: string
  barcodeData?: string
  cardColor?: string
  designJson?: {
    colors?: {
      primary?: string
      secondary?: string
      accent?: string
      text?: string
      background?: string
    }
  }
  createdAt: string
}

function normalizeHexColor(value?: string | null) {
  const trimmed = (value ?? "").trim()

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

  return "#2563EB"
}

function hexToRgb(hex: string) {
  const normalized = normalizeHexColor(hex)

  return {
    r: Number.parseInt(normalized.slice(1, 3), 16),
    g: Number.parseInt(normalized.slice(3, 5), 16),
    b: Number.parseInt(normalized.slice(5, 7), 16),
  }
}

function rgbToHex(r: number, g: number, b: number) {
  const clamp = (value: number) =>
    Math.max(0, Math.min(255, Math.round(value)))

  return (
    "#" +
    [clamp(r), clamp(g), clamp(b)]
      .map((value) => value.toString(16).padStart(2, "0"))
      .join("")
  ).toUpperCase()
}

function shadeColor(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex)

  return rgbToHex(
    r + (amount > 0 ? (255 - r) * amount : r * amount),
    g + (amount > 0 ? (255 - g) * amount : g * amount),
    b + (amount > 0 ? (255 - b) * amount : b * amount),
  )
}

export default function Dashboard() {
  const router = useRouter()

  const { user, signOut, loading } = useAuth()

  const [cards, setCards] = useState<Card[]>([])
  const [cardsLoading, setCardsLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchCards()
    }
  }, [user])

  async function fetchCards() {
    setCardsLoading(true)

    try {
      const response = await fetch("/api/cards", {
        credentials: "include",
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch cards.")
      }

      const data = await response.json()

      setCards(
        Array.isArray(data)
          ? data
          : Array.isArray(data?.cards)
            ? data.cards
            : [],
      )
    } catch (error) {
      console.error("Error fetching cards:", error)
      setCards([])
    } finally {
      setCardsLoading(false)
    }
  }

  async function deleteCard(id: string) {
    if (deleteLoading) return

    const confirmed = window.confirm(
      "Are you sure you want to delete this student ID card?",
    )

    if (!confirmed) return

    setDeleteLoading(id)

    try {
      const response = await fetch(`/api/cards/${id}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to delete student ID card.")
      }

      setCards((previous) =>
        previous.filter((card) => card._id !== id),
      )
    } catch (error) {
      console.error("Error deleting card:", error)

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete student ID card.",
      )
    } finally {
      setDeleteLoading(null)
    }
  }

  async function handleSignOut() {
    await signOut()
    router.push("/")
  }

  if (loading || !user) {
    return null
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      {/* ==================== BACKGROUND ==================== */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl sm:h-96 sm:w-96" />

        <div className="absolute -bottom-40 -right-32 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl sm:h-[28rem] sm:w-[28rem]" />

        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* ==================== NAVBAR ==================== */}
      <motion.nav
        className="sticky top-0 z-50 border-b border-white/[0.06] bg-slate-950/75 backdrop-blur-xl"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <motion.div
              className="flex items-center gap-2.5"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <img
                src="public/icon.svg"
                alt="CardForge"
                className="h-8 w-8 object-contain sm:h-9 sm:w-9"
              />

              <span className="bg-linear-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-xl font-bold text-transparent sm:text-2xl">
                CardForge
              </span>
            </motion.div>
          </Link>

          {/* User controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 sm:flex">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/15 text-[10px] font-semibold text-blue-300">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <span className="max-w-32 truncate text-sm text-slate-300">
                {user.name}
              </span>
            </div>

            <motion.button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-sm text-slate-300 transition-all hover:border-white/10 hover:bg-white/[0.06] hover:text-white sm:px-4"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* ==================== MAIN ==================== */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        {/* ==================== HEADER ==================== */}
        <motion.div
          className="mb-8 flex flex-col gap-5 lg:mb-10 lg:flex-row lg:items-end lg:justify-between"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <div className="mb-3 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-blue-400">
              <GraduationCap size={13} />
              <span>Student ID Dashboard</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              My Student ID Cards
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
              Create, manage, and edit your college student ID cards from one
              place.
            </p>
          </div>

          <Link href="/builder" className="w-full sm:w-auto">
            <motion.button
              type="button"
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/10 transition-colors hover:bg-blue-500 sm:w-auto sm:px-6"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus size={19} />
              Create Student ID
            </motion.button>
          </Link>
        </motion.div>

   {/* //loading  */}
        {cardsLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-white/[0.06] bg-slate-900/70"
              >
                <div className="h-36 animate-pulse bg-slate-800/70" />

                <div className="space-y-3 p-5">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-slate-800" />

                  <div className="h-3 w-1/2 animate-pulse rounded bg-slate-800" />

                  <div className="h-10 animate-pulse rounded-xl bg-slate-800" />
                </div>
              </div>
            ))}
          </div>
        ) : cards.length === 0 ? (
          /* ==================== EMPTY ==================== */
          <motion.div
            className="flex min-h-[52vh] items-center justify-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-full max-w-lg text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-blue-400/10 bg-blue-500/10">
                <GraduationCap className="h-9 w-9 text-blue-400" />
              </div>

              <h2 className="text-2xl font-bold sm:text-3xl">
                No student ID cards yet
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400 sm:text-base">
                Create your first college student ID card and manage it from
                your CardForge dashboard.
              </p>

              <Link href="/builder" className="mt-7 inline-block">
                <motion.button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold transition-colors hover:bg-blue-500"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Plus size={19} />
                  Create Student ID
                </motion.button>
              </Link>
            </div>
          </motion.div>
        ) : (
          /* ==================== CARDS ==================== */
          <motion.div
            className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {cards.map((card, index) => {
              const primaryColor = normalizeHexColor(
                card.cardColor ||
                  card.designJson?.colors?.primary ||
                  "#2563EB",
              )

              const middleColor = shadeColor(
                primaryColor,
                -0.18,
              )

              const darkColor = shadeColor(
                primaryColor,
                -0.32,
              )

              return (
                <motion.div
                  key={card._id}
                  className="group overflow-hidden rounded-2xl border border-white/[0.07] bg-slate-900/75 shadow-xl shadow-black/10 backdrop-blur-xl transition-all duration-300 hover:border-white/[0.12] hover:bg-slate-900"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.06,
                  }}
                  whileHover={{
                    y: -6,
                  }}
                >
                  {/* COLLEGE ID PREVIEW */}
                  <div
                    className="relative h-40 overflow-hidden p-5"
                    style={{
                      background: `linear-gradient(135deg, ${primaryColor} 0%, ${middleColor} 55%, ${darkColor} 100%)`,
                    }}
                  >
                    {/* Background shapes */}
                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full border border-white/10 bg-white/10" />

                    <div className="absolute -bottom-16 -left-8 h-36 w-36 rounded-full bg-white/[0.06]" />

                    <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-white/5" />

                    {/* Card content */}
                    <div className="relative flex h-full items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          {card.collegeLogo ? (
                            <img
                              src={card.collegeLogo}
                              alt="College logo"
                              className="h-7 w-7 shrink-0 rounded-md border border-white/20 bg-white/10 object-contain"
                            />
                          ) : (
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/20 bg-white/10">
                              <GraduationCap
                                size={13}
                                className="text-white/80"
                              />
                            </div>
                          )}

                          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-white/75">
                            {card.collegeName ||
                              "College Name"}
                          </p>
                        </div>

                        <h3 className="truncate text-lg font-bold text-white sm:text-xl">
                          {card.firstName} {card.lastName}
                        </h3>

                        <p className="mt-1 truncate text-xs font-medium text-white/75">
                          {card.department ||
                            "Student"}
                        </p>

                        {card.rollNumber && (
                          <p className="mt-2 text-[10px] uppercase tracking-wider text-white/55">
                            ROLL NO. · {card.rollNumber}
                          </p>
                        )}
                      </div>

                      {card.photo ? (
                        <img
                          src={card.photo}
                          alt={`${card.firstName} ${card.lastName}`}
                          className="h-20 w-16 shrink-0 rounded-lg border-2 border-white/60 object-cover shadow-lg"
                        />
                      ) : (
                        <div className="flex h-20 w-16 shrink-0 items-center justify-center rounded-lg border border-white/30 bg-white/10 text-[8px] font-medium text-white/75">
                          PHOTO
                        </div>
                      )}
                    </div>

                    {/* Bottom line */}
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20" />
                  </div>

                  {/* CARD INFO */}
                  <div className="p-5">
                    <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-400">
                      College Student ID
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {card.rollNumber && (
                        <div className="rounded-xl border border-white/[0.05] bg-white/[0.025] p-3">
                          <p className="text-[10px] uppercase tracking-wider text-slate-500">
                            Roll No.
                          </p>

                          <p className="mt-1 truncate text-sm font-semibold text-slate-200">
                            {card.rollNumber}
                          </p>
                        </div>
                      )}

                      {card.validTill && (
                        <div className="rounded-xl border border-white/[0.05] bg-white/[0.025] p-3">
                          <p className="text-[10px] uppercase tracking-wider text-slate-500">
                            Valid Until
                          </p>

                          <p className="mt-1 truncate text-sm font-semibold text-slate-200">
                            {card.validTill}
                          </p>
                        </div>
                      )}

                      {!card.rollNumber &&
                        !card.validTill && (
                          <div className="col-span-2 rounded-xl border border-white/[0.05] bg-white/[0.025] p-3">
                            <p className="text-[10px] uppercase tracking-wider text-slate-500">
                              Student ID Status
                            </p>

                            <p className="mt-1 text-sm font-semibold text-emerald-400">
                              Ready to customize
                            </p>
                          </div>
                        )}
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <p className="text-xs text-slate-500">
                        Created{" "}
                        {card.createdAt
                          ? new Date(
                              card.createdAt,
                            ).toLocaleDateString()
                          : "Recently"}
                      </p>

                      <span
                        className="h-2 w-2 rounded-full"
                        style={{
                          backgroundColor:
                            primaryColor,
                        }}
                      />
                    </div>

                    {/* ACTIONS */}
                    <div className="mt-5 flex gap-2">
                      <Link
                        href={`/builder?id=${card._id}`}
                        className="flex-1"
                      >
                        <motion.button
                          type="button"
                          className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 text-sm font-medium transition-colors hover:bg-blue-500"
                          whileHover={{
                            scale: 1.015,
                          }}
                          whileTap={{
                            scale: 0.985,
                          }}
                        >
                          <Edit size={15} />
                          Edit Student ID
                        </motion.button>
                      </Link>

                      <motion.button
                        type="button"
                        onClick={() =>
                          deleteCard(card._id)
                        }
                        disabled={
                          deleteLoading ===
                          card._id
                        }
                        aria-label="Delete student ID"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-500/15 bg-red-500/10 text-red-400 transition-all hover:border-red-500/25 hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-50"
                        whileHover={{
                          scale: 1.03,
                        }}
                        whileTap={{
                          scale: 0.97,
                        }}
                      >
                        {deleteLoading ===
                        card._id ? (
                          <Loader
                            size={16}
                            className="animate-spin"
                          />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </main>
    </div>
  )
}