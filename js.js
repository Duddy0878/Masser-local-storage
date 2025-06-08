
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



form.addEventListener('submit', (e) => {
    var addMoreValue = addMore.value
    

    // add Maaser
    var addMOreToNum = Number(addMoreValue);  
    const newMaaser = maaser.currentBalance + addMOreToNum;
    maaser.currentBalance = newMaaser;

    const getMaaser = maaser.donations
    maaser.donations.push(
        {
            donationId: crypto.randomUUID(),
            date: today.format('MM/DD/YY'),
            type: '++',
            amount: addMoreValue,
            payedTo:  weekInput.value + "/" + week2Input.value
        }
    )


    saveToStorage();
    displayBalance();

})

closeAdd.addEventListener('click', ()=> {
    modalAdd.style.display = 'none';
    addMore.value = '';
     addEarned.value = '';
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
    console.log(document.getElementById('tableTP').innerHTML);
    
    printJS({
        printable: 'tableTP',
        type: 'html',
        style: 'th,td { padding: 8px; border: 1px solid #ccc; } table { border-collapse: collapse; width: 100%; }',
        scanStyles: false,
        documentTitle: 'maaser_history'
    });

    // modalHistory.style.display = 'none';
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

payCheckBtn.addEventListener('click', () => {
  alert('This feature is coming soon!');
})









