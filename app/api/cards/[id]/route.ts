import { connectDB } from '@/lib/mongodb'
import { IDCard } from '@/lib/models/IDCard'
import { getCurrentUser } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const { id } = await params
    const card = await IDCard.findById(id)
    
    if (!card || card.userId.toString() !== user.userId) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 })
    }

    return NextResponse.json(card)
  } catch (error) {
    console.error('Error fetching card:', error)
    return NextResponse.json({ error: 'Failed to fetch card' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const body = await request.json()
    const { id } = await params
    const card = await IDCard.findById(id)
    
    if (!card || card.userId.toString() !== user.userId) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 })
    }

    Object.assign(card, body)
    await card.save()

    return NextResponse.json(card)
  } catch (error) {
    console.error('Error updating card:', error)
    return NextResponse.json({ error: 'Failed to update card' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const { id } = await params
    const card = await IDCard.findById(id)
    
    if (!card || card.userId.toString() !== user.userId) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 })
    }

    await IDCard.deleteOne({ _id: id })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting card:', error)
    return NextResponse.json({ error: 'Failed to delete card' }, { status: 500 })
  }
}
