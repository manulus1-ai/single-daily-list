import { DailyItem, ItemTemplate } from "./types";

export type StoreData = {
  templates: ItemTemplate[];
  dailyItems: DailyItem[];
  lastOpenedDate: string | null;
};

const STORAGE_KEY = "single-daily-list-v1";

export const loadStore = (): StoreData => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { templates: [], dailyItems: [], lastOpenedDate: null };
  }
  try {
    const parsed = JSON.parse(raw) as StoreData;
    return {
      templates: parsed.templates ?? [],
      dailyItems: parsed.dailyItems ?? [],
      lastOpenedDate: parsed.lastOpenedDate ?? null
    };
  } catch {
    return { templates: [], dailyItems: [], lastOpenedDate: null };
  }
};

export const saveStore = (data: StoreData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};
