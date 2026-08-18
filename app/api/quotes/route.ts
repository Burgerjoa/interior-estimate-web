import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import type { QuoteCreate } from '@/types/quote'

const PUBLIC_QUOTE_FIELDS = [
  'id',
  'business_type',
  'project_type',
  'area',
  'budget',
  'location',
  'created_at',
  'updated_at',
].join(',')

const REQUIRED_FIELDS: Array<keyof QuoteCreate> = [
  'name',
  'business_type',
  'project_type',
  'area',
  'location',
]

const ALLOWED_FIELDS: Array<keyof QuoteCreate> = [
  'name',
  'phone',
  'email',
  'business_type',
  'project_type',
  'area',
  'budget',
  'location',
  'preferred_date',
  'preferred_time',
  'message',
]

// 공개 목록에는 개인정보와 자유 입력 내용을 포함하지 않는다.
export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('public_quotes')
      .select(PUBLIC_QUOTE_FIELDS)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch quotes', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quotes' },
      { status: 500 }
    )
  }
}

// 고객이 작성하는 공개 견적 신청 엔드포인트
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body: QuoteCreate = await request.json()

    const missingFields = REQUIRED_FIELDS.filter((field) => {
      const value = body[field]
      return typeof value !== 'string' || value.trim() === ''
    })

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: 'Missing required fields', fields: missingFields },
        { status: 400 }
      )
    }

    const quote = Object.fromEntries(
      ALLOWED_FIELDS.map((field) => {
        const value = body[field]
        return [field, typeof value === 'string' ? value.trim().slice(0, 2000) : null]
      })
    )

    const { error } = await supabase
      .from('quotes')
      .insert([quote])

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to create quote', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Quote created successfully' }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Failed to create quote' },
      { status: 500 }
    )
  }
}
