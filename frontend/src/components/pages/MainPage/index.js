import { Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./style.module.css";

export const MainPage = () => {
    const navigate = useNavigate();
    return (
        <div className={styles.LogoWrapper}>
            <span className={styles.Logo}><span className={styles.LogoBegin}>you</span>Learn</span>
            <div className={styles.Description}>
                Этот сайт поможет выучить все что захочешь! Учи просто -
                используй карточки!
            </div>
            <Button
                
                className={styles.BeginButton}
                size="large"
                onClick={() => navigate("/login")}
            >
                НАЧАТЬ
            </Button>
        </div>
    );
};
