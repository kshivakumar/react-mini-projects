import React, { useState, useRef } from "react";
import "./App.css";

const Display = ({ value }) => {
  let transformed = value || "0";
  if (value.startsWith(".")) {
    transformed = "0" + value;
  } else if (value.startsWith("-.")) {
    transformed = "-0" + value.replace('-', '');
  }

  return (
    <input
      type="textbox"
      value={transformed}
      disabled
      className="calc-display"
    />
  );
};

const Button = ({ value, onClick, addtionalClass }) => (
  <button className={`calc-btn ${addtionalClass || ''}`} onClick={() => onClick(value)}>{value}</button>
);

const ButtonLayout = ({ onBtnClick }) => {
  return (
    <div className="calc-btnLayout">
      <div>
        <Button value="AC" onClick={onBtnClick} />
        <Button value="+/-" onClick={onBtnClick} />
        <Button value="%" onClick={onBtnClick} />
        <Button value="/" onClick={onBtnClick} />
      </div>
      <div>
        <Button value="7" onClick={onBtnClick} />
        <Button value="8" onClick={onBtnClick} />
        <Button value="9" onClick={onBtnClick} />
        <Button value="*" onClick={onBtnClick} />
      </div>
      <div>
        <Button value="4" onClick={onBtnClick} />
        <Button value="5" onClick={onBtnClick} />
        <Button value="6" onClick={onBtnClick} />
        <Button value="-" onClick={onBtnClick} />
      </div>
      <div>
        <Button value="1" onClick={onBtnClick} />
        <Button value="2" onClick={onBtnClick} />
        <Button value="3" onClick={onBtnClick} />
        <Button value="+" onClick={onBtnClick} />
      </div>
      <div>
        <Button addtionalClass="calc-btnZero" value="0" onClick={onBtnClick} />
        <Button value="." onClick={onBtnClick} />
        <Button value="=" onClick={onBtnClick} />
      </div>
    </div>
  );
};

const NUMBERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const OPERATORS = ["+", "-", "*", "/", "%"];
const DOT = ".";
const SIGN = "+/-";
const CALCULATE = "=";
const ALLCLEAR = "AC";

function calculate(operand1, operand2, operator) {
  let op1 = Number(operand1);
  let op2 = Number(operand2);

  switch (operator) {
    case "+":
      return op1 + op2;
    case "-":
      return op1 - op2;
    case "*":
      return op1 * op2;
    case "/":
      return op1 / op2;
    case "%":
      return (op1 / 100) * op2;
    default:
      throw new Error(`Unknown operator: ${operator}`);
  }
}

function App() {
  const operator = useRef(null);

  const [op1, setOp1] = useState("");
  const [op2, setOp2] = useState("");

  const handleBtnClick = (input) => {
    if (NUMBERS.includes(input)) {
      if (operator.current) {
        if (op2 !== "" || input !== "0") {
          setOp2((prev) => prev + input);
        }
      } else {
        if (op1 !== "" || input !== "0") {
          setOp1((prev) => prev + input);
        }
      }
    } else if (OPERATORS.includes(input)) {
      if (op1 && !op2) {
        operator.current = input;
      }
    } else if (DOT === input) {
      if (operator.current && !op2.includes(".")) {
        setOp2((prev) => prev + input);
      } else if (!op1.includes(".")) {
        setOp1((prev) => prev + input);
      }
    } else if (SIGN === input) {
      if (op1 !== '') {
        if (op1.startsWith('-')) {
          setOp1(prev => prev.slice(1))
        } else {
          setOp1(prev => '-' + prev)
        }
      }
    } else if (CALCULATE === input) {
      if (op2 !== '') {
        setOp1(calculate(op1, op2, operator.current).toString());
        setOp2("");
        operator.current = null;
      }
    } else if (ALLCLEAR === input) {
      setOp1("");
      setOp2("");
      operator.current = null;
    } else {
      throw new Error(`Invalid input: ${input}`);
    }
  };

  return (
    <div className="calc-container">
      <Display value={op2 || op1} />
      <ButtonLayout onBtnClick={handleBtnClick} />
    </div>
  );
}

export default App;
