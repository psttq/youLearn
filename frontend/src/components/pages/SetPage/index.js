import { Card } from "antd";
import React from "react";

export const SetPage = () => {
  return (
    <div className="App-main">
      {
      [...Array(15).keys()].map(()=> <Card title="Набор" bordered={false} className="Main-card">
      Words
      </Card>)
    }
    </div>
  );
};
