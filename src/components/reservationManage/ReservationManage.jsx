import { useEffect, useState } from "react";
import ReservationFilterBar from "./ReservationFilterBar";
import styles from "./ReservationManage.module.css";
import ReservationSummaryCard from "./ReservationSummaryCard";
import ReservationTable from "./ReservationTable";

export default function ReservationManage({ data, dateChange }) {
  const {
    totalReservationCount,
    afterReservationCount,
    userCancelCount,
    visitCount,
    selectedReservationCount,
    selectedAfterReservationCount,
    selectedCancelCount,
    selectedVisitCount,
    popupReservations,
  } = data;

  const today = new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(today);
  const [filters, setFilters] = useState({
    status: "",
    searchType: "email",
    keyword: "",
  });

  useEffect(() => {
    dateChange(selectedDate, filters);
  }, [selectedDate, filters]);

  const handleDate = (date) => {
    setSelectedDate(date);
  };

  const handleFilters = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>예약 관리</h1>

      <div className={styles.summaryWrapper}>
        <ReservationSummaryCard
          title="전체 예약 건수"
          value={totalReservationCount}
        />
        <ReservationSummaryCard
          title="전체 남은 예약 건수"
          value={afterReservationCount}
        />
        <ReservationSummaryCard
          title="전체 예약 취소 건수"
          value={userCancelCount}
        />
        <ReservationSummaryCard title="전체 방문 건수" value={visitCount} />
        <ReservationSummaryCard
          title="선택한 날짜의 예약 건수"
          value={selectedReservationCount}
        />
        <ReservationSummaryCard
          title="선택한 날짜의 남은 예약 건수"
          value={selectedAfterReservationCount}
        />
        <ReservationSummaryCard
          title="선택한 날짜의 예약 취소 건수"
          value={selectedCancelCount}
        />
        <ReservationSummaryCard
          title="선택한 날짜의 방문 건수"
          value={selectedVisitCount}
        />
      </div>

      <ReservationFilterBar
        selectedDate={selectedDate}
        setSelectedDate={handleDate}
        filters={filters}
        setFilters={handleFilters}
      />

      <ReservationTable data={popupReservations} />
    </div>
  );
}
