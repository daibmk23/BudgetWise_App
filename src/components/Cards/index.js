import React from "react";
import { Card, Row } from "antd";
import "./styles.css";
import Button from "../Button";


function Cards({
  totalBalance,
  income,
  expenses,
  showExpenseModal,
  showIncomeModal,
  cardStyle,
  reset,
}) {
  return (
    <Row
      style={{
        className: "myrow"}}
    >
       <Card bordered={true}className="mycard">
        <h2>Current Balance</h2>
        <p>₺{totalBalance}</p>
        <Button 
        text = {"Reset"}
        blue={true}
        onClick={reset}>
        </Button>
      </Card>

      <Card bordered={true} className="mycard">
        <h2>Total Income</h2>
        <p>₺{income}</p>
        <Button
          text={"Add Income"}
          blue={true}
          onClick={showIncomeModal}
        >
          Add Income
        </Button>
      </Card>

      <Card bordered={true} className="mycard">
        <h2>Total Expenses</h2>
        <p>₺{expenses}</p>
        <Button 
        text = {"Add Expense"}
        blue={true}
        onClick={showExpenseModal}
        >
        </Button>
      </Card>
    </Row>
  );
}

export default Cards;