//const API_URL = "http://localhost:5001/harmonyhill-1/us-central1/getOccupancy";
const API_URL = "https://getoccupancy-wkpzhxz7jq-uc.a.run.app";

let currentYear;
let currentMonth; // 0-indexed (0=Jan, 11=Dec)

async function renderCalendar(containerId, house, year, month) {
    month = parseInt(month);

    const res = await fetch(`${API_URL}?house=${house}&year=${year}&month=${(month+1)}`);
    const data = await res.json();

    const bookedDates = data[String(month+1)] || [];
    const calendarDiv = document.getElementById(`calendar-${containerId}`);
    calendarDiv.innerHTML = "";

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    let startingDay = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday, etc.

    const today = new Date();

    // Adjust starting day so 0 is Monday and 6 is Sunday
    if (startingDay === 0) {
        startingDay = 6; // Sunday becomes 6
    } else {
        startingDay--; // Other days shift back by one
    }

    // Format the month and year string (calendar title)
    const monthYearStr = firstDayOfMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    const titleElement = document.getElementById(`month-title-${containerId}`);
    if (titleElement) {
        const currentHouseDisplayName = house.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
        titleElement.textContent = `${currentHouseDisplayName}, ${monthYearStr}`;
    }

    const table = document.createElement('table');
    let row = table.insertRow();

    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    for (let day of daysOfWeek) {
        let th = document.createElement('th');
        th.textContent = day;
        row.appendChild(th);
    }
    table.appendChild(row); // Append header row

    let dayCounter = 1;
    let rowCount = 0;
    for (let i = 0; i < 6; i++) { // Attempt up to 6 weeks
        row = table.insertRow();
        let daysInRow = 0;
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < startingDay) {
                let cell = row.insertCell();
                cell.textContent = '';
            } else if (dayCounter > daysInMonth) {
                let cell = row.insertCell();
                cell.textContent = 'x';
            } else {
                let cell = row.insertCell();
                cell.textContent = dayCounter;

                if(dayCounter < today.getDate()) {
                    cell.classList.add('unavailable');
                } else if (bookedDates.includes(dayCounter)) {
                    cell.classList.add('unavailable');
                } else {
                    cell.classList.add('available');
                }
                dayCounter++;
                daysInRow++;
            }
        }
        table.appendChild(row);
        if (dayCounter > daysInMonth) {
            rowCount = i + 1; // Count the actual number of data rows
            break;
        } else {
            rowCount = i + 1;
        }
    }

    // Add empty rows if the calendar has less than 6 data rows
    while (rowCount < 6) {
        const emptyRow = table.insertRow();
        for (let i = 0; i < 7; i++) {
            emptyRow.insertCell().textContent = 'z';
        }
        rowCount++;
    }

    calendarDiv.appendChild(table);
}

export async function setupCalendar(containerId, house) {
    const today = new Date();
    if(!currentYear) currentYear = [];
    if(!currentMonth) currentMonth = [];
    
    currentYear[containerId] = today.getFullYear();
    currentMonth[containerId] = today.getMonth();

    await renderCalendar(containerId, house, currentYear[containerId], currentMonth[containerId]);

    const prevBtn = document.getElementById(`prev-month-btn-${containerId}`);
    const nextBtn = document.getElementById(`next-month-btn-${containerId}`);

    if (prevBtn) {
        prevBtn.addEventListener('click', () => changeMonth(containerId, house, -1));
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => changeMonth(containerId, house, 1));
    }
}

function changeMonth(containerId, house, direction) {
    // If we're already at current month, don't go further back
    const today = new Date();
    if(direction < 0 && currentMonth[containerId]-1 < today.getMonth() && currentYear[containerId] <= today.getFullYear()) {
        //document.getElementById(`prev-month-btn-${containerId}`).setAttribute("color", "red");
        return;
    }

    currentMonth[containerId] += direction;
    if(currentMonth[containerId] === -1 || currentMonth[containerId] === 12) {
        currentYear[containerId] += direction;
        currentMonth[containerId] = ((currentMonth[containerId] % 12) + 12) % 12;
    }

    renderCalendar(containerId, house, currentYear[containerId], currentMonth[containerId]);
}
