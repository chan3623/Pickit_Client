import style from "./DefaultInfo.module.css";

export default function DefaultInfo() {

  const infoData = [
    { id: "주차", text: "주차가능" },
    { id: "free", text: "입장료 무료" },
  ];

  return (
    <div className={style.defaultInfoBox}>
      <div className={style.imageInfoInnerBox}>
        <div className={style.imageBox}>
          <img className={style.image} src="/images/디지몬.webp"></img>
        </div>

        <div className={style.infoInnerBox}>
          <ul className={style.textInnerBox}>
            <li className={style.listBox}>
              <h1>디지몬 어드벤쳐 콜라보 카페</h1>
            </li>
            <li className={style.listBox}>
              <div className={style.rangeBox}>2026-01-22 - 2026-03-25</div>
            </li>

            <li className={style.listBox}>
              <div>
                월-금 10:00 ~ 20:00<br/>
                토-일 11:00 ~ 20:00
                
              </div>
            </li>

            <li className={style.listBox}>
              <div>
                서울 서대문구 연세로 13 신촌 현백화점 U-PLEX B2, 카페 오마케
              </div>
            </li>
          </ul>

          <div className={style.carAndPriceInnerBox}>
            <div className={style.carAndPriceBox}>
              <p>주차 및 입장료</p>
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
        </div>
              
      </div>
    </div>
  );
}
