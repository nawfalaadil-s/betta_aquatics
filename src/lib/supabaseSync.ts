import { supabase, isSupabaseConfigured } from './supabase';
import { Product, Category, HomepageSection, CMSPage, MediaAsset, StoreSettings } from './types';
import { mockDb } from './mockDatabase';

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

/**
 * Fetches latest homepage sections from Supabase cloud database
 */
export async function fetchSupabaseHomepageSections(): Promise<HomepageSection[]> {
  if (!isSupabaseConfigured || !supabase) {
    return mockDb.getHomepageSections();
  }

  try {
    // 1. Try store_settings key: 'homepage_sections' (canonical JSON format)
    const { data: settingData, error: settingErr } = await supabase
      .from('store_settings')
      .select('value')
      .eq('key', 'homepage_sections')
      .maybeSingle();

    if (settingData && settingData.value && Array.isArray(settingData.value) && settingData.value.length > 0) {
      const sections = settingData.value as HomepageSection[];
      mockDb.updateHomepageSections(sections);
      return sections;
    }

    // 2. Fallback to homepage_sections table
    const { data: tableData } = await supabase
      .from('homepage_sections')
      .select('*')
      .order('display_order', { ascending: true });

    if (tableData && tableData.length > 0) {
      const mapped: HomepageSection[] = tableData.map(r => ({
        id: r.id,
        type: r.section_type,
        title: r.title,
        subtitle: r.subtitle || undefined,
        is_active: r.is_active,
        display_order: r.display_order,
        config: r.config_json || {},
      }));
      mockDb.updateHomepageSections(mapped);
      return mapped;
    }
  } catch (err) {
    console.warn('Failed to fetch homepage sections from Supabase:', err);
  }

  return mockDb.getHomepageSections();
}

/**
 * Persists homepage sections to Supabase cloud database (both store_settings and homepage_sections table)
 */
export async function syncHomepageSectionsToSupabase(sections: HomepageSection[]): Promise<boolean> {
  // Always update mockDb first for instant UI response
  mockDb.updateHomepageSections(sections);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ba_homepage_updated', { detail: sections }));
  }

  if (!isSupabaseConfigured || !supabase) return true;

  try {
    const now = new Date().toISOString();

    // 1. Save canonical array to store_settings
    const { error: settingError } = await supabase
      .from('store_settings')
      .upsert({
        key: 'homepage_sections',
        value: sections,
        description: 'Global dynamic homepage sections layout and configs',
        updated_at: now,
      }, { onConflict: 'key' });

    if (settingError) {
      console.warn('Supabase store_settings.homepage_sections error:', settingError.message);
    }

    // 2. Also sync rows to homepage_sections table
    for (const s of sections) {
      await supabase
        .from('homepage_sections')
        .upsert({
          id: s.id,
          section_type: s.type,
          title: s.title,
          subtitle: s.subtitle || '',
          config_json: s.config || {},
          display_order: s.display_order,
          is_active: s.is_active,
        }, { onConflict: 'id' });
    }

    return true;
  } catch (err) {
    console.error('Failed to sync homepage sections to Supabase:', err);
    return false;
  }
}

/**
 * Fetches CMS pages from Supabase cloud database
 */
export async function fetchSupabaseCMSPages(): Promise<CMSPage[]> {
  if (!isSupabaseConfigured || !supabase) {
    return mockDb.getCMSPages();
  }

  try {
    // 1. Check store_settings key: 'cms_pages'
    const { data: settingData } = await supabase
      .from('store_settings')
      .select('value')
      .eq('key', 'cms_pages')
      .maybeSingle();

    if (settingData && settingData.value && Array.isArray(settingData.value) && settingData.value.length > 0) {
      const pages = settingData.value as CMSPage[];
      for (const p of pages) {
        mockDb.saveCMSPage(p);
      }
      return pages;
    }

    // 2. Fallback to cms_pages table
    const { data: tableData } = await supabase
      .from('cms_pages')
      .select('*')
      .order('created_at', { ascending: true });

    if (tableData && tableData.length > 0) {
      const mapped: CMSPage[] = tableData.map(r => ({
        id: r.id,
        slug: r.slug,
        title: r.title,
        content_html: r.content_html,
        meta_title: r.meta_title || r.title,
        meta_description: r.meta_description || '',
        is_published: r.is_published,
        updated_at: r.updated_at || r.created_at || new Date().toISOString(),
      }));
      for (const p of mapped) {
        mockDb.saveCMSPage(p);
      }
      return mapped;
    }
  } catch (err) {
    console.warn('Failed to fetch CMS pages from Supabase:', err);
  }

  return mockDb.getCMSPages();
}

/**
 * Persists a CMS page (create or update) to Supabase cloud database
 */
export async function syncCMSPageToSupabase(page: CMSPage): Promise<boolean> {
  // 1. Immediate local save
  mockDb.saveCMSPage(page);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ba_cms_pages_updated', { detail: page }));
  }

  if (!isSupabaseConfigured || !supabase) return true;

  try {
    const now = new Date().toISOString();

    // 2. Save in cms_pages table
    const { error: pageErr } = await supabase
      .from('cms_pages')
      .upsert({
        id: page.id,
        slug: page.slug,
        title: page.title,
        content_html: page.content_html,
        meta_title: page.meta_title || page.title,
        meta_description: page.meta_description || '',
        is_published: page.is_published,
        updated_at: now,
      }, { onConflict: 'slug' });

    if (pageErr) {
      console.warn('Supabase cms_pages upsert error:', pageErr.message);
    }

    // 3. Keep store_settings.cms_pages array synchronized
    const allPages = mockDb.getCMSPages();
    await supabase
      .from('store_settings')
      .upsert({
        key: 'cms_pages',
        value: allPages,
        description: 'Published and draft CMS pages catalog',
        updated_at: now,
      }, { onConflict: 'key' });

    return true;
  } catch (err) {
    console.error('Failed to sync CMS page to Supabase:', err);
    return false;
  }
}

/**
 * Deletes a CMS page from Supabase cloud database
 */
export async function deleteSupabaseCMSPage(pageId: string, slug?: string): Promise<boolean> {
  mockDb.deleteCMSPage(pageId);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ba_cms_pages_updated'));
  }

  if (!isSupabaseConfigured || !supabase) return true;

  try {
    // Delete from cms_pages table
    if (slug) {
      await supabase.from('cms_pages').delete().eq('slug', slug);
    }
    await supabase.from('cms_pages').delete().eq('id', pageId);

    // Update store_settings.cms_pages
    const allPages = mockDb.getCMSPages();
    await supabase
      .from('store_settings')
      .upsert({
        key: 'cms_pages',
        value: allPages,
        description: 'Published and draft CMS pages catalog',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'key' });

    return true;
  } catch (err) {
    console.error('Failed to delete CMS page from Supabase:', err);
    return false;
  }
}

/**
 * Syncs announcement bar and promotional banner settings to Supabase
 */
export async function syncAnnouncementToSupabase(announcement: {
  announcement_text: string;
  announcement_code?: string;
  announcement_active: boolean;
  announcement_link?: string;
}): Promise<boolean> {
  const updated = mockDb.updateStoreSettings(announcement);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ba_storesettings_updated', { detail: updated }));
  }

  if (!isSupabaseConfigured || !supabase) return true;

  try {
    const now = new Date().toISOString();
    // Retrieve existing shipping_settings in Supabase
    const { data: shipData } = await supabase
      .from('store_settings')
      .select('value')
      .eq('key', 'shipping_settings')
      .maybeSingle();

    const existingShipping = shipData?.value || {};
    const mergedShipping = {
      ...existingShipping,
      announcement_text: announcement.announcement_text,
      announcement_code: announcement.announcement_code || '',
      announcement_active: announcement.announcement_active,
      announcement_link: announcement.announcement_link || '',
    };

    await supabase
      .from('store_settings')
      .upsert({
        key: 'shipping_settings',
        value: mergedShipping,
        description: 'Logistics rules, freight charges, and top announcement message',
        updated_at: now,
      }, { onConflict: 'key' });

    return true;
  } catch (err) {
    console.error('Failed to sync announcement to Supabase:', err);
    return false;
  }
}
