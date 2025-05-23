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

function whenHandlowa(dateArray, customDate = null) {
  const currentDate = customDate ? new Date(customDate) : new Date();
  currentDate.setHours(0, 0, 0, 0);
  const currentTime = currentDate.getTime();

  const millisecondsInWeek = 7 * 24 * 60 * 60 * 1000;

  let closestDate = null;
  let closestDiff = Infinity;

  for (const dateStr of dateArray) {
    const targetDate = new Date(dateStr);
    targetDate.setHours(0, 0, 0, 0);
    const targetTime = targetDate.getTime();

    const diff = targetTime - currentTime;
    
    if (diff >= 0 && diff <= millisecondsInWeek || 
        (diff === 0) || 
        (diff < 0 && Math.abs(diff) <= millisecondsInWeek)) {
      return dateStr;
    }

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
    if(nextHandlowa === true) {
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
