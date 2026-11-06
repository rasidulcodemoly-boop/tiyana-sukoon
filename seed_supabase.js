const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const url = 'https://hbjqctnlzxyjzcdmutaw.supabase.co';
const key = 'sb_publishable_lnd_qcQ9cAI4lRT7EMcAoA_b-sZoM7A';
const supabase = createClient(url, key);

// Read initialData.ts
const content = fs.readFileSync(path.join(__dirname, 'src', 'data', 'initialData.ts'), 'utf-8');

// Parse initialArtworks using a quick regex/eval extractor
const initialArtworksMatch = content.match(/export const initialArtworks: Artwork\[\] = (\[[\s\S]*?\]);\r?\n\r?\nexport const initialOrders/);

if (!initialArtworksMatch) {
  console.error("Could not find initialArtworks in initialData.ts");
  process.exit(1);
}

// Clean TypeScript types from JSON-like object
let jsonStr = initialArtworksMatch[1];
// Evaluate safely into an array
const artworks = eval(jsonStr);

console.log(`Found ${artworks.length} artworks to seed.`);

const rows = artworks.map(art => ({
  id: art.id,
  title: art.title,
  title_bangla: art.titleBangla || null,
  category: art.category,
  price: art.price,
  original_price: art.originalPrice || null,
  description: art.description || null,
  spiritual_message: art.spiritualMessage || null,
  dimensions: art.dimensions,
  medium: art.medium,
  finish: art.finish || null,
  image: art.image,
  is_featured: Boolean(art.isFeatured),
  in_stock: Boolean(art.inStock),
  badge: art.badge || null,
  tags: art.tags || [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}));

async function seed() {
  const { data, error } = await supabase.from('artworks').upsert(rows, { onConflict: 'id' });
  if (error) {
    console.error("Artworks Seed Error:", error);
  } else {
    console.log(`Successfully seeded all ${rows.length} artworks into Supabase!`);
  }

  // Seed site_settings
  const settingsMatch = content.match(/export const initialSettings: SiteSettings = (\{[\s\S]*?\});/);
  if (settingsMatch) {
    const settings = eval('(' + settingsMatch[1] + ')');
    const { error: settErr } = await supabase.from('site_settings').upsert({
      id: 'current',
      settings: settings,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });
    if (settErr) console.error("Settings Seed Error:", settErr);
    else console.log("Successfully seeded site settings into Supabase!");
  }

  // Verify count
  const { count } = await supabase.from('artworks').select('*', { count: 'exact', head: true });
  console.log(`Total artworks now in Supabase database: ${count}`);
}

seed();
