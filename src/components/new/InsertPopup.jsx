import { postNewPopup } from "@/services/popup.api.js";
import { useEffect, useRef, useState } from "react";
import styles from "./InsertPopup.module.css";

export default function InsertPopup() {
  const fileRef = useRef(null);
  const addressContainerRef = useRef(null);

  const [isAddressOpen, setIsAddressOpen] = useState(false);

  const [data, setData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    address: "",
    detailAddress: "",
    description: "",
    tel: "",
    park: false,
    isFree: false,
    image: null,
  });

  const [preview, setPreview] = useState(null);

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

  const createPopup = async () => {
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
    formData.append("image", data.image);

    const response = await postNewPopup(formData);

    console.log("response : ", response);
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
                  <span className={styles.onText}>주차 공간 없음</span>
                ) : (
                  <span className={styles.offText}>주차 이용 가능</span>
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
                  <span className={styles.onText}>유료 입장</span>
                ) : (
                  <span className={styles.offText}>무료 입장</span>
                )}
              </div>
            </label>
          </div>
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
          <button onClick={createPopup}>등록하기</button>
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
