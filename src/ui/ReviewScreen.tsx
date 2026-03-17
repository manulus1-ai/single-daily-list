import { useMemo, useState } from "react";
import { formatLongDate } from "../domain/date";
import { DailyItem, ReviewDecision } from "../domain/types";

const decisionLabel: Record<ReviewDecision, string> = {
  move: "Auf morgen verschieben",
  delete: "Loeschen",
  irrelevant: "Irrelevant"
};

type Props = {
  date: string;
  openItems: DailyItem[];
  onSubmit: (decisions: Record<string, ReviewDecision>) => void;
};

const ReviewScreen = ({ date, openItems, onSubmit }: Props) => {
  const [decisions, setDecisions] = useState<Record<string, ReviewDecision>>({});

  const allDecided = useMemo(
    () => openItems.every((i) => decisions[i.id]),
    [openItems, decisions]
  );

  return (
    <div className="app">
      <header className="header">
        <h1>Daily Review</h1>
        <div className="sub">Offene Items vom {formatLongDate(date)}</div>
      </header>

      <main className="list">
        {[...openItems]
          .sort((a, b) => (a.date === b.date ? a.title.localeCompare(b.title) : a.date.localeCompare(b.date)))
          .map((item) => (
            <div key={item.id} className="review-item">
              <div className="title">{item.title}</div>
              <div className="sub">{formatLongDate(item.date)}</div>
              <div className="review-actions">
                {(Object.keys(decisionLabel) as ReviewDecision[]).map((d) => (
                  <button
                    key={d}
                    className={decisions[item.id] === d ? "chip active" : "chip"}
                    onClick={() => setDecisions((prev) => ({ ...prev, [item.id]: d }))}
                  >
                    {decisionLabel[d]}
                  </button>
                ))}
              </div>
            </div>
          ))}
      </main>

      <footer className="footer">
        <button className="primary" disabled={!allDecided} onClick={() => onSubmit(decisions)}>
          Review abschliessen
        </button>
      </footer>
    </div>
  );
};

export default ReviewScreen;
