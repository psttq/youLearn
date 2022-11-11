import { Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./style.module.css";

export const MainPage = () => {
    const navigate = useNavigate();
    return (
        <div className={styles.LogoWrapper}>
            <span className={styles.Logo}>WordChest</span>
            <div className={styles.Description}>
                Этот сайт поможет выучить любые слова любого языка! Учи просто -
                используй карточки!
            </div>
            <Button
                shape="round"
                className={styles.BeginButton}
                size="large"
                onClick={() => navigate("/login")}
            >
                Начать
            </Button>
        </div>
    );
};
