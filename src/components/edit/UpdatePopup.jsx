// UpdatePopup.jsx

import { postNewPopup } from "@/services/popup.api.js";
import { useEffect, useRef, useState } from "react";
import { ENV } from "../../config/env";
import styles from "./UpdatePopup.module.css";
const DAYS = [
  { key: 1, label: "월요일" },
  { key: 2, label: "화요일" },
  { key: 3, label: "수요일" },
  { key: 4, label: "목요일" },
  { key: 5, label: "금요일" },
  { key: 6, label: "토요일" },
  { key: 7, label: "일요일" },
];

const INTERVAL_OPTIONS = [30, 60, 90, 120];

export default function UpdatePopup({ popupData }) {
  const { popup, dayOfInfo } = popupData;

  /* =========================
     조회 데이터 → 폼 매핑
  ========================== */
  useEffect(() => {
    if (!popupData?.popup || !Array.isArray(popupData.dayOfInfo)) return;
  }, [popupData]);

  const formatDate = (date) => {
    const newDate = new Date(date);
    newDate.setHours(newDate.getHours() + 9);

    return newDate.toISOString().split("T")[0];
  };
  const fileRef = useRef(null);
  const addressContainerRef = useRef(null);

  const [isAddressOpen, setIsAddressOpen] = useState(false);

  const [data, setData] = useState({
    title: popup.title,
    startDate: formatDate(popup.startDate),
    endDate: formatDate(popup.endDate),
    address: popup.address,
    detailAddress: "",
    description: popup.description,
    tel: popup.tel,
    park: popup.park,
    isFree: popup.isFree,
    image: null,
  });

  const [days, setDays] = useState(
    DAYS.map((day) => {
      const match = dayOfInfo.find((info) => info.dayOfWeek === day.key);

      if (!match) {
        return {
          day: day.key,
          label: day.label,
          isOpen: false,
          openTime: "10:00",
          closeTime: "20:00",
          slotMinute: 30,
          slot: 0,
        };
      }

      return {
        day: day.key,
        label: day.label,
        isOpen: true,
        openTime: match.openTime.slice(0, 5),
        closeTime: match.closeTime.slice(0, 5),
        slotMinute: match.slotMinute,
        slot: match.capacityPerSlot,
      };
    }),
  );

  const [preview, setPreview] = useState(
    `${ENV.API_BASE_URL}${popup.imagePath}`,
  );

  /* ========================= */

  useEffect(() => {
    if (document.getElementById("daum-postcode-script")) return;

    const script = document.createElement("script");
    script.id = "daum-postcode-script";
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!isAddressOpen || !window.daum || !addressContainerRef.current) return;

    addressContainerRef.current.innerHTML = "";

    new window.daum.Postcode({
      oncomplete: (addr) => {
        setData((prev) => ({
          ...prev,
          address: addr.address,
        }));
        setIsAddressOpen(false);
      },
    }).embed(addressContainerRef.current);
  }, [isAddressOpen]);

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
    }));

    setPreview(URL.createObjectURL(file));
  };

  const updateSchedule = (index, patch) => {
    setDays((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, ...patch } : item)),
    );
  };

  const toggleDay = (index) => {
    updateSchedule(index, {
      isOpen: !days[index].isOpen,
    });
  };

  const updatePopup = async () => {
    const formData = new FormData();

    const address = `${data.address} ${data.detailAddress}`;

    formData.append("title", data.title);
    formData.append("startDate", data.startDate);
    formData.append("endDate", data.endDate);
    formData.append("address", address);
    formData.append("description", data.description);
    formData.append("tel", data.tel);
    formData.append("park", data.park);
    formData.append("isFree", data.isFree);
    if (data.image) formData.append("image", data.image);

    const dayInfos = days
      .filter((item) => item.isOpen)
      .map((day) => ({
        openTime: day.openTime,
        closeTime: day.closeTime,
        slotMinute: Number(day.slotMinute),
        capacityPerSlot: Number(day.slot),
        dayOfWeek: Number(day.day),
      }));

    formData.append("dayInfos", JSON.stringify(dayInfos));

    await postNewPopup(formData);
  };

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1>팝업스토어 수정</h1>
        <p>팝업스토어 기본 정보를 수정합니다.</p>
      </header>

      <section className={styles.card}>
        <div className={styles.field}>
          <label>팝업스토어 제목</label>
          <input name="title" value={data.title} onChange={onChange} />
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

        {/* 주소 */}
        <div className={styles.field}>
          <label>주소</label>
          <div className={styles.addressRow}>
            <input
              name="address"
              value={data.address}
              readOnly
              placeholder="주소 검색 버튼을 눌러주세요"
            />
            <button type="button" onClick={() => setIsAddressOpen(true)}>
              주소 검색
            </button>
          </div>
        </div>

        <div className={styles.field}>
          <label>상세 주소</label>
          <input
            name="detailAddress"
            value={data.detailAddress}
            onChange={onChange}
            placeholder="건물명, 층, 호수 등"
          />
        </div>

        <div className={styles.field}>
          <label>설명</label>
          <textarea
            name="description"
            value={data.description}
            onChange={onChange}
          />
        </div>

        <div className={styles.field}>
          <label>전화번호</label>
          <input name="tel" value={data.tel} onChange={onChange} />
        </div>

        <div className={styles.optionSection}>
          <div className={styles.optionHeader}>
            <h3>이용 정보 선택</h3>
            <p>선택하지 않은 항목은 기본값으로 안내됩니다.</p>
          </div>

          <div className={styles.optionGroup}>
            <label
              className={`${styles.optionCard} ${
                data.park ? styles.active : ""
              }`}
            >
              <input
                type="checkbox"
                name="park"
                checked={data.park}
                onChange={onChange}
              />
              <div className={styles.optionText}>
                <strong>주차</strong>
                {data.park ? (
                  <span className={styles.onText}>주차 이용 가능</span>
                ) : (
                  <span className={styles.offText}>주차 이용 불가</span>
                )}
              </div>
            </label>

            <label
              className={`${styles.optionCard} ${
                data.isFree ? styles.active : ""
              }`}
            >
              <input
                type="checkbox"
                name="isFree"
                checked={data.isFree}
                onChange={onChange}
              />
              <div className={styles.optionText}>
                <strong>입장료</strong>
                {data.isFree ? (
                  <span className={styles.onText}>무료 입장</span>
                ) : (
                  <span className={styles.offText}>유료 입장</span>
                )}
              </div>
            </label>
          </div>
        </div>

        <div className={styles.scheduleSection}>
          <div className={styles.optionHeader}>
            <h3>요일별 운영 시간</h3>
            <p>요일 카드를 클릭해 운영 여부를 설정하세요.</p>
          </div>

          {days.map((day, idx) => (
            <div
              key={day.day}
              className={`${styles.scheduleRow} ${
                day.isOpen ? styles.active : ""
              }`}
              onClick={() => toggleDay(idx)}
            >
              {/* 요일 표시 */}
              <div className={styles.dayInfo}>
                <strong>{day.label}</strong>
                <span>{day.isOpen ? "운영" : "휴무"}</span>
              </div>

              {/* 시간 */}
              <input
                type="time"
                disabled={!day.isOpen}
                value={day.openTime}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) =>
                  updateSchedule(idx, { openTime: e.target.value })
                }
              />

              <span className={styles.wave}>~</span>

              <input
                type="time"
                disabled={!day.isOpen}
                value={day.closeTime}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) =>
                  updateSchedule(idx, { closeTime: e.target.value })
                }
              />

              {/* 텀 */}
              <select
                disabled={!day.isOpen}
                value={day.slotMinute}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) =>
                  updateSchedule(idx, {
                    slotMinute: Number(e.target.value),
                  })
                }
              >
                {INTERVAL_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}분
                  </option>
                ))}
              </select>

              <input
                type="number"
                disabled={!day.isOpen}
                value={day.slot}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => updateSchedule(idx, { slot: e.target.value })}
              />
            </div>
          ))}
        </div>

        <div className={styles.posterSection}>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={onImageChange}
            className={styles.hiddenFile}
          />

          <div
            className={styles.posterPreview}
            onClick={() => fileRef.current.click()}
          >
            {preview ? (
              <img src={preview} alt="포스터 미리보기" />
            ) : (
              <div className={styles.posterPlaceholder}>
                <strong>포스터 이미지</strong>
                <span>클릭하여 업로드</span>
                <em>권장 비율 3:4</em>
              </div>
            )}
          </div>

          <div className={styles.posterPanel}>
            <h3>팝업스토어 이미지</h3>
            <p className={styles.posterDesc}>
              리스트 및 상세 페이지에서 노출되는 이미지입니다.
            </p>

            <button
              type="button"
              className={styles.selectBtn}
              onClick={() => fileRef.current.click()}
            >
              {data.image ? "이미지 변경" : "이미지 선택"}
            </button>

            {data.image && (
              <div className={styles.fileInfo}>
                <span className={styles.fileLabel}>선택된 파일</span>
                <span className={styles.fileName}>{data.image.name}</span>
              </div>
            )}

            <ul className={styles.guideList}>
              <li>권장 해상도: 1080 × 1440</li>
              <li>JPG, PNG 형식</li>
              <li>고화질 이미지 권장</li>
            </ul>
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={updatePopup}>수정하기</button>
        </div>
      </section>

      {/* 주소 검색 레이어 */}
      {isAddressOpen && (
        <div className={styles.addressOverlay}>
          <div className={styles.addressLayer}>
            <div className={styles.addressHeader}>
              <strong>주소 검색</strong>
              <button onClick={() => setIsAddressOpen(false)}>닫기</button>
            </div>
            <div ref={addressContainerRef} className={styles.addressContent} />
          </div>
        </div>
      )}
    </div>
  );
}
