import styles from "./ReservationManage.module.css";

export default function ReservationTable({ data }) {
  const changeStatus = (status) => {
    switch (status) {
      case "RESERVED":
        return "예약 완료";
      case "COMPLETED":
        return "방문 완료";
      case "CANCELED_BY_USER":
        return "예약 취소";
      default:
        return "";
    }
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return "";

    const cleaned = phone.replace(/[^0-9]/g, "");

    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    }

    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    }

    return phone;
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>예약자</th>
            <th>휴대폰</th>
            <th>날짜</th>
            <th>시간</th>
            <th className={styles.centerColumn}>인원</th>
            <th className={styles.centerColumn}>상태</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="6" className={styles.empty}>
                해당 날짜의 예약이 없습니다.
              </td>
            </tr>
          ) : (
            data.flatMap((item) =>
              item.reservationInfos.map((info) => (
                <tr key={`${item.id}-${info.id}`}>
                  <td>{info.userEmail}</td>
                  <td>{formatPhoneNumber(info.reserverPhone)}</td>
                  <td>{item.date}</td>
                  <td>{item.time}</td>
                  <td className={styles.centerColumn}>{info.quantity}</td>
                  <td className={styles.centerColumn}>
                    <span
                      className={`${styles.status} ${
                        styles[info.status.toLowerCase()]
                      }`}
                    >
                      {changeStatus(info.status)}
                    </span>
                  </td>
                </tr>
              )),
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
