import HomeList from "@/components/home/HomeList";
import HomeSlide from "@/components/home/HomeSlide";
import { getPopups, getRandomPopups } from "@/services/popup.api";
import { useEffect, useState } from "react";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const [slideData, setSlideData] = useState([]);

  const [listData, setListData] = useState([]);
  const [cursor, setCursor] = useState(null);

  const [status, setStatus] = useState("ALL");
  const [keyword, setKeyword] = useState("");

  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);

  const [isSlideLoaded, setSlideLoaded] = useState(false);

  useEffect(() => {
    fetchSlideData();
  }, []);

  useEffect(() => {
    resetAndFetch();
  }, [status, keyword]);

  const fetchSlideData = async () => {
    const res = await getRandomPopups();
    if (res.success) {
      setSlideData(res.data ?? []);
    }
    setSlideLoaded(true);
  };

  const resetAndFetch = async () => {
    setCursor(null);
    setListData([]);
    setHasNext(true);
    await fetchPopupList(null);
  };

  const fetchPopupList = async (nextCursor) => {
    if (loading || !hasNext) return;

    setLoading(true);

    const res = await getPopups({
      cursor: nextCursor,
      status,
      keyword,
    });

    if (res.success) {
      setListData((prev) => [...prev, ...res.data.popups]);
      setCursor(res.data.nextCursor);

      if (!res.data.nextCursor) {
        setHasNext(false);
      }
    }

    setLoading(false);
  };

  if (!isSlideLoaded) {
    return <div>로딩중...</div>;
  }

  return (
    <div className={styles.page}>
      <HomeSlide data={slideData} />

      <HomeList
        data={listData}
        status={status}
        setStatus={setStatus}
        keyword={keyword}
        setKeyword={setKeyword}
        loadMore={() => fetchPopupList(cursor)}
        hasNext={hasNext}
      />
    </div>
  );
}
