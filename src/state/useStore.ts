import { useEffect, useMemo, useState } from "react";
import { todayLocalISO } from "../domain/date";
import {
  applyCompletion,
  applyReviewDecisions,
  createManualItem,
  generateDailyItemsForDate,
  getOpenItemsFromDate,
  resolveToday
} from "../domain/logic";
import { loadStore, saveStore } from "../domain/storage";
import { DailyItem, ItemTemplate, ReviewDecision, Status } from "../domain/types";

export const useStore = () => {
  const [templates, setTemplates] = useState<ItemTemplate[]>([]);
  const [dailyItems, setDailyItems] = useState<DailyItem[]>([]);
  const [lastOpenedDate, setLastOpenedDate] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const data = loadStore();
    setTemplates(data.templates);
    setDailyItems(data.dailyItems);
    setLastOpenedDate(data.lastOpenedDate);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveStore({ templates, dailyItems, lastOpenedDate });
  }, [templates, dailyItems, lastOpenedDate, hydrated]);

  const { today } = resolveToday(lastOpenedDate);

  const openItemsFromYesterday = useMemo(() => {
    if (!lastOpenedDate) return [];
    if (lastOpenedDate === today) return [];
    const open = getOpenItemsFromDate(dailyItems, lastOpenedDate);
    return open;
  }, [dailyItems, lastOpenedDate, today]);

  const needsReview = openItemsFromYesterday.length > 0 && lastOpenedDate !== today;

  const ensureTodayGenerated = () => {
    setDailyItems((prev) => generateDailyItemsForDate(templates, prev, today));
  };

  const setLastOpenedToToday = () => setLastOpenedDate(today);

  const createItem = (
    title: string,
    recurrence: "none" | "daily" | "weekly",
    recurrence_days: number[],
    requires_input: boolean
  ) => {
    const result = createManualItem(
      title,
      recurrence,
      recurrence_days,
      requires_input,
      today,
      templates,
      dailyItems
    );
    setTemplates(result.templates);
    setDailyItems(result.dailyItems);
  };

  const updateItemStatus = (id: string, status: Status, input?: string) => {
    setDailyItems((prev) =>
      prev.map((i) => (i.id === id ? applyCompletion(i, status, input) : i))
    );
  };

  const applyReview = (decisions: Record<string, ReviewDecision>) => {
    const targetDate = todayLocalISO();
    setDailyItems((prev) => applyReviewDecisions(prev, decisions, targetDate));
    setLastOpenedDate(targetDate);
  };

  const todayItems = useMemo(
    () => dailyItems.filter((i) => i.date === today),
    [dailyItems, today]
  );

  return {
    hydrated,
    templates,
    dailyItems,
    today,
    todayItems,
    needsReview,
    openItemsFromYesterday,
    ensureTodayGenerated,
    setLastOpenedToToday,
    createItem,
    updateItemStatus,
    applyReview
  };
};
