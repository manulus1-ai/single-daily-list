import { useState } from "react";
import { DailyItem, Status } from "../../domain/types";

type Props = {
  item: DailyItem;
  onUpdate: (id: string, status: Status, input?: string) => void;
};

const ItemRow = ({ item, onUpdate }: Props) => {
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState(item.input_content ?? "");

  const toggle = () => {
    if (item.input_content !== undefined) return;
    if (item.status === "completed") {
      onUpdate(item.id, "open", item.input_content);
    } else {
      onUpdate(item.id, "completed", item.input_content);
    }
  };

  const saveInput = () => {
    onUpdate(item.id, "completed", input);
    setEditing(false);
  };

  return (
    <div className={item.status === "completed" ? "item completed" : "item"}>
      <label className="checkbox">
        <input
          type="checkbox"
          checked={item.status === "completed"}
          onChange={toggle}
          disabled={item.input_content !== undefined && item.status !== "completed"}
        />
      </label>
      <div className="content">
        <div className="title">{item.title}</div>
        {item.input_content !== undefined && (
          <div className="input-area">
            {!editing && (
              <button className="link" onClick={() => setEditing(true)}>
                {item.input_content?.trim() ? "Eingabe bearbeiten" : "Eingabe"}
              </button>
            )}
            {editing && (
              <div className="input-edit">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={3}
                  placeholder="Deine Eingabe..."
                />
                <button className="secondary" onClick={saveInput}>
                  Speichern
                </button>
              </div>
            )}
            {item.input_content?.trim() && !editing && (
              <div className="input-preview">{item.input_content}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemRow;
