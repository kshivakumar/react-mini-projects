import React, { useReducer } from "react";

import "./App.css";

const Display = ({ date }) => {
  return (
    <div className="dtpkr-display">
      <span>{`${date.toLocaleDateString("en-CA")}`}</span>
    </div>
  );
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const YEARS = Array(201)
  .fill()
  .map((_, i) => i + 1900);

const MonthAndYearSelector = ({ date, onYearChange, onMonthChange }) => {
  let month = date.getMonth();
  let year = date.getFullYear();

  const handleArrowBtn = (direction) => {
    if (direction === "<") {
      if (month === 0) {
        onYearChange(year - 1);
        onMonthChange(11);
      } else {
        onMonthChange(month - 1);
      }
    } else {
      if (month === 11) {
        onYearChange(year + 1);
        onMonthChange(0);
      } else {
        onMonthChange(month + 1);
      }
    }
  };

  return (
    <div className="dtpkr-monthyearselector">
      <button
        onClick={() => handleArrowBtn("<")}
        disabled={year === YEARS[0] && month === 0}
      >
        {"<"}
      </button>
      <select
        value={MONTHS[month]}
        onChange={(e) => onMonthChange(MONTHS.indexOf(e.target.value))}
      >
        {MONTHS.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
      <select value={year} onChange={(e) => onYearChange(e.target.value)}>
        {YEARS.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
      <button
        onClick={() => handleArrowBtn(">")}
        disabled={year === YEARS.slice(-1)[0] && month === 11}
      >
        {">"}
      </button>
    </div>
  );
};

const MonthView = ({ date, onDateSelect }) => {
  const calendarMatrix = generateCalendarMatrix(
    date.getFullYear(),
    date.getMonth()
  );

  return (
    <div className="dtpkr-monthview">
      <div className="dtpkr-weekday">
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
        <span>Sun</span>
      </div>
      {calendarMatrix.map((row, mi) => (
        <div key={mi} className="dtpkr-weekrow">
          {row.map((dt, wi) => (
            <span
              key={wi}
              className={`dtpkr-date${
                !dt
                  ? " dtpkr-date-null"
                  : dt.getDate() === date.getDate()
                  ? " dtpkr-selecteddate"
                  : ""
              }`}
              onClick={dt ? () => onDateSelect(dt.getDate()) : null}
            >
              {dt && dt.getDate()}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};

const Calendar = ({ date, onYearChange, onMonthChange, onDateSelect }) => {
  return (
    <div className="dtpkr-calendar">
      <MonthAndYearSelector
        date={date}
        onYearChange={onYearChange}
        onMonthChange={onMonthChange}
      />
      <MonthView date={date} onDateSelect={onDateSelect} />
    </div>
  );
};

const getMonthDates = (year, month) => {
  let lastDateOfMonth = new Date(year, month + 1, 0);
  let dates = Array(lastDateOfMonth.getDate() - 1)
    .fill()
    .map((_, i) => new Date(year, month, i + 1));
  dates.push(lastDateOfMonth);
  return dates;
};

const generateCalendarMatrix = (year, month) => {
  let monthDates = getMonthDates(year, month);

  let calendar = [...monthDates];

  let monthFirstDay = calendar[0].getDay();
  if (monthFirstDay === 0) {
    calendar = Array(6).fill(null).concat(calendar);
  } else {
    for (let i = monthFirstDay; i > 1; i--) {
      calendar.unshift(null);
    }
  }

  for (let i = calendar.length; i < 6 * 7; i++) {
    calendar.push(null);
  }

  let calendarMatrix = [];
  for (let i = 0; i < calendar.length; i += 7) {
    calendarMatrix.push(calendar.slice(i, i + 7));
  }

  return calendarMatrix;
};

const App = () => {
  const [date, dispatch] = useReducer(reducer, new Date());

  const onYearChange = (year) => {
    dispatch({ type: SELECT_YEAR, payload: year });
  };

  const onMonthChange = (month) => {
    dispatch({ type: SELECT_MONTH, payload: month });
  };

  const onDateSelect = (date) => {
    dispatch({ type: SELECT_DATE, payload: date });
  };

  return (
    <div className="dtpkr-container">
      <Calendar
        date={date}
        onYearChange={onYearChange}
        onMonthChange={onMonthChange}
        onDateSelect={onDateSelect}
      />
      <Display date={date} />
    </div>
  );
};

const SELECT_YEAR = "SET_YEAR";
const SELECT_MONTH = "SET_MONTH";
const INCREMENT_MONTH = "INCREMENT_MONTH";
const DECREMENT_MONTH = "DECREMENT_MONTH";
const SELECT_DATE = "SELECT_DATE";

function reducer(state, action) {
  const year = state.getFullYear();
  const month = state.getMonth();
  const date = state.getDate();
  const payload = Number.parseInt(action.payload);

  switch (action.type) {
    case SELECT_YEAR:
      return new Date(payload, month, date);
    case SELECT_MONTH: {
      let newMonth = payload;
      let lastDayOfMonth = new Date(year, newMonth + 1, 0).getDate();
      return new Date(
        year,
        newMonth,
        date > lastDayOfMonth ? lastDayOfMonth : date
      );
    }
    case INCREMENT_MONTH: {
      let newMonth = payload;
      let newYear = month === 11 ? year + 1 : year;
      let lastDayOfMonth = new Date(newYear, newMonth + 1, 0).getDate();
      return new Date(
        newYear,
        newMonth,
        date > lastDayOfMonth ? lastDayOfMonth : date
      );
    }
    case DECREMENT_MONTH: {
      let newMonth = payload;
      let newYear = month === 0 ? year - 1 : year;
      let lastDayOfMonth = new Date(newYear, newMonth + 1, 0).getDate();
      return new Date(
        newYear,
        newMonth,
        date > lastDayOfMonth ? lastDayOfMonth : date
      );
    }
    case SELECT_DATE:
      return new Date(year, month, payload);
    default:
      return state;
  }
}

export default App;
