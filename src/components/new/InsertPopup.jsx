import { useState } from "react";
import styles from "./InsertPopup.module.css";
import { ENV } from "@/config/env";

export default function InsertPopup() {
  const [data, setData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    address: "",
    description: "",
    phone: "",
    parking: false,
    paid: false,
    image: null,
    preview: null,
  });

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setData((prev) => ({
      ...prev,
      image: file,
      preview: URL.createObjectURL(file),
    }));
  };

  const submit = async () => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key !== "preview") formData.append(key, value);
    });

    await fetch(`${ENV.API_BASE_URL}/manager/popups`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });
  };

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1>팝업스토어 등록</h1>
        <p>팝업스토어 기본 정보를 입력하세요</p>
      </header>

      <section className={styles.card}>
        <div className={styles.field}>
          <label>팝업스토어 제목</label>
          <input
            name="title"
            value={data.title}
            onChange={onChange}
            placeholder="팝업스토어 이름"
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label>시작일</label>
            <input
              type="date"
              name="startDate"
              value={data.startDate}
              onChange={onChange}
            />
          </div>

          <div className={styles.field}>
            <label>종료일</label>
            <input
              type="date"
              name="endDate"
              value={data.endDate}
              onChange={onChange}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label>주소</label>
          <input
            name="address"
            value={data.address}
            onChange={onChange}
            placeholder="주소를 입력하세요"
          />
        </div>

        <div className={styles.field}>
          <label>설명</label>
          <textarea
            name="description"
            value={data.description}
            onChange={onChange}
            placeholder="팝업스토어에 대한 설명을 입력하세요"
          />
        </div>

        <div className={styles.field}>
          <label>전화번호</label>
          <input
            name="phone"
            value={data.phone}
            onChange={onChange}
            placeholder="010-0000-0000"
          />
        </div>

        <div className={styles.toggleGroup}>
          <label>
            <input
              type="checkbox"
              name="parking"
              checked={data.parking}
              onChange={onChange}
            />
            주차 가능
          </label>

          <label>
            <input
              type="checkbox"
              name="paid"
              checked={data.paid}
              onChange={onChange}
            />
            유료 입장
          </label>
        </div>

        <div className={styles.imageBox}>
          <label>대표 이미지</label>
          <input type="file" accept="image/*" onChange={onImageChange} />

          {data.preview && (
            <div className={styles.preview}>
              <img src={data.preview} alt="미리보기" />
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <button onClick={submit}>등록하기</button>
        </div>
      </section>
    </div>
  );
}
