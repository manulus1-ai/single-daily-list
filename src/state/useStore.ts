import { useEffect, useMemo, useState } from "react";
import { addDays, todayLocalISO } from "../domain/date";
import {
  applyCompletion,
  applyReviewDecisions,
  createManualItem,
  generateDailyItemsForRange,
  isBefore,
  resolveToday
} from "../domain/logic";
import { loadStore, saveStore } from "../domain/storage";
import { DailyItem, ItemTemplate, ReviewDecision, Status } from "../domain/types";

export const useStore = () => {
  const [templates, setTemplates] = useState<ItemTemplate[]>([]);
  const [dailyItems, setDailyItems] = useState<DailyItem[]>([]);
  const [lastOpenedDate, setLastOpenedDate] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
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

  useEffect(() => {
    if (!hydrated) return;
    setSelectedDate(today);
  }, [hydrated, today]);

  const openItemsFromPast = useMemo(() => {
    if (!lastOpenedDate) return [];
    if (lastOpenedDate === today) return [];
    return dailyItems.filter((i) => i.status === "open" && isBefore(i.date, today));
  }, [dailyItems, lastOpenedDate, today]);

  const needsReview = openItemsFromPast.length > 0 && lastOpenedDate !== today;

  const ensureTodayGenerated = () => {
    setDailyItems((prev) => {
      if (!lastOpenedDate) return generateDailyItemsForRange(templates, prev, today, today);
      const start = lastOpenedDate < today ? addDays(lastOpenedDate, 1) : today;
      return generateDailyItemsForRange(templates, prev, start, today);
    });
  };

  const ensureDateGenerated = (date: string) => {
    setDailyItems((prev) => generateDailyItemsForRange(templates, prev, date, date));
  };

  const setLastOpenedToToday = () => setLastOpenedDate(today);

  const createItem = (
    title: string,
    recurrence: "none" | "daily" | "weekly",
    recurrence_days: number[],
    requires_input: boolean,
    date: string
  ) => {
    const result = createManualItem(
      title,
      recurrence,
      recurrence_days,
      requires_input,
      date,
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

  const viewDate = selectedDate ?? today;

  const viewItems = useMemo(
    () => dailyItems.filter((i) => i.date === viewDate),
    [dailyItems, viewDate]
  );

  return {
    hydrated,
    templates,
    dailyItems,
    today,
    viewDate,
    viewItems,
    selectedDate,
    setSelectedDate,
    needsReview,
    openItemsFromPast,
    ensureTodayGenerated,
    ensureDateGenerated,
    setLastOpenedToToday,
    createItem,
    updateItemStatus,
    applyReview
  };
};
