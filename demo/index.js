import Calendar from '../src/calendar.js';

const daysWithActions = [
  {
    date: '2020-05-09T18:30:00.000Z',
    color: 'Yellow',
    xp: 300
  },
  {
    date: '2020-05-17T18:30:00.000Z',
    color: 'blue',
    xp: 360
  }, {
    color: 'Blue',
    date: '2020-04-29T18:30:00.000Z',
    xp: 230
  },
  {
    color: 'Blue',
    date: '2020-04-28T18:30:00.000Z',
    xp: 170
  },
  {
    color: 'Blue',
    date: '2020-02-29T18:30:00.000Z',
    xp: 170
  },
  {
    color: 'Blue',
    date: '2020-03-01T18:30:00.000Z',
    xp: 170
  },
  {
    color: 'Blue',
    date: '2020-03-06T18:30:00.000Z',
    xp: 170
  },
  {
    color: 'Blue',
    date: '2020-03-07T18:30:00.000Z',
    xp: 170
  },
  {
    color: 'Yellow',
    date: '2020-05-22T09:43:14.213Z',
    xp: 170
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

