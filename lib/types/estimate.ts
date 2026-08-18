// 견적 시스템 타입 정의

export type MaterialCategory = '철거' | '바닥' | '벽체' | '천장' | '도장' | '전기' | '설비' | '목공' | '기타'

export type MaterialUnit = '㎡' | 'm' | 'EA' | '톤' | 'L' | 'kg' | '식' | '개소' | 'm²' | 'm³' | '평'

export type EstimateUsage = '카페' | '식당' | '사무실' | '매장' | '병원' | '학원' | '기타'

export interface Material {
  id: string
  category: MaterialCategory
  name: string
  spec: string | null
  unit: MaterialUnit
  price: number
  formula: string | null  // 수량 자동계산 공식 (p=평수, h=층고)
  created_at: string
  updated_at: string
}

export interface EstimateItem {
  material_id: string
  name: string
  spec: string | null
  unit: MaterialUnit
  price: number
  quantity: number
  subtotal: number
}

export interface Estimate {
  id: string
  site_name: string
  pyeong: number
  usage: EstimateUsage
  height: string | null
  items: EstimateItem[]
  labor_cost: number
  etc_cost: number
  margin_rate: number
  total_cost: number
  estimate_price: number
  memo: string | null
  created_at: string
  updated_at: string
}

export interface EstimateFormData {
  site_name: string
  pyeong: number
  usage: EstimateUsage
  height: string
  items: EstimateItem[]
  labor_cost: number
  etc_cost: number
  margin_rate: number
  memo: string
}

export interface MaterialFormData {
  category: MaterialCategory
  name: string
  spec: string
  unit: MaterialUnit
  price: number
  formula?: string  // 수량 자동계산 공식 (선택사항)
}

export interface EstimateCalculation {
  materialCost: number
  laborCost: number
  etcCost: number
  totalCost: number
  marginRate: number
  estimatePrice: number
  expectedProfit: number
  pricePerPyeong: number
  squareMeter: number
}

export interface EstimateSaveInput {
  site_name: string
  pyeong: number
  usage: EstimateUsage
  height: string
  items: EstimateItem[]
  labor_cost: number
  etc_cost: number
  margin_rate: number
  memo: string
}
