import { supabase, isSupabaseConfigured } from './supabase';
import { Product, Category } from './types';

/**
 * Permanently deletes one or more products from Supabase PostgreSQL database
 * Handles foreign key constraints and child tables gracefully.
 */
export async function deleteSupabaseProducts(productIds: string[], productSkus?: string[]): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase || productIds.length === 0) {
    return true;
  }

  try {
    // 1. Unlink historical order items so receipts don't break
    await supabase
      .from('order_items')
      .update({ product_id: null })
      .in('product_id', productIds);

    // 2. Cascade delete dependent tables
    await supabase.from('product_images').delete().in('product_id', productIds);
    await supabase.from('collection_products').delete().in('product_id', productIds);
    await supabase.from('cart_items').delete().in('product_id', productIds);
    await supabase.from('wishlists').delete().in('product_id', productIds);
    await supabase.from('reviews').delete().in('product_id', productIds);

    // 3. Delete products by ID
    const { error: idError } = await supabase
      .from('products')
      .delete()
      .in('id', productIds);

    if (idError) {
      console.warn('Supabase product delete by ID notice:', idError.message);
    }

    // 4. Also delete by SKU if available (ensures mock and DB UUID discrepancies match)
    if (productSkus && productSkus.length > 0) {
      const validSkus = productSkus.filter(Boolean);
      if (validSkus.length > 0) {
        await supabase
          .from('products')
          .delete()
          .in('sku', validSkus);
      }
    }

    return true;
  } catch (err) {
    console.error('Error during Supabase product deletion:', err);
    return false;
  }
}

/**
 * Permanently deletes a category from Supabase PostgreSQL database
 * Handles products and child subcategories safely.
 */
export async function deleteSupabaseCategory(categoryId: string, reassignToId?: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase || !categoryId) {
    return true;
  }

  try {
    // 1. Reassign or set null on products linked to this category
    await supabase
      .from('products')
      .update({ 
        category_id: reassignToId || null, 
        subcategory_id: null 
      })
      .or(`category_id.eq.${categoryId},subcategory_id.eq.${categoryId}`);

    // 2. Move child subcategories to reassign target or root
    await supabase
      .from('categories')
      .update({ parent_id: reassignToId || null })
      .eq('parent_id', categoryId);

    // 3. Delete category from Supabase
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId);

    if (error) {
      console.warn('Supabase category delete notice:', error.message);
    }

    return true;
  } catch (err) {
    console.error('Error during Supabase category deletion:', err);
    return false;
  }
}

/**
 * Syncs a saved product into Supabase PostgreSQL database
 */
export async function syncProductToSupabase(product: Product): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;

  try {
    const payload = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      description: product.description || '',
      short_description: product.short_description || '',
      price: product.price,
      compare_at_price: product.compare_at_price || null,
      stock_quantity: product.stock_quantity ?? 1,
      is_unique_specimen: Boolean(product.is_unique_specimen),
      is_featured: Boolean(product.is_featured),
      is_active: product.is_active !== undefined ? product.is_active : true,
      strain: product.strain || null,
      gender: product.gender || null,
      care_level: product.care_level || 'Moderate',
      images: product.images || [],
      videos: product.videos || [],
      updated_at: new Date().toISOString(),
    };

    await supabase
      .from('products')
      .upsert(payload, { onConflict: 'id' });
  } catch (err) {
    console.warn('Supabase product upsert warning:', err);
  }
}

/**
 * Syncs a saved category into Supabase PostgreSQL database
 */
export async function syncCategoryToSupabase(category: Category): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;

  try {
    const payload = {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      image_url: category.image_url,
      banner_url: category.banner_url || null,
      parent_id: category.parent_id || null,
      display_order: category.display_order ?? 1,
      is_active: category.is_active !== undefined ? category.is_active : true,
      is_featured: Boolean(category.is_featured),
      updated_at: new Date().toISOString(),
    };

    await supabase
      .from('categories')
      .upsert(payload, { onConflict: 'id' });
  } catch (err) {
    console.warn('Supabase category upsert warning:', err);
  }
}
