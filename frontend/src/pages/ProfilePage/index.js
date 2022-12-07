import Avatar from "antd/lib/avatar/avatar";
import React, { useEffect, useLayoutEffect } from "react";

import styles from "./style.module.css";

export const ProfilePage = () => {
  return (
    <div className="App-main">
      <div className={styles.profileContainer}>
        <Avatar size={150} style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>U</Avatar>
        <span className={styles.username}>Username</span>
      </div>
    </div>
  );
};
