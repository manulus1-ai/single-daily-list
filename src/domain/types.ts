export type RecurrenceType = "none" | "daily" | "weekly";
export type Status = "open" | "completed" | "irrelevant";

export type ItemTemplate = {
  id: string;
  title: string;
  recurrence_type: RecurrenceType;
  recurrence_days: number[]; // 0=So ... 6=Sa (nur bei weekly)
  requires_input: boolean;
};

export type DailyItem = {
  id: string;
  template_id: string | null;
  date: string; // YYYY-MM-DD
  title: string;
  status: Status;
  input_content?: string;
  created_manually: boolean;
};

export type ReviewDecision = "move" | "delete" | "irrelevant";
