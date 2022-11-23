import React from 'react';
import { Card, Progress } from 'antd';
import styles from "./style.module.css";

const { Meta } = Card;
const SetCard = () => (
  <div className={styles.CardWrapper}>
    <div className={styles.CardInfo}>
     23 теста
     </div>
    <Card
      hoverable
      style={{
        width: 280,
        height: 320
      }}
      cover={<img alt="example" src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/F1_light_blue_flag.svg/2560px-F1_light_blue_flag.svg.png" style={{ height: 160, borderBottomLeftRadius: "10%", borderBottomRightRadius: "10%" }} />}
    >
      <Meta title="Набор звездочка" />
      <div className={styles.progressContainer}>
      <Progress type="circle" percent={40}  strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} width={80}/>
      </div>
    </Card>
  </div>
);
export default SetCard;