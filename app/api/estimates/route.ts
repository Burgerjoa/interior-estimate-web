import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedSupabase } from '@/lib/authenticated-supabase'
import { calculateEstimate } from '@/lib/estimate/calculation'
import { validateEstimatePayload } from '@/lib/estimate/validation'

// GET /api/estimates - 견적 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { supabase, user } = await getAuthenticatedSupabase()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const usage = searchParams.get('usage')
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')

    let query = supabase
      .from('estimates')
      .select('*')
      .order('created_at', { ascending: false })

    if (search) {
      query = query.ilike('site_name', `%${search}%`)
    }

    if (usage && usage !== '전체') {
      query = query.eq('usage', usage)
    }

    if (startDate) {
      query = query.gte('created_at', startDate)
    }
    if (endDate) {
      query = query.lte('created_at', endDate)
    }

    const { data, error } = await query

    if (error) {
      console.error('Estimates fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Estimates GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/estimates - 견적 생성
export async function POST(request: NextRequest) {
  try {
    const { supabase, user } = await getAuthenticatedSupabase()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const validation = validateEstimatePayload(await request.json())
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const body = validation.data
    const calculation = calculateEstimate({
      items: body.items,
      laborCost: body.labor_cost,
      etcCost: body.etc_cost,
      marginRate: body.margin_rate,
      pyeong: body.pyeong,
    })

    const { data, error } = await supabase
      .from('estimates')
      .insert({
        site_name: body.site_name,
        pyeong: body.pyeong,
        usage: body.usage,
        height: body.height || null,
        items: body.items,
        labor_cost: body.labor_cost,
        etc_cost: body.etc_cost,
        margin_rate: body.margin_rate,
        total_cost: calculation.totalCost,
        estimate_price: calculation.estimatePrice,
        memo: body.memo || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Estimate insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Estimates POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
