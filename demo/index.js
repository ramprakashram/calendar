import Calendar from '../src/calendar.js';

const daysWithActions = [
  {
    date: '2020-05-09T18:30:00.000Z',
    color: 'blue'
  },
  {
    date: '2020-05-17T18:30:00.000Z',
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

