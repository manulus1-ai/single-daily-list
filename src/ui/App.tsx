import { useEffect } from "react";
import { useStore } from "../state/useStore";
import TodayScreen from "./TodayScreen";
import ReviewScreen from "./ReviewScreen";

const App = () => {
  const store = useStore();

  useEffect(() => {
    if (!store.hydrated) return;
    store.ensureTodayGenerated();
    if (!store.needsReview) {
      store.setLastOpenedToToday();
    }
  }, [store.hydrated, store.needsReview]);

  useEffect(() => {
    if (!store.hydrated) return;
    if (store.needsReview) return;
    if (store.viewDate >= store.today) {
      store.ensureDateGenerated(store.viewDate);
    }
  }, [store.hydrated, store.needsReview, store.viewDate, store.today]);

  if (!store.hydrated) return null;

  if (store.needsReview) {
    return (
      <ReviewScreen
        date={store.today}
        openItems={store.openItemsFromPast}
        onSubmit={store.applyReview}
      />
    );
  }

  return (
    <TodayScreen
      date={store.viewDate}
      items={store.viewItems}
      onCreate={store.createItem}
      onUpdateStatus={store.updateItemStatus}
      onChangeDate={store.setSelectedDate}
      today={store.today}
    />
  );
};

export default App;
