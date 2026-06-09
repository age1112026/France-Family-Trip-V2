import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });
const seed = JSON.parse(await readFile(path.join(root, "data", "pois.seed.json"), "utf8"));

const familyMembers = [
  { id: "me", display_name: "我", sort_order: 1 },
  { id: "dad", display_name: "爸爸", sort_order: 2 },
  { id: "mom", display_name: "妈妈", sort_order: 3 }
];

await upsert("family_members", familyMembers, "id");

for (const poi of seed) {
  const { images, links, ...row } = poi;
  await upsert("pois", [row], "id");

  await supabase.from("poi_images").delete().eq("poi_id", poi.id);
  if (images?.length) {
    await insert("poi_images", images.map((image) => ({ ...image, poi_id: poi.id })));
  }

  await supabase.from("poi_links").delete().eq("poi_id", poi.id);
  if (links?.length) {
    await insert("poi_links", links.map((link) => ({ ...link, poi_id: poi.id })));
  }
}

console.log(`Imported ${seed.length} POIs.`);

async function upsert(table, rows, conflict) {
  const { error } = await supabase.from(table).upsert(rows, { onConflict: conflict });
  if (error) throw error;
}

async function insert(table, rows) {
  const { error } = await supabase.from(table).insert(rows);
  if (error) throw error;
}
