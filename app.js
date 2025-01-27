const express = require('express');
const app = express();
app.use(express.json())

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

function whenHandlowa(dateArray) {
// Strip time from the current date
const currentDate = new Date();
currentDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0
const currentTime = currentDate.getTime();

const millisecondsInWeek = 7 * 24 * 60 * 60 * 1000; // Milliseconds in a week

let closestDate = null;
let closestDiff = Infinity;

for (const dateStr of dateArray) {
  const targetDate = new Date(dateStr);
  targetDate.setHours(0, 0, 0, 0); // Strip time from the target date
  const targetTime = targetDate.getTime();

  // Calculate the difference in milliseconds
  const diff = targetTime - currentTime;

  // Check if the date is within a week before or the same day
  if (diff >= 0 && diff <= millisecondsInWeek) {
    return dateStr;
  }

  // Find the closest date in the future
  if (diff > 0 && diff < closestDiff) {
    closestDiff = diff;
    closestDate = dateStr;
  }
}

// Return the closest date if found, otherwise false
return closestDate || false;
}  


app.get('/status', (req, res) => {
    const status = {
        "Status": "Running"
    };
    res.send(status);
});

app.get('/', (req, res) => {
    const today = new Date('2025-04-21');
    const nextHandlowa = whenHandlowa(handlowe, today);
    let response;
    if(nextHandlowa == true) {
        response = {
            "czy_handlowa": true,
            "odp": "Wariacie dzisiaj zakupki zrobisz w biedrze",
            "next_handlowa": nextHandlowa
        }
    }
    else if(nextHandlowa == false) {
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