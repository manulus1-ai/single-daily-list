import { useState } from "react";
import { RecurrenceType } from "../../domain/types";

const days = [
  { label: "Mo", value: 1 },
  { label: "Di", value: 2 },
  { label: "Mi", value: 3 },
  { label: "Do", value: 4 },
  { label: "Fr", value: 5 },
  { label: "Sa", value: 6 },
  { label: "So", value: 0 }
];

type Props = {
  onClose: () => void;
  onCreate: (
    title: string,
    recurrence: RecurrenceType,
    recurrence_days: number[],
    requires_input: boolean
  ) => void;
};

const NewItemForm = ({ onClose, onCreate }: Props) => {
  const [title, setTitle] = useState("");
  const [recurrence, setRecurrence] = useState<RecurrenceType>("none");
  const [recurrenceDays, setRecurrenceDays] = useState<number[]>([]);
  const [requiresInput, setRequiresInput] = useState(false);

  const toggleDay = (day: number) => {
    setRecurrenceDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const submit = () => {
    if (!title.trim()) return;
    const days = recurrence === "weekly" ? recurrenceDays : [];
    onCreate(title.trim(), recurrence, days, requiresInput);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Neues Item</h2>
          <button className="ghost" onClick={onClose}>
            ✕
          </button>
        </div>

        <label className="field">
          Titel
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>

        <label className="field">
          Wiederholung
          <select value={recurrence} onChange={(e) => setRecurrence(e.target.value as RecurrenceType)}>
            <option value="none">Keine</option>
            <option value="daily">Taeglich</option>
            <option value="weekly">Wochentage</option>
          </select>
        </label>

        {recurrence === "weekly" && (
          <div className="weekday">
            {days.map((d) => (
              <button
                key={d.value}
                className={recurrenceDays.includes(d.value) ? "chip active" : "chip"}
                onClick={() => toggleDay(d.value)}
              >
                {d.label}
              </button>
            ))}
          </div>
        )}

        <label className="field checkbox-line">
          <input
            type="checkbox"
            checked={requiresInput}
            onChange={(e) => setRequiresInput(e.target.checked)}
          />
          Eingabe erforderlich
        </label>

        <div className="modal-footer">
          <button className="secondary" onClick={onClose}>
            Abbrechen
          </button>
          <button className="primary" onClick={submit}>
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewItemForm;
