import React from 'react';
import { Card, Progress } from 'antd';
import styles from "./style.module.css";

const { Meta }    = Card;
const CardPreview = ({ id, title, testCount, progress, imgUrl}) => (
    <div className={ styles.CardWrapper }>
        <div className={ styles.CardInfo }>
            { testCount } теста
        </div>
        <Card
            hoverable
            style={ {
                width:  280,
                height: 320,
            } }
            cover={ <img
                         src={imgUrl ? imgUrl : "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/F1_light_blue_flag.svg/2560px-F1_light_blue_flag.svg.png"}
                         style={ { height: 160, borderBottomLeftRadius: "10%", borderBottomRightRadius: "10%" } }/> }
        >
            <Meta title={ title }/>
            <div className={ styles.progressContainer }>
                <Progress type="circle" percent={ progress } strokeColor={ { '0%': '#108ee9', '100%': '#87d068' } } width={ 80 }/>
            </div>
        </Card>
    </div>
);
export default CardPreview;
