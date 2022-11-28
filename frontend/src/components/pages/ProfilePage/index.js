import Avatar from "antd/lib/avatar/avatar";
import axios from "axios";
import React, { useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./style.module.css";

export const ProfilePage = () => {

  const navigate = useNavigate();

  useEffect(() => {
    let token = sessionStorage.getItem("token");

    if (token == null){
      navigate("/login");
      return;
    }

  });

  return (
    <div className="App-main">
      <div className={styles.profileContainer}>
        <Avatar size={150} style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>U</Avatar>
        <span className={styles.username}>Username</span>
      </div>
    </div>
  );
};
