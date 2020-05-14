import Calendar from '../src/calendar.js';

const daysWithActions = [
  {
    date: new Date('2020/05/01').toISOString(),
    color: 'blue'
  },
  {
    date: new Date('2020/05/04').toISOString(),
    color: 'blue'
  }
];

new Calendar({
  el: document.querySelector('#demo'),
  daysWithActions: daysWithActions,
  startDay: 'Sunday',
  onDayClick,
  onMonthChangeClick
});

function onDayClick(date) {
  console.log(date);
}

function onMonthChangeClick(month) {
  console.log(month);
}

