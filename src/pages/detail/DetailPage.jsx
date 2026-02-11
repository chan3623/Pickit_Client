import DefaultInfo from "@/components/detail/DefaultInfo";
import DetailInfo from "@/components/detail/DetailInfo";
import { getPopupDetail } from "@/services/detail.api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./DetailPage.module.css";

export default function HomePage() {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getPopupDetail(id);
      if (response.status === 200) {
        setData(response.data);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div>로딩중...</div>;

  return (
    <div className={styles.page}>
      <DefaultInfo data={data} />
      <DetailInfo data={data.popup} />
    </div>
  );
}
