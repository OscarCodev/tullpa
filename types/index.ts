export interface Category {
  id: string
  name: string
  emoji: string
  created_at?: string
}

export interface Dish {
  id: string
  category_id: string
  name: string
  emoji: string
  price: number
  tone: number
  available: boolean
  desc: string
  image_url?: string | null
  created_at?: string
}
