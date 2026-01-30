import style from "./DetailInfo.module.css";

export default function DetailInfo() {
  // 아이콘 파일명과 매칭되는 리스트
  const infoData = [
    { id: "주차", text: "주차가능" },
    { id: "free", text: "입장료 무료" },
  ];

  return (
    <div className={style.detailBox}>
      <div className={style.titleInnerBox}>
        <p>정보</p>
      </div>
      <ul className={style.infoListBox}>
        {infoData.map((item) => (
          <li key={item.id} className={style.infoItem}>
            <img
              src={`/icons/${item.id}.png`}
              alt={item.text}
              className={style.icon}
            />
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
