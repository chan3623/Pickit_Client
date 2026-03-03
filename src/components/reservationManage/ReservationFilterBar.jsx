import { useEffect, useState } from "react";
import styles from "./ReservationManage.module.css";

export default function ReservationFilterBar({
  selectedDate,
  setSelectedDate,
  filters,
  setFilters,
  onSearch,
}) {
  const [localKeyword, setLocalKeyword] = useState(filters.keyword || "");

  // 상태, 검색타입은 즉시 반영
  const handleChange = (key, value) => {
    setFilters(key, value);
    if (onSearch) {
      onSearch();
    }
  };

  // debounce 적용
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localKeyword !== filters.keyword) {
        setFilters("keyword", localKeyword);
        if (onSearch) {
          onSearch();
        }
      }
    }, 500); // 0.5초 입력 멈추면 실행

    return () => clearTimeout(timer);
  }, [localKeyword]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFilters("keyword", localKeyword);
    if (onSearch) {
      onSearch();
    }
  };

  return (
    <form className={styles.filterBar} onSubmit={handleSubmit}>
      <div className={styles.dateBox}>
        <label>날짜 선택</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            if (onSearch) {
              onSearch();
            }
          }}
        />
      </div>

      {/* 상태 필터 */}
      <select
        value={filters.status}
        onChange={(e) => handleChange("status", e.target.value)}
      >
        <option value="">전체</option>
        <option value="COMPLETED">방문</option>
        <option value="RESERVED">예약</option>
        <option value="CANCELED_BY_USER">취소</option>
      </select>

      {/* 검색 타입 */}
      <select
        value={filters.searchType}
        onChange={(e) => handleChange("searchType", e.target.value)}
      >
        <option value="email">이메일</option>
        <option value="phone">휴대폰번호</option>
      </select>

      {/* 검색어 (debounce 적용) */}
      <input
        type="text"
        placeholder="검색어 입력"
        value={localKeyword}
        onChange={(e) => setLocalKeyword(e.target.value)}
      />
    </form>
  );
}
