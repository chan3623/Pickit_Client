import styles from "./ReservationManage.module.css";

export default function Pagination({ page, totalPages, changePage }) {
  if (totalPages <= 1) return null;

  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className={styles.pagination}>
      <button disabled={page === 1} onClick={() => changePage(page - 1)}>
        이전
      </button>

      {pages.map((p) => (
        <button
          key={p}
          className={p === Number(page) ? styles.activePage : ""}
          onClick={() => changePage(p)}
        >
          {p}
        </button>
      ))}

      <button
        disabled={page === totalPages}
        onClick={() => changePage(page + 1)}
      >
        다음
      </button>
    </div>
  );
}
