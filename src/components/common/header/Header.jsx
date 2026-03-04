import { UserAuthContext } from "@/auth/user/UserAuthContext";
import { showSuccess } from "@/lib/swal";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

export default function Header({
  onLoginClick,
  notifications,
  readNotification,
}) {
  const { account, handleLogout } = useContext(UserAuthContext);
  const navigate = useNavigate();

  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const notifBoxRef = useRef(null);
  const userBoxRef = useRef(null);

  const unreadCount = useMemo(() => {
    const count = notifications.filter((n) => !n.isRead).length;
    return count > 99 ? "99+" : count;
  }, [notifications]);

  const handleClickLogo = () => navigate("/home");
  const handleLoginClick = () => !account && onLoginClick();
  const handleToggleLogout = () => account && setIsLogoutOpen((prev) => !prev);
  const handleToggleNotifications = () => setIsNotifOpen((prev) => !prev);

  const handleClickLogout = () => {
    handleLogout("manual");
    showSuccess("로그아웃 되었습니다.");
    setIsLogoutOpen(false);
    navigate("/home");
  };

  const handleMoveMyReservation = () => {
    if (!account) return onLoginClick();
    navigate("/myreservations");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userBoxRef.current && !userBoxRef.current.contains(e.target))
        setIsLogoutOpen(false);
      if (notifBoxRef.current && !notifBoxRef.current.contains(e.target))
        setIsNotifOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.logo} onClick={handleClickLogo}>
        Pickit
      </div>

      <nav className={styles.menu}>
        {/* 사용자 */}{" "}
        <div className={styles.userBox} ref={userBoxRef}>
          {" "}
          <button
            className={styles.userButton}
            onClick={account ? handleToggleLogout : handleLoginClick}
          >
            {" "}
            <svg width="20" height="19" viewBox="0 0 20 19" fill="none">
              {" "}
              <path
                d="M19 18V18C19 14.4101 16.0899 11.5 12.5 11.5H7.5C3.91015 11.5 1 14.4101 1 18V18"
                stroke="#29292D"
                strokeWidth="1.5"
                strokeLinecap="round"
              />{" "}
              <circle
                cx="10"
                cy="5"
                r="4"
                stroke="#29292D"
                strokeWidth="1.5"
              />{" "}
            </svg>{" "}
            <span className={styles.userText}>
              {" "}
              {account?.email || "로그인"}{" "}
            </span>{" "}
          </button>{" "}
          {account && isLogoutOpen && (
            <div className={styles.logoutDropdown}>
              {" "}
              <button
                className={styles.logoutButton}
                onClick={handleClickLogout}
              >
                {" "}
                로그아웃{" "}
              </button>{" "}
            </div>
          )}{" "}
        </div>
        {/* 내 예약 */}
        <button onClick={handleMoveMyReservation} className={styles.menuButton}>
          {" "}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            {" "}
            <path
              d="M19.7729 9.04466C18.7255 9.53297 18.0449 10.5718 18.0449 11.9232C18.0449 13.2769 18.7281 14.2937 19.7756 14.7666C19.9383 14.84 20.0704 14.9376 20.1533 15.0347C20.2323 15.1271 20.2499 15.1965 20.2499 15.2463V17C20.2499 18.2426 19.2426 19.25 17.9999 19.25H6C4.75736 19.25 3.75 18.2426 3.75 16.9999V7C3.75 5.75736 4.75736 4.75 6 4.75H17.9999C19.2426 4.75 20.2499 5.75736 20.2499 7V8.55715C20.2499 8.60663 20.2324 8.67653 20.1527 8.7705C20.0692 8.86903 19.9365 8.96842 19.7729 9.04466Z"
              stroke="#29292D"
              strokeWidth="1.5"
            />{" "}
            <line
              x1="14.75"
              y1="5.75"
              x2="14.75"
              y2="18.25"
              stroke="#29292D"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="1 3"
            />{" "}
          </svg>{" "}
          <span className={styles.menuText}>내 예약</span>{" "}
        </button>
        {account && (
          <div className={styles.notificationBox} ref={notifBoxRef}>
            <button
              onClick={handleToggleNotifications}
              className={styles.notifButton}
            >
              <span className={styles.iconWrapper}>
                {" "}
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  {" "}
                  <path
                    d="M10 2C6 2 6 6 6 6V11L4 13V14H16V13L14 11V6C14 6 14 2 10 2Z"
                    stroke="#29292D"
                    strokeWidth="1.5"
                  />{" "}
                </svg>{" "}
                {notifications.length > 0 && (
                  <span className={styles.notifCount}>{unreadCount}</span>
                )}{" "}
              </span>
              <span className={styles.notifText}>알림</span>
            </button>

            {isNotifOpen && (
              <div className={styles.notifDropdown}>
                <div className={styles.notifHeader}>
                  <span>알림</span>
                  <span>{unreadCount}개 읽지 않음</span>
                </div>

                <div className={styles.notifList}>
                  {notifications.length === 0 ? (
                    <div className={styles.notifEmpty}>알림이 없습니다.</div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() =>
                          !notif.isRead && readNotification(notif.id)
                        }
                        className={`${styles.notifItem} ${
                          !notif.isRead ? styles.unread : ""
                        }`}
                      >
                        {notif.message}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
