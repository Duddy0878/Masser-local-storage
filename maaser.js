

export var maaser = JSON.parse(localStorage.getItem('maaser'));

if(!maaser){
 maaser = {
   currentBalance: 1,
   donations:[]
   
 }
 
 
}

export function saveToStorage() {
    localStorage.setItem('maaser', JSON.stringify(maaser));
  }

