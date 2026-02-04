import { useEffect, useState } from "react";
import style from "./DetailInfo.module.css";
import { getPopupDescription } from "@/services/detail.api";
import { useParams } from "react-router-dom";

const formatPhoneNumber = (tel) => {
  if (!tel) return '';

  const onlyNumber = tel.replace(/\D/g, '');

  if (onlyNumber.length === 11) {
    return onlyNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  }

  if (onlyNumber.length === 10) {
    return onlyNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  }

  return tel;
};

export default function DetailInfo() {
  const { id } = useParams();
  const [detail, setDetail] = useState({ description: '', tel: '' });

  useEffect(() => {
    const fetchData = async () => {
      const response = await getPopupDescription(id);
      if (response.status === 200) {
        setDetail(response.data);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className={style.detailBox}>
      <div className={style.titleInnerBox}>
        <h2>팝업스토어 소개</h2>

        <div className={style.telInnerBox}>
          <p>* 문의사항</p>
          <p>{formatPhoneNumber(detail.tel)}</p>
        </div>
      </div>

      <div className={style.textBox}>
        {detail.description}
      </div>
    </div>
  );
}
