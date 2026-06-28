'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// ============================================================
// SITE CONTENT (Landing page texts)
// ============================================================

export async function getSiteContent() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('site_content')
    .select('content_key, content_value')

  if (error) return {}

  const contentMap: Record<string, string> = {}
  data?.forEach((row: { content_key: string; content_value: string }) => {
    contentMap[row.content_key] = row.content_value
  })
  return contentMap
}

export async function updateSiteContent(key: string, value: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('site_content')
    .upsert(
      { content_key: key, content_value: value, updated_at: new Date().toISOString() },
      { onConflict: 'content_key' }
    )

  if (error) return { error: error.message }
  revalidatePath('/')
  return { success: true }
}

export async function updateSiteContentBulk(entries: Record<string, string>) {
  const supabase = await createClient()
  const rows = Object.entries(entries).map(([content_key, content_value]) => ({
    content_key,
    content_value,
    updated_at: new Date().toISOString(),
  }))

  const { error } = await supabase
    .from('site_content')
    .upsert(rows, { onConflict: 'content_key' })

  if (error) return { error: error.message }
  revalidatePath('/')
  revalidatePath('/admin/settings')
  return { success: true }
}

// ============================================================
// SETTINGS
// ============================================================

export async function getSettings() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .limit(1)
    .single()

  if (error) return null
  return data
}

export async function updateSettings(updates: Record<string, string | null>) {
  const supabase = await createClient()

  // Get or create settings row
  const { data: existing } = await supabase
    .from('settings')
    .select('id')
    .limit(1)
    .single()

  if (existing) {
    const { error } = await supabase
      .from('settings')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
    if (error) return { error: error.message }
  } else {
    const { error } = await supabase
      .from('settings')
      .insert({ whatsapp_number: '', ...updates })
    if (error) return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/settings')
  return { success: true }
}

// ============================================================
// PRODUCTS
// ============================================================

export async function getProducts(activeOnly = false) {
  const supabase = await createClient()
  let query = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (activeOnly) {
    query = query.eq('is_active', true)
  }

  const { data, error } = await query
  if (error) return []
  return data || []
}

export async function getProduct(id: number) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export async function getFeaturedProducts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(4)

  if (error) return []
  return data || []
}

export async function createProduct(productData: {
  name: string
  description: string
  rich_description?: string
  price: number
  image: string
  category: string
  stock: number
  is_active: boolean
  is_featured: boolean
}) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .insert(productData)
    .select()
    .single()

  if (error) return { error: error.message }
  revalidatePath('/admin/products')
  revalidatePath('/catalog')
  revalidatePath('/')
  return { success: true, data }
}

export async function updateProduct(
  id: number,
  productData: Partial<{
    name: string
    description: string
    rich_description: string
    price: number
    image: string
    category: string
    stock: number
    is_active: boolean
    is_featured: boolean
  }>
) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('products')
    .update(productData)
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/admin/products')
  revalidatePath('/catalog')
  revalidatePath(`/catalog/${id}`)
  revalidatePath('/')
  return { success: true }
}

export async function deleteProduct(id: number) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/admin/products')
  revalidatePath('/catalog')
  revalidatePath('/')
  return { success: true }
}

// ============================================================
// PRODUCT IMAGES (Gallery)
// ============================================================

export async function getProductImages(productId: number) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('product_images')
    .select('*')
    .eq('product_id', productId)
    .order('sort_order', { ascending: true })

  if (error) return []
  return data || []
}

export async function addProductImage(productId: number, imageUrl: string, sortOrder = 0) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('product_images')
    .insert({ product_id: productId, image_url: imageUrl, sort_order: sortOrder })

  if (error) return { error: error.message }
  revalidatePath(`/catalog/${productId}`)
  return { success: true }
}

export async function deleteProductImage(id: number) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('product_images')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }
  return { success: true }
}

// ============================================================
// IMAGE UPLOAD (Supabase Storage)
// ============================================================

export async function uploadImage(formData: FormData): Promise<{ url?: string; error?: string }> {
  const file = formData.get('file') as File
  if (!file) return { error: 'No file provided' }

  const supabase = await createClient()
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
  const filePath = `uploads/${fileName}`

  const { error } = await supabase.storage
    .from('media')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) return { error: error.message }

  const { data: urlData } = supabase.storage
    .from('media')
    .getPublicUrl(filePath)

  return { url: urlData.publicUrl }
}

export async function deleteStorageImage(url: string) {
  const supabase = await createClient()
  // Extract path from full URL
  const parts = url.split('/storage/v1/object/public/media/')
  if (parts.length < 2) return { error: 'Invalid URL' }
  const path = parts[1]

  const { error } = await supabase.storage
    .from('media')
    .remove([path])

  if (error) return { error: error.message }
  return { success: true }
}

// ============================================================
// TESTIMONIALS
// ============================================================

export async function getTestimonials(activeOnly = false) {
  const supabase = await createClient()
  let query = supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false })

  if (activeOnly) {
    query = query.eq('is_active', true)
  }

  const { data, error } = await query
  if (error) return []
  return data || []
}

export async function createTestimonial(testimonialData: {
  name: string
  text: string
  rating: number
  avatar_url?: string
  is_active: boolean
}) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('testimonials')
    .insert(testimonialData)

  if (error) return { error: error.message }
  revalidatePath('/')
  revalidatePath('/admin/testimonials')
  return { success: true }
}

export async function updateTestimonial(
  id: number,
  testimonialData: Partial<{
    name: string
    text: string
    rating: number
    avatar_url: string
    is_active: boolean
  }>
) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('testimonials')
    .update(testimonialData)
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/')
  revalidatePath('/admin/testimonials')
  return { success: true }
}

export async function deleteTestimonial(id: number) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/')
  revalidatePath('/admin/testimonials')
  return { success: true }
}
