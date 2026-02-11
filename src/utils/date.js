// src/utils/date.js

/**
 * yyyy-mm-dd → yyyy년 m월 d일
 * @param {string} dateStr
 * @returns {string}
 */
export const formatKoreanDate = (dateStr) => {
  if (!dateStr) return "";

  const [year, month, day] = dateStr.split("-").map(Number);

  if (!year || !month || !day) return "";

  return `${year}년 ${month}월 ${day}일`;
};

/**
 * yyyy-mm-dd + hh:mm:ss → yyyy년 m월 d일 hh:mm
 */
export const formatKoreanDateTime = (dateStr, timeStr) => {
  if (!dateStr) return "";

  const datePart = formatKoreanDate(dateStr);
  const timePart = timeStr ? timeStr.slice(0, 5) : "";

  return timePart ? `${datePart} ${timePart}` : datePart;
};
