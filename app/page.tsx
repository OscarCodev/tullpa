import { createClient } from '@/utils/supabase/server'
import DigitalMenu from '@/components/DigitalMenu'

export const revalidate = 0 // Opt out of static caching to always serve fresh data

export default async function Home() {
  const supabase = await createClient()

  // Fetch categories and dishes in parallel
  const [categoriesRes, dishesRes] = await Promise.all([
    supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true }),
    supabase
      .from('dishes')
      .select('*')
      .order('created_at', { ascending: true }),
  ])

  const categories = categoriesRes.data || []
  const dishes = dishesRes.data || []

  return (
    <DigitalMenu
      initialCategories={categories}
      initialDishes={dishes}
    />
  )
}
