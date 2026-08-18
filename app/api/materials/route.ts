import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedSupabase } from '@/lib/authenticated-supabase'
import { Material, MaterialFormData } from '@/lib/types/estimate'

// GET /api/materials - 자재 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { supabase, user } = await getAuthenticatedSupabase()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    let query = supabase
      .from('materials')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true })

    // 카테고리 필터
    if (category && category !== '전체') {
      query = query.eq('category', category)
    }

    // 검색 (자재명 또는 규격)
    if (search) {
      query = query.or(`name.ilike.%${search}%,spec.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Materials fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data as Material[])
  } catch (error) {
    console.error('Materials GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/materials - 자재 추가
export async function POST(request: NextRequest) {
  try {
    const { supabase, user } = await getAuthenticatedSupabase()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: MaterialFormData = await request.json()

    // 유효성 검사
    if (!body.category || !body.name || !body.unit || body.price == null) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (body.price < 0) {
      return NextResponse.json(
        { error: 'Price must be non-negative' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('materials')
      .insert({
        category: body.category,
        name: body.name,
        spec: body.spec || null,
        unit: body.unit,
        price: body.price,
        formula: body.formula || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Material insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data as Material, { status: 201 })
  } catch (error) {
    console.error('Materials POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
