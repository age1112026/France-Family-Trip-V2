import { createClient } from "@supabase/supabase-js";
import seedPois from "../../data/pois.seed.json";
import type { Poi, Vote, VoteInput } from "./types";

type DatabasePoi = Omit<Poi, "images" | "links"> & {
  poi_images?: Poi["images"];
  poi_links?: Poi["links"];
};

function supabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function getPois(): Promise<Poi[]> {
  const supabase = supabaseAdmin();
  if (!supabase) return seedPois as Poi[];

  const { data, error } = await supabase
    .from("pois")
    .select("*, poi_images(*), poi_links(*)")
    .order("city_region")
    .order("name");

  if (error || !data) return seedPois as Poi[];

  return (data as DatabasePoi[]).map((poi) => ({
    ...poi,
    images: (poi.poi_images || []).sort((a, b) => a.sort_order - b.sort_order),
    links: poi.poi_links || []
  }));
}

export async function getVotes(): Promise<Vote[]> {
  const supabase = supabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("poi_interest_votes")
    .select("poi_id, member_id, interest_level, note, updated_at");

  if (error || !data) return [];
  return data as Vote[];
}

export async function upsertVote(vote: VoteInput) {
  const supabase = supabaseAdmin();
  if (!supabase) {
    return { persisted: false };
  }

  const { error } = await supabase.from("poi_interest_votes").upsert(
    {
      ...vote,
      updated_at: new Date().toISOString()
    },
    { onConflict: "poi_id,member_id" }
  );

  if (error) throw error;
  return { persisted: true };
}
