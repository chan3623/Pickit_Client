import { showConfirm, showError, showSuccess } from "@/lib/swal.js";
import {
  getReservationManage,
  updateReservationStatus,
} from "@/services/popup.api.js";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReservationManage from "../../components/reservationManage/ReservationManage";
import styles from "./ReservationManagePage.module.css";

const today = new Date().toISOString().split("T")[0];

export default function ReservationManagePage() {
  const [data, setData] = useState(null);
  const [filters, setFilters] = useState({ date: today });

  const [page, setPage] = useState(1);
  const limit = 10;

  const location = useLocation();
  const popupId = location.state?.popupId;
  const navigate = useNavigate();

  const fetchReservationManage = async (options, targetPage = 1) => {
    const response = await getReservationManage(popupId, {
      ...options,
      page: targetPage,
      limit,
    });

    if (response.success) {
      setData(response.data);
      setPage(targetPage);
    } else {
      setData(null);
    }
  };

  useEffect(() => {
    if (!popupId) {
      navigate("/manager");
      return;
    }

    fetchReservationManage(filters, 1);
  }, [popupId]);

  const dateChange = async (date, filterValues) => {
    const email =
      filterValues.searchType === "email" ? filterValues.keyword : "";

    const phone =
      filterValues.searchType === "phone" ? filterValues.keyword : "";

    const searchOptions = {
      date,
      status: filterValues.status,
      email,
      phone,
    };

    setFilters(searchOptions);

    await fetchReservationManage(searchOptions, 1);
  };

  const changePage = async (targetPage) => {
    await fetchReservationManage(filters, targetPage);
  };

  const reservationStatusChange = async (payload) => {
    const message = { error: "처리 도중 문제가 발생하였습니다." };

    if (payload.status === "COMPLETED") {
      message.before = "해당 예약을 방문 처리하시겠습니까?";
      message.after = "방문 처리되었습니다.";
    } else if (payload.status === "NO_SHOW") {
      message.before = "해당 예약을 미방문 처리하시겠습니까?";
      message.after = "미방문 처리되었습니다.";
    } else {
      return;
    }

    const isConfirm = await showConfirm(message.before);

    if (isConfirm) {
      try {
        const response = await updateReservationStatus(payload);

        if (response.success) {
          showSuccess(message.after);
        } else {
          showError(message.error);
        }

        await fetchReservationManage(filters, page);
      } catch (e) {
        showError(e.customMessage);
      }
    }
  };

  if (!data) return null;

  return (
    <div className={styles.page}>
      <ReservationManage
        data={data}
        dateChange={dateChange}
        reservationStatusChange={reservationStatusChange}
        page={page}
        changePage={changePage}
      />
    </div>
  );
}
