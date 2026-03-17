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
      date={store.today}
      items={store.todayItems}
      onCreate={store.createItem}
      onUpdateStatus={store.updateItemStatus}
    />
  );
};

export default App;
