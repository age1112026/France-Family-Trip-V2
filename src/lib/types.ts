export const CITY_REGIONS = [
  "Paris",
  "Mont-Saint-Michel",
  "Nice",
  "French Riviera East",
  "French Riviera West"
] as const;

export const CATEGORIES = [
  "历史文化",
  "艺术建筑",
  "海景小镇",
  "餐饮",
  "米其林/法餐",
  "文化活动",
  "自然景观",
  "购物市集",
  "特殊体验"
] as const;

export const AUDIENCE_TAGS = [
  "适合爸爸",
  "适合妈妈",
  "适合我",
  "适合全家",
  "语言门槛低",
  "体力要求高",
  "需要提前预约"
] as const;

export const FAMILY_MEMBERS = [
  { id: "me", name: "我", sortOrder: 1 },
  { id: "dad", name: "爸爸", sortOrder: 2 },
  { id: "mom", name: "妈妈", sortOrder: 3 }
] as const;

export const INTEREST_OPTIONS = [
  { value: "must_go", label: "很想去", weight: 2 },
  { value: "okay", label: "可以去", weight: 1 },
  { value: "neutral", label: "无感", weight: 0 },
  { value: "not_interested", label: "不想去", weight: -3 },
  { value: "revisit", label: "已去过但可重游", weight: 1 }
] as const;

export type CityRegion = (typeof CITY_REGIONS)[number];
export type Category = (typeof CATEGORIES)[number];
export type AudienceTag = (typeof AUDIENCE_TAGS)[number];
export type ClassicLevel = "大众经典" | "高价值经典" | "小众宝藏" | "可选补充";
export type VerificationStatus = "已核实" | "待核实" | "可能变化";
export type ContentStatus = "base" | "upgraded";
export type InterestLevel = (typeof INTEREST_OPTIONS)[number]["value"];
export type FamilyMemberId = (typeof FAMILY_MEMBERS)[number]["id"];

export type PoiImage = {
  image_url: string;
  alt: string;
  caption: string;
  source_url: string;
  sort_order: number;
};

export type PoiLink = {
  label: string;
  url: string;
  link_type: "official" | "map" | "reviews" | "tourism" | "michelin" | "reference";
  source_note?: string;
};

export type Poi = {
  id: string;
  slug: string;
  name: string;
  name_local?: string;
  city_region: CityRegion;
  categories: Category[];
  audience_tags: AudienceTag[];
  classic_level: ClassicLevel;
  short_intro: string;
  editor_reason: string;
  caution_reason: string;
  suggested_duration: string;
  transport_difficulty: "低" | "中" | "高";
  physical_intensity: "低" | "中" | "高";
  language_barrier: "低" | "中" | "高";
  reservation_required: boolean;
  latest_reservation_advice: string;
  price_level: string;
  official_url: string;
  map_url: string;
  source_urls: string[];
  review_summary: string;
  editor_note: string;
  family_fit_score?: number;
  fit_reason?: string;
  possible_mismatch?: string;
  best_use?: string;
  use_cases?: string[];
  transport_note?: string;
  verify_before?: string;
  content_status?: ContentStatus;
  rainy_day_suitable: boolean;
  night_suitable: boolean;
  easy_day_suitable: boolean;
  verification_status: VerificationStatus;
  images: PoiImage[];
  links: PoiLink[];
};

export type Vote = {
  poi_id: string;
  member_id: FamilyMemberId;
  interest_level: InterestLevel;
  note: string;
  updated_at?: string;
};

export type VoteInput = Omit<Vote, "updated_at">;
