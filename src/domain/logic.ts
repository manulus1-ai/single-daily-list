import { DailyItem, ItemTemplate, RecurrenceType, ReviewDecision, Status } from "./types";
import { addDays, parseISODate, todayLocalISO } from "./date";

export const makeId = () => crypto.randomUUID();

export const shouldGenerateForDate = (template: ItemTemplate, isoDate: string): boolean => {
  if (template.recurrence_type === "daily") return true;
  if (template.recurrence_type === "weekly") {
    const day = parseISODate(isoDate).getDay();
    return template.recurrence_days.includes(day);
  }
  return false;
};

export const generateDailyItemsForDate = (
  templates: ItemTemplate[],
  existingItems: DailyItem[],
  isoDate: string
): DailyItem[] => {
  const itemsForDate = existingItems.filter((i) => i.date === isoDate);
  const newItems: DailyItem[] = [];

  for (const t of templates) {
    if (t.recurrence_type === "none") continue;
    if (!shouldGenerateForDate(t, isoDate)) continue;
    const already = itemsForDate.some((i) => i.template_id === t.id);
    if (!already) {
      newItems.push({
        id: makeId(),
        template_id: t.id,
        date: isoDate,
        title: t.title,
        status: "open",
        input_content: t.requires_input ? "" : undefined,
        created_manually: false
      });
    }
  }

  return [...existingItems, ...newItems];
};

export const generateDailyItemsForRange = (
  templates: ItemTemplate[],
  existingItems: DailyItem[],
  startDate: string,
  endDate: string
): DailyItem[] => {
  let updated = [...existingItems];
  const range = datesBetween(startDate, endDate);
  for (const date of range) {
    updated = generateDailyItemsForDate(templates, updated, date);
  }
  return updated;
};

export const createManualItem = (
  title: string,
  recurrence: RecurrenceType,
  recurrence_days: number[],
  requires_input: boolean,
  isoDate: string,
  templates: ItemTemplate[],
  dailyItems: DailyItem[]
): { templates: ItemTemplate[]; dailyItems: DailyItem[] } => {
  if (recurrence === "none") {
    const item: DailyItem = {
      id: makeId(),
      template_id: null,
      date: isoDate,
      title,
      status: "open",
      input_content: requires_input ? "" : undefined,
      created_manually: true
    };
    return { templates, dailyItems: [...dailyItems, item] };
  }

  const template: ItemTemplate = {
    id: makeId(),
    title,
    recurrence_type: recurrence,
    recurrence_days,
    requires_input
  };

  const newTemplates = [...templates, template];
  const newDailyItems = generateDailyItemsForDate(newTemplates, dailyItems, isoDate);

  return { templates: newTemplates, dailyItems: newDailyItems };
};

export const applyCompletion = (
  item: DailyItem,
  status: Status,
  input_content?: string
): DailyItem => ({
  ...item,
  status,
  input_content: input_content ?? item.input_content
});

export const getOpenItemsFromDate = (items: DailyItem[], isoDate: string) =>
  items.filter((i) => i.date === isoDate && i.status === "open");

export const applyReviewDecisions = (
  items: DailyItem[],
  decisions: Record<string, ReviewDecision>,
  targetDate: string
): DailyItem[] => {
  let updated = [...items];

  for (const item of items) {
    if (item.status !== "open") continue;
    const decision = decisions[item.id];
    if (!decision) continue;

    if (decision === "move") {
      const moved: DailyItem = {
        ...item,
        id: makeId(),
        date: targetDate,
        status: "open"
      };
      updated = updated.filter((i) => i.id !== item.id);
      updated.push(moved);
    }

    if (decision === "delete") {
      updated = updated.filter((i) => i.id !== item.id);
    }

    if (decision === "irrelevant") {
      updated = updated.map((i) => (i.id === item.id ? { ...i, status: "irrelevant" } : i));
    }
  }

  return updated;
};

export const datesBetween = (start: string, end: string): string[] => {
  const dates: string[] = [];
  let cursor = start;
  while (cursor <= end) {
    dates.push(cursor);
    cursor = addDays(cursor, 1);
  }
  return dates;
};

export const isBefore = (a: string, b: string) => a < b;


export const resolveToday = (lastOpenedDate: string | null) => {
  const today = todayLocalISO();
  return { today, lastOpenedDate };
};
