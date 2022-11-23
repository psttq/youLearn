import { Tag } from "antd";
import Search from "antd/lib/transfer/search";
import React from "react";
import SetCard from "../../SetCard";
import styles from "./style.module.css"

export const SetPage = () => {
  return (
    <div className="App-main">
    <div className={styles.searchField}>
      <div className={styles.searchContainer}>
         <Search placeholder="Поиск" onSearch={()=>{}}/>
      </div>
      <span className={styles.categorySpan}>Категории:</span>
      <div className={styles.categoryContainer}>
          {[...Array(20).keys()].map(()=> <Tag color="magenta">magenta</Tag>)}
      </div>
    </div>
    <div className={styles.SetsContainer}>
      {
      [...Array(20).keys()].map(()=><SetCard/>)
    }
    </div>
    </div>
  );
};
