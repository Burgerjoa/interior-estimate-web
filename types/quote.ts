export interface Quote {
  id: string
  name: string
  phone?: string | null
  email?: string | null
  business_type: string
  project_type: string
  area: string
  budget: string
  location: string
  preferred_date?: string | null
  preferred_time?: string | null
  message: string
  created_at: string
  updated_at: string
}

export interface QuoteCreate {
  name: string
  phone?: string | null
  email?: string | null
  business_type: string
  project_type: string
  area: string
  budget: string
  location: string
  preferred_date?: string | null
  preferred_time?: string | null
  message: string
}

export interface QuoteUpdate {
  name?: string
  phone?: string | null
  email?: string | null
  business_type?: string
  project_type?: string
  area?: string
  budget?: string
  location?: string
  preferred_date?: string | null
  preferred_time?: string | null
  message?: string
}
