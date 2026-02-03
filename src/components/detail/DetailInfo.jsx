import { useEffect, useState } from "react";
import style from "./DetailInfo.module.css";
import { getPopup } from "@/services/detail.api";
import { useParams } from "react-router-dom";

export default function DetailInfo() {
  const { id } = useParams();
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getPopup(id);
      if (response.status === 200) {
        const popup = response.data;
        setPopup(popup)
      }
    };

    fetchData();
  }, [id]);
  
  return (
    <div className={style.detailBox}>
      <div className={style.titleInnerBox}>
        <h2>팝업스토어 소개</h2>

         <div className={style.telInnerBox}>
          <p>* 문의사항 </p>
          <p>010-1111-2222</p>
         </div>
      </div>

      <div className={style.textBox}>
        {popup?.description ? popup?.description : ''}
      </div>
    </div>
  );
}
