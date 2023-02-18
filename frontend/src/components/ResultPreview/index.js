import React from 'react';
import {Button, Card, Progress, Tag} from 'antd';
import styles from "./style.module.css";
import {useNavigate} from "react-router-dom";
import {stringToColour} from "../../Utils/utils";
import {Tooltip} from "antd/lib";
import {CheckOutlined} from "@ant-design/icons";

const {Meta} = Card;
const exampleCategories = ["Математика", "Комплексные числа", "Введение в комплексный анализ", "ТФКП"]

const ResultPreview = ({id, title, testCount, result, imgUrl, category, isadded=false}) => {
    const navigate = useNavigate();
    category = category === undefined ? "Категория" : category;
    return (
        <div className={styles.CardWrapper}>
            <div className={styles.CardInfo}>
                <Tooltip color="white" overlayInnerStyle={{color: "black"}} title={category}>
                <Tag className={styles.Category} color={stringToColour(category)}>{category}</Tag>
                </Tooltip>
                <span className={styles.TestNumber}>{testCount} теста</span>

            </div>
            {/*<div className={styles.CardCategory}>*/}
            {/*    <Tag color="magenta">Математика</Tag>*/}
            {/*</div>*/}
            <Card
                hoverable
                style={{
                    width: 280,
                    height: 320,
                }}
                onClick={() => {
                    navigate(`/card/${id}`)
                }}
                bodyStyle={{height: "45%", position: "relative"}}
                cover={<img
                    src={imgUrl ? imgUrl : "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/F1_light_blue_flag.svg/2560px-F1_light_blue_flag.svg.png"}
                    style={{height: 160, borderBottomLeftRadius: "10%", borderBottomRightRadius: "10%"}}/>}
            >
                <Meta title={title}/>
                <div className={styles.progressContainer}>
                    <Progress type="circle" percent={result} strokeColor={{'0%': '#108ee9', '100%': '#87d068'}}
                              width={80}/>
                </div>
            </Card>
        </div>
    );
}
export default ResultPreview;
