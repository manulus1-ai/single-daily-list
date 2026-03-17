import { useState } from "react";
import { formatLongDate } from "../domain/date";
import { DailyItem, RecurrenceType, Status } from "../domain/types";
import ItemRow from "./components/ItemRow";
import NewItemForm from "./components/NewItemForm";

type Props = {
  date: string;
  items: DailyItem[];
  onCreate: (
    title: string,
    recurrence: RecurrenceType,
    recurrence_days: number[],
    requires_input: boolean
  ) => void;
  onUpdateStatus: (id: string, status: Status, input?: string) => void;
};

const TodayScreen = ({ date, items, onCreate, onUpdateStatus }: Props) => {
  const [showNew, setShowNew] = useState(false);

  return (
    <div className="app">
      <header className="header">
        <h1>{formatLongDate(date)}</h1>
      </header>

      <main className="list">
        {items.length === 0 && (
          <div className="empty">Keine Items fuer heute.</div>
        )}
        {items.map((item) => (
          <ItemRow key={item.id} item={item} onUpdate={onUpdateStatus} />
        ))}
      </main>

      {showNew && (
        <NewItemForm
          onClose={() => setShowNew(false)}
          onCreate={(title, recurrence, days, requiresInput) => {
            onCreate(title, recurrence, days, requiresInput);
            setShowNew(false);
          }}
        />
      )}

      <footer className="footer">
        <button className="primary" onClick={() => setShowNew(true)}>
          +
        </button>
      </footer>
    </div>
  );
};

export default TodayScreen;
