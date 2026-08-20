import { connectDB } from '@/lib/mongodb'
import { IDCard } from '@/lib/models/IDCard'
import { getCurrentUser } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
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

    const body = await request.json()
    const { format, imageData } = body

    // Save the exported PDF/PNG data as base64 to the database
    if (format === 'pdf') {
      card.frontImageUrl = imageData // Store PDF as base64
    } else if (format === 'png') {
      card.backImageUrl = imageData // Store PNG as base64
    }

    await card.save()

    return NextResponse.json({ 
      success: true,
      cardId: card._id,
      message: `Card exported as ${format} successfully`
    })
  } catch (error) {
    console.error('Error exporting card:', error)
    return NextResponse.json({ error: 'Failed to export card' }, { status: 500 })
  }
}

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

    const format = request.nextUrl.searchParams.get('format') || 'pdf'
    const imageData = format === 'pdf' ? card.frontImageUrl : card.backImageUrl

    if (!imageData) {
      return NextResponse.json({ error: 'Exported file not found' }, { status: 404 })
    }

    // Convert base64 to buffer
    const base64Data = imageData.replace(/^data:image\/[^;]+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')

    const headers = new Headers()
    headers.set('Content-Type', format === 'pdf' ? 'application/pdf' : 'image/png')
    headers.set('Content-Disposition', `attachment; filename="id-card.${format === 'pdf' ? 'pdf' : 'png'}"`)
    headers.set('Content-Length', buffer.length.toString())

    return new NextResponse(buffer, { headers, status: 200 })
  } catch (error) {
    console.error('Error downloading export:', error)
    return NextResponse.json({ error: 'Failed to download file' }, { status: 500 })
  }
}
