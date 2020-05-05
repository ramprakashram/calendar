import Calendar from '../src/calendar.js';

new Calendar({
  el: document.querySelector('#demo'),
  onDayClick
});

function onDayClick(date) {
  console.log(date);
}
