import DefaultInfo from "@/components/detail/DefaultInfo";
import DetailInfo from "@/components/detail/DetailInfo";
import styles from "./DetailPage.module.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPopupDetail } from "@/services/detail.api";

export default function HomePage() {
  const { id } = useParams();

  const [data, setDate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getPopupDetail(id);
      if (response.status === 200) {
        setDate(response.data);
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
