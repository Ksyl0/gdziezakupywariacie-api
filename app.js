const express = require('express');
require('dotenv').config();
const morgan = require('morgan');
const cors = require('cors');
const app = express();
app.use(express.json());
app.set('trust proxy', true);
app.use(morgan('combined'));
app.use(morgan(':remote-addr - :method :url :status :response-time ms'));
app.use(cors())
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

const handlowe = [
    "2025-04-13",
    "2025-04-27",
    "2025-06-29",
    "2025-08-31",
    "2025-12-07",
    "2025-12-14",
    "2025-12-21"
]

function getISOWeek(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return { year: d.getFullYear(), week: weekNo };
}

function isSameWeek(date1, date2) {
  const week1 = getISOWeek(date1);
  const week2 = getISOWeek(date2);
  return week1.year === week2.year && week1.week === week2.week;
}

function whenHandlowa(dateArray, customDate = null) {
  const currentDate = customDate ? new Date(customDate) : new Date();
  currentDate.setHours(0, 0, 0, 0);

  let closestDate = null;
  let closestDiff = Infinity;

  for (const dateStr of dateArray) {
    const targetDate = new Date(dateStr);
    targetDate.setHours(0, 0, 0, 0);

    if (isSameWeek(currentDate, targetDate)) {
      return dateStr;
    }

    const diff = targetDate.getTime() - currentDate.getTime();
    if (diff > 0 && diff < closestDiff) {
      closestDiff = diff;
      closestDate = dateStr;
    }
  }

  return closestDate || false;
}


app.get('/status', (req, res) => {
    const status = {
        "is_running": true
    };
    res.send(status);
});

app.get('/', (req, res) => {
    const today = new Date();
    const nextHandlowa = whenHandlowa(handlowe, today);
    let response;
    
    if(nextHandlowa && isSameWeek(today, new Date(nextHandlowa))) {
        response = {
            "czy_handlowa": true,
            "odp": "Wariacie dzisiaj zakupki zrobisz w biedrze",
            "next_handlowa": nextHandlowa
        }
    }
    else if(nextHandlowa === false) {
        response = {
            "czy_handlowa": false,
            "odp": "Wariacie musisz lecieć do płaza",
            "next_handlowa": "Sorka ale nie w tym roku"
        }
    }
    else {
        response = {
            "czy_handlowa": false,
            "odp": "Wariacie musisz lecieć do płaza",
            "next_handlowa": nextHandlowa
        }
    }
    res.send(response);
});
