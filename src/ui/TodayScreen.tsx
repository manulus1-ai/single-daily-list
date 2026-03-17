import { useState } from "react";
import { addDays, formatLongDate } from "../domain/date";
import { DailyItem, RecurrenceType, Status } from "../domain/types";
import ItemRow from "./components/ItemRow";
import NewItemForm from "./components/NewItemForm";

type Props = {
  date: string;
  today: string;
  items: DailyItem[];
  onCreate: (
    title: string,
    recurrence: RecurrenceType,
    recurrence_days: number[],
    requires_input: boolean,
    date: string
  ) => void;
  onUpdateStatus: (id: string, status: Status, input?: string) => void;
  onChangeDate: (date: string) => void;
};

const TodayScreen = ({ date, today, items, onCreate, onUpdateStatus, onChangeDate }: Props) => {
  const [showNew, setShowNew] = useState(false);

  const offsetDate = (days: number) => addDays(date, days);

  return (
    <div className="app">
      <header className="header">
        <div className="date-nav">
          <button className="ghost" onClick={() => onChangeDate(offsetDate(-1))}>
            ◀
          </button>
          <div className="date-display">
            <h1>{formatLongDate(date)}</h1>
            <input
              type="date"
              value={date}
              onChange={(e) => e.target.value && onChangeDate(e.target.value)}
            />
          </div>
          <button className="ghost" onClick={() => onChangeDate(offsetDate(1))}>
            ▶
          </button>
        </div>
        {date !== today && (
          <button className="link" onClick={() => onChangeDate(today)}>
            Zurueck zu heute
          </button>
        )}
      </header>

      <main className="list">
        {items.length === 0 && (
          <div className="empty">Keine Items fuer diesen Tag.</div>
        )}
        {items.map((item) => (
          <ItemRow key={item.id} item={item} onUpdate={onUpdateStatus} />
        ))}
      </main>

      {showNew && (
        <NewItemForm
          onClose={() => setShowNew(false)}
          onCreate={(title, recurrence, days, requiresInput) => {
            onCreate(title, recurrence, days, requiresInput, date);
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
