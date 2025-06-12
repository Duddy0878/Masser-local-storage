
import { maaser, saveToStorage } from "./maaser.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

var today = dayjs();

// add maaser ============================================

var openAdd = document.querySelector(".openAdd");
var modalAdd = document.querySelector(".addMaaser");
var closeAdd = document.querySelector('.closeAdd')

openAdd.addEventListener("click", () => {
    modalAdd.style.display = 'block'
    
})


function displayBalance (){

document.querySelector('.amount').innerHTML = `$${maaser.currentBalance.toLocaleString('en-US')}`}

displayBalance();


var form = document.querySelector('form')
var addMore = document.querySelector('.maaserInput');
var addEarned = document.querySelector('.earnedInput');
var weekInput = document.querySelector('.weekInput');
var week2Input = document.querySelector('.week2Input');


addEarned.addEventListener('keyup', (e) => {
    
    // countculate Earned
    var addMoreEarned = addEarned.value
    var addEarnedToNum = Number(addMoreEarned);
    var newEarned = addEarnedToNum * 0.10 
    var newFixed = Math.ceil(newEarned)
    addMore.value = newFixed
 })

var displayType = document.querySelector('.dateDisplay');

week2Input.addEventListener('change', (e) => {
    if (week2Input.value === 'MZ-WORK' 
        || week2Input.value === 'Kollel'
    ) {
        displayType.style.display = 'inline-block';
        
    }
})

form.addEventListener('submit', (e) => {
    var addMoreValue = addMore.value
    

    // add Maaser
    var addMOreToNum = Number(addMoreValue);  
    const newMaaser = maaser.currentBalance + addMOreToNum;
    maaser.currentBalance = newMaaser;
    var payedToo
    if (week2Input.value === 'MZ-WORK' 
        || week2Input.value === 'Kollel'
    ){
       payedToo = weekInput.value + "/" + week2Input.value
    }
    else {
        payedToo = week2Input.value;
    }

    const getMaaser = maaser.donations
    maaser.donations.push(
        {
            donationId: crypto.randomUUID(),
            date: today.format('MM/DD/YY'),
            type: '++',
            amount: addMoreValue,
            payedTo:  payedToo
        }
    )


    saveToStorage();
    displayBalance();

})

closeAdd.addEventListener('click', ()=> {
    modalAdd.style.display = 'none';
    addMore.value = '';
     addEarned.value = '';
     displayType.style.display = 'none';
     week2Input.value = '';
})

// pay off maaser ===============================

var openPayMaaser = document.querySelector('.openPayMaaser');
var modalPayMasser = document.querySelector('.payMaaser');
var closePayMaaser = document.querySelector('.closePayMaaser')

openPayMaaser.addEventListener('click', () => {
    modalPayMasser.style.display = 'block';
})

var amount = document.querySelector('.amountInput');
var donationTo = document.querySelector('.donationInput')
var payoffForm = document.querySelector('.payedForm')

payoffForm.addEventListener('submit', (e) => {

    // counculate Balance
    var amountOff = amount.value
    var payedTo = donationTo.value
    const newMaaser = maaser.currentBalance - amountOff
    maaser.currentBalance = newMaaser

    // save History

    const getMaaser = maaser.donations
    maaser.donations.push(
        {
            donationId: crypto.randomUUID(),
            date: today.format('MM/DD/YY'),
            type: '--',
            amount: Number(amountOff),
            payedTo: payedTo 
        }
    )

    saveToStorage();
    displayBalance();
    
})

closePayMaaser.addEventListener('click', ()=> {
    modalPayMasser.style.display = 'none';
    amount.value = '';
     donationTo.value = '';
})

// history =======================================

var openHistory = document.querySelector('.openHistory');
var modalHistory = document.querySelector('.historyBox');
var closeHistory = document.querySelector('.closeHistory');
var total = document.querySelector('.total')
total.innerHTML =`------------------------ <br>` + `Total `+ ` = ` + document.querySelector('.amount').innerHTML 

openHistory.addEventListener('click', ()=> {
    modalHistory.style.display = 'block'
})

closeHistory.addEventListener('click', ()=>{
    modalHistory.style.display = 'none';
    total.style.display = 'none';
})


var getHistory = maaser.donations
var tbody = document.querySelector('tbody')


for(let i = 0; i< getHistory.length; i++)
{
    const donation = getHistory[i];
    const tr = document.createElement('tr')
    tr.innerHTML = `
    <td>${donation.date}</td>
    <td>${donation.type}</td>
    <td>$${donation.amount}</td>
    <td>${donation.payedTo}</td>
    
    `
    tbody.appendChild(tr);
    
}






var printout = document.querySelector('.printOUT');

    printout.addEventListener('click', () => {
        total.style.display = 'block';
    
        printJS({
            printable: 'historyContainer',
            type: 'html',
            style: `
                @media print {
                    body { font-family: 'Segoe UI', Arial, sans-serif; }
                    .print-header { 
                        text-align: center; 
                        color: #29adbe; 
                        margin-bottom: 32px; /* More space below header */
                    }
                    .print-footer { 
                        position: fixed; 
                        bottom: 0; 
                        left: 0; 
                        width: 100%; 
                        text-align: center; 
                        font-size: 12px; 
                        color: #888; 
                    }
                }
                th {
                    background: #29adbe !important;
                    color: #fff !important;
                    font-size: 16px;
                    padding: 10px 8px;
                    border: 1px solid #ccc;
                    text-align: center;
                }
                td {
                    padding: 8px;
                    border: 1px solid #ccc;
                    font-size: 14px;
                    text-align: center;
                }
                table { 
                    border-collapse: collapse; 
                    width: 100%; 
                    margin-bottom: 30px;
                }
                tfoot td {
                    font-weight: bold;
                    background: #e0f7fa;
                }
            `,
            scanStyles: false,
            documentTitle: 'maaser_history',
           header: `<div class="print-header" style="margin-bottom:40px;">
            <h1 style="margin-bottom: 0;">Maaser Donation History</h1>
            <div style="font-size:13px;margin-bottom:0;">
                Printed: ${new Date().toLocaleDateString()}
            </div>
         </div>`,
            footer: `<div class="print-footer">Generated by My Maaser App</div>`
        });

        total.style.display = 'none';
  });


  document.querySelector('.download').addEventListener('click', function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text('Maaser Donation History', 14, 16);

    // Collect table rows
    const table = document.getElementById('tableTP');
    doc.autoTable({ html: table, startY: 22 });

    doc.save('maaser_history.pdf');
});

// ========= payCheck =============

var payCheckBtn = document.querySelector('.payCheck');
var payCheckModal = document.querySelector('.calnder');


payCheckBtn.addEventListener('click', () => {
  payCheckModal.style.display = 'block';
})



// weekly paycheck

var weekPay = []


for (let i = 0; i < maaser.donations.length; i++) {
    const payedTo = maaser.donations[i].payedTo;
    // Only push if there is a date before the slash
    if ( payedTo.toUpperCase().includes('MZ-WORK') && payedTo.includes('/')) {
        const datePart = payedTo.split('/')[0];
        if (datePart && datePart.trim() !== "") {
            weekPay.push(datePart);
        }
    }
}




console.log(weekPay);


// calnder

function renderYearCalendar() {
    const calendarDiv = document.querySelector('.calnder');
    calendarDiv.innerHTML = '<svg class="x" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#29adbe"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg> <div class="auto">Auto Update PayChecks </div>'; // Clear previous content

    const today = dayjs();
    const year = today.year();
    const currentMonth = today.month();
    const currentDay = today.date();

    for (let month = 0; month < 12; month++) {
        // Create month container
        const monthContainer = document.createElement('div');
        monthContainer.classList.add(`month-container`);
        monthContainer.id = `month-${month}`;
        // Month name
        const monthName = dayjs(`${year}-${month + 1}-01`).format('MMMM');
        monthContainer.innerHTML = `<h3 style="text-align:center;color:rgb(41, 173, 190);margin:10px 0;">
        <span class="left-arrow">&#9664;</span>&nbsp;&nbsp;${monthName}&nbsp;&nbsp;<span class="right-arrow">&#9654;</span>
        </h3>`;

        // Create table
        const table = document.createElement('table');
        table.classList.add('calendar-table');
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Sun</th>
                    <th>Mon</th>
                    <th>Tue</th>
                    <th>Wed</th>
                    <th>Thu</th>
                    <th>Fri</th>
                    <th>Sat</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;
        
        const tbody = table.querySelector('tbody');

        const daysInMonth = dayjs(`${year}-${month + 1}-01`).daysInMonth();
        const firstDay = dayjs(`${year}-${month + 1}-01`).day();

        let day = 1;
            
        for (let week = 0; week < 6 && day <= daysInMonth; week++) {
            const tr = document.createElement('tr');
            // Collect all dates for this week
            let weekDates = [];
            let tempDay = day;
            for (let d = 0; d < 7; d++) {
                const thisDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(tempDay).padStart(2, '0')}`;
            
               weekDates.push(thisDate);
             
        tempDay++;
        }
    
    // Check if any date in this week is in weekPay
    const highlightFriday = weekDates.some(date => weekPay.includes(date));

    // Now render the week
    for (let d = 0; d < 7; d++) {
        const cellDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const td = document.createElement('td');
        td.classList.add('day');
        if (week === 0 && d < firstDay) {
            td.innerHTML = '';
        } else if (day > daysInMonth) {
            td.innerHTML = '';
        } else {
            td.innerHTML = day;
            // Circle today
            if (month === currentMonth && day === currentDay) {
                td.classList.add('today');
            }
            // Highlight Friday if any day in this week is in weekPay
            if (d === 5 && highlightFriday) {
                td.classList.add('weekPayed');
            }
            else if(d=== 5 && !highlightFriday) {
                td.classList.add('notPayed');
            }
            day++;
        }
        tr.appendChild(td);
    }
    tbody.appendChild(tr);
}
        

        monthContainer.appendChild(table);
        calendarDiv.appendChild(monthContainer);
    }
    var closePayCheck = document.querySelector('.x');

    closePayCheck.addEventListener('click', () => {
    payCheckModal.style.display = 'none';
    console.log('hi');
    
})
}
renderYearCalendar();

var currentMonth = dayjs().month();
displayMonth(currentMonth);

function nextMonth(){
    disapapreMonth(currentMonth);
    currentMonth++;
    displayMonth(currentMonth);
}
function backMonth(){
    disapapreMonth(currentMonth);
    currentMonth--;
    displayMonth(currentMonth);
}
var nextBtn = document.querySelectorAll('.right-arrow');

nextBtn.forEach((btn) => {
    btn.addEventListener('click', () => {
    nextMonth();
})
})

var backBtn = document.querySelectorAll('.left-arrow');

backBtn.forEach((btn) => {
    btn.addEventListener('click', () => {
    backMonth();
})
})


function displayMonth(month){
  var getMonth = month;
  var getHtmlMonth = document.getElementById(`month-${getMonth}`);
  getHtmlMonth.style.display = 'block';
}

function disapapreMonth(month) {
  var getMonth = month;
  var getHtmlMonth = document.getElementById(`month-${getMonth}`);
  getHtmlMonth.style.display = 'none';
}











