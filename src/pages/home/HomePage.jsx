import HomeList from "@/components/home/HomeList";
import HomeSlide from "@/components/home/HomeSlide";
import { getPopups, getRandomPopups } from "@/services/popup.api";
import { useEffect, useState } from "react";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const [slideData, setSlideData] = useState([]);
  const [listData, setListData] = useState([]);
  const [isSlideLoaded, setSlideLoaded] = useState(false);
  const [isListLoaded, setListLoaded] = useState(false);

  useEffect(() => {
    const fetchPopupSlideData = async () => {
      const response = await getRandomPopups();
      console.log("homePage response : ", response);
      if (response.success) {
        setSlideData(response.data ?? []);
      }
      setSlideLoaded(true);
    };

    const fetchPopupListData = async () => {
      const response = await getPopups();
      if (response.success) {
        setListData(response.data ?? []);
      }
      setListLoaded(true);
    };

    fetchPopupSlideData();
    fetchPopupListData();
  }, []);

  if (!isSlideLoaded || !isListLoaded) {
    return <div>로딩중...</div>;
  }

  return (
    <div className={styles.page}>
      <HomeSlide data={slideData} />
      <HomeList data={listData} />
    </div>
  );
}
