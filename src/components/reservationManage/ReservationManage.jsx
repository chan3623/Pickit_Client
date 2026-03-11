import { useEffect, useState } from "react";
import Pagination from "./Pagination";
import ReservationFilterBar from "./ReservationFilterBar";
import styles from "./ReservationManage.module.css";
import ReservationSummaryCard from "./ReservationSummaryCard";
import ReservationTable from "./ReservationTable";

export default function ReservationManage({
  data,
  dateChange,
  reservationStatusChange,
  page,
  changePage,
}) {
  const {
    totalReservationCount,
    afterReservationCount,
    noShowCount,
    userCancelCount,
    visitCount,
    selectedReservationCount,
    selectedAfterReservationCount,
    selectedNoShowCount,
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
        <ReservationSummaryCard title="총 예약" value={totalReservationCount} />
        <ReservationSummaryCard
          title="예약 대기"
          value={afterReservationCount}
        />
        <ReservationSummaryCard title="예약 취소" value={userCancelCount} />
        <ReservationSummaryCard title="미방문" value={noShowCount} />
        <ReservationSummaryCard title="방문 완료" value={visitCount} />

        <ReservationSummaryCard
          title="선택일 예약"
          value={selectedReservationCount}
        />
        <ReservationSummaryCard
          title="선택일 예약 예정"
          value={selectedAfterReservationCount}
        />
        <ReservationSummaryCard
          title="선택일 취소"
          value={selectedCancelCount}
        />
        <ReservationSummaryCard
          title="선택일 미방문"
          value={selectedNoShowCount}
        />
        <ReservationSummaryCard
          title="선택일 방문"
          value={selectedVisitCount}
        />
      </div>

      <ReservationFilterBar
        selectedDate={selectedDate}
        setSelectedDate={handleDate}
        filters={filters}
        setFilters={handleFilters}
      />

      <ReservationTable
        data={popupReservations}
        reservationStatusChange={reservationStatusChange}
      />

      <Pagination
        page={page}
        totalPages={data.totalPages}
        changePage={changePage}
      />
    </div>
  );
}
