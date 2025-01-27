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

function getNextSunday(date) {
    const dayOfWeek = date.getDay();
    const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
    const nextSunday = new Date(date);
    nextSunday.setDate(date.getDate() + daysUntilSunday);
    nextSunday.setHours(0, 0, 0, 0);
    return nextSunday;
}

function whenHandlowa(dates) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextSunday = getNextSunday(today);

    const dateMap = dates.map(dateStr => new Date(dateStr));

    const todayMatch = dateMap.find(date => date.getTime() === today.getTime());
    if (todayMatch) {
        return true;
    }

    const nextSundayMatch = dateMap.find(date => date.getTime() === nextSunday.getTime());
    if (nextSundayMatch) {
        return `${nextSunday.toISOString().split('T')[0]}`;
    }

    const futureDates = dateMap.filter(date => date > today);
    if (futureDates.length > 0) {
        const closestDate = futureDates.sort((a, b) => a - b)[0];
        return `${closestDate.toISOString().split('T')[0]}`;
    }

    return false;
}

app.get('/status', (req, res) => {
    const status = {
        "Status": "Running"
    };
    res.send(status);
});

app.get('/', (req, res) => {
    const nextHandlowa = whenHandlowa(handlowe);
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