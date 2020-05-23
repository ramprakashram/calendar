import utils from './utils';
import s from './calendar.scss';

const TOTAL_DAYS = 42;
const DEFAULT_FORMAT = 'yyyy/MM/dd';
const today = utils.dateFormat(new Date(), DEFAULT_FORMAT);

class Calendar {
  constructor(options) {
    const defaultOptions = {
      currentDate: today,
      format: DEFAULT_FORMAT,
      monthFormat: 'yyyy/MM/dd',
      chooseDate: ''
    };

    if (options.currentDate) {
      defaultOptions.chooseDate = utils.dateFormat(
        new Date(options.currentDate),
        DEFAULT_FORMAT
      );
    }

    // if (options.daysWithActions) {
    //   console.log(options.daysWithActions);
    // }

    this.options = { ...defaultOptions, ...options };

    this.init();
  }

  init() {
    this.renderContainer();
    this.renderController();
    this.renderContent();
    const { onDayClick, format } = this.options;
    onDayClick && onDayClick(utils.dateFormat(new Date(this.options.currentDate), format));
  }

  renderContainer() {
    const { el } = this.options;
    const containerEl = utils.createElement('div', s.container);
    this.options.containerEl = containerEl;
    el.appendChild(containerEl);
  }

  renderController() {
    const { containerEl } = this.options;
    const controllerEl = utils.createElement('div', s.controller);
    const showMonthEl = utils.createElement('div', s.showMonth);
    const prevArrow = utils.createElement('div', s.controllerArrow);
    prevArrow.innerHTML = '<i class="fa fa-caret-left" style="font-size:28px; color: #000000 "></i>';
    prevArrow.onclick = () => this.switchMonth('prev');
    const nextArrow = utils.createElement('div', s.controllerArrow);
    nextArrow.innerHTML = '<i class="fa fa-caret-right" style="font-size:28px; color: #000000 "></i>';
    nextArrow.onclick = () => this.switchMonth('next');

    this.options.showMonthEl = showMonthEl;
    this.handleShowMonth();
    controllerEl.appendChild(prevArrow);
    controllerEl.appendChild(showMonthEl);
    controllerEl.appendChild(nextArrow);
    containerEl.appendChild(controllerEl);
  }

  renderContent() {
    const { containerEl } = this.options;
    const contentEl = utils.createElement('div', s.content);
    const daysEl = utils.createElement('div');
    this.options.daysEl = daysEl;
    this.renderDays();
    contentEl.innerHTML = this.renderWeeks();
    contentEl.appendChild(daysEl);
    containerEl.appendChild(contentEl);
  }

  renderWeeks() {
    const weeks = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    if (this.options.showAwards) {
      weeks.push('Award');
    }
    const renderWeek = weeks.map(week => {
      if (week === 'Awd') {
        return `<span class=${s.weekItemAwards}>${week}</span>`;
      } else {
        return `<span class=${s.weekItem}>${week}</span>`;
      }
    });
    const weeksEl = `<div class=${s.weekBox}>${renderWeek.join('')}</div>`;
    return weeksEl;
  }

  renderDays() {
    const { chooseDate, daysEl, daysWithActions, startDay } = this.options;
    const days = this.generateCalendarGroup();
    const box = utils.createElement('div', s.dayBox);
    const startDayIndex = startDay >= 0 ? this.getDayValue(startDay) : 0;
    let dayCountForCurrentMonth = 0;
    // console.log(daysWithActions);
    days.forEach((day, index) => {
      let dayItemClass = this.options.showAwards ? s.dayItemWithAward : s.dayItem;
      const dayValue = day.value;

      if (day.type !== 'current') {
        dayItemClass = `${dayItemClass} ${s.blurDay}`;
      }

      if (dayValue === today) {
        dayItemClass = `${dayItemClass} ${s.today}`;
      }

      if (dayValue === chooseDate) {
        dayItemClass = `${dayItemClass} ${s.chooseDate}`;
      }

      if (this.options.showAwards && (index > 0 && index <= 31) && (index % 7 === 0)) {
        // console.log(day.text, 'index : ', index)
        const awardEl = utils.createElement('div', dayItemClass);
        awardEl.setAttribute('id', 'award-' + (index / 6));
        box.appendChild(awardEl);
      }

      const dayEl = utils.createElement('div', dayItemClass);
      if (day.type === 'current') {
        dayCountForCurrentMonth++;
        dayEl.style = this.getGradientStyling(this.getColorForDate(day.value, daysWithActions)) + ' ' + this.getBorderRadius(day.value, startDayIndex, dayCountForCurrentMonth === 1);
        dayEl.innerHTML = `<div class=${s.dayItemContainer}>
        <span class=${s.dayItemText}>${day.text}</span>
        ` + this.appendActionsIconToDate(day.value, daysWithActions, s.dayWithActions) + `
        </div>`;
        // if (this.appendActionsIconToDate(day.value, daysWithActions)) {
        //   console.log(day.value);
        // };
        dayEl.onclick = () => this.chooseDate(dayEl, dayValue);
      }
      box.appendChild(dayEl);

    });

    const replacedNode = daysEl.firstChild;

    if (replacedNode) {
      daysEl.replaceChild(box, replacedNode);
    } else {
      daysEl.appendChild(box);
    }
  }

  generateCalendarGroup() {
    let { currentDate } = this.options;
    currentDate = new Date(currentDate);
    const prevMonthDate = new Date(this.switchMonthOfDate('prev'));
    const nextMonthDate = new Date(this.switchMonthOfDate('next'));
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const prevMonthYear = prevMonthDate.getFullYear();
    const prevMonthMonth = prevMonthDate.getMonth() + 1;
    const nextMonthYear = nextMonthDate.getFullYear();
    const nextMonthMonth = nextMonthDate.getMonth() + 1;
    const currentMonthDays = new Date(currentYear, currentMonth, 0).getDate(); // 获取本月天数
    const tempMonth = new Date(
      `${currentYear}/${utils.formatNumber(currentMonth)}/01`
    ).getDay();
    const weekOfCurrentMonth = tempMonth === 0 ? 6 : (tempMonth - 1); // 获取本月第一天星期几
    const prevMonthDays = new Date(prevMonthYear, prevMonthMonth, 0).getDate(); // 获取上月天数

    const dayList = [];

    // 生成上个月的日期
    for (let i = 0; i < weekOfCurrentMonth; i++) {
      const text = prevMonthDays - i;
      const value = `${prevMonthYear}/${utils.formatNumber(
        prevMonthMonth
      )}/${utils.formatNumber(text)}`;
      const item = {
        text,
        type: 'prev',
        value
      };

      dayList.push(item);
    }
    dayList.reverse();

    // 生成本月的日期
    for (let i = 1; i <= currentMonthDays; i++) {
      const text = i;
      const value = `${currentYear}/${utils.formatNumber(
        currentMonth
      )}/${utils.formatNumber(text)}`;
      const item = {
        text,
        type: 'current',
        value
      };

      dayList.push(item);
    }

    // 生成下个月的日期
    for (let i = 1; dayList.length < TOTAL_DAYS; i++) {
      const text = i;
      const value = `${nextMonthYear}/${utils.formatNumber(
        nextMonthMonth
      )}/${utils.formatNumber(text)}`;
      const item = {
        text,
        type: 'next',
        value
      };

      dayList.push(item);
    }

    return dayList;
  }

  chooseDate(el, date) {
    const { onDayClick, format } = this.options;
    this.options.chooseDate = date;
    this.options.currentDate = date;
    const chooseDateEl = document.getElementsByClassName(s.chooseDate)[0];
    chooseDateEl && chooseDateEl.classList.remove(s.chooseDate);
    el.classList.add(s.chooseDate);
    onDayClick && onDayClick(utils.dateFormat(new Date(date), format));
  }

  switchMonth(action) {
    this.options.currentDate = this.switchMonthOfDate(action);
    this.handleShowMonth(true);
    this.renderDays();
  }

  switchMonthOfDate(action) {
    let {
      currentDate,
      onClickPreMonth,
      onClickNextMonth,
      onMonthChange
    } = this.options;
    currentDate = new Date(currentDate);
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    let newMonth, newYear;
    if (action === 'prev') {
      newMonth = currentMonth - 1;
      newYear = currentYear;
      if (newMonth < 1) {
        newYear = currentYear - 1;
        newMonth = 12;
      }

      onClickPreMonth && onClickPreMonth();
    } else if (action === 'next') {
      newMonth = currentMonth + 1;
      newYear = currentYear;
      if (newMonth > 12) {
        newYear = currentYear + 1;
        newMonth = 1;
      }
      onClickNextMonth && onClickNextMonth();
    }

    onMonthChange && onMonthChange();
    const newDate = `${newYear}/${utils.formatNumber(newMonth)}/01`;
    return newDate;
  }

  handleShowMonth(isMonthChanged) {
    const { showMonthEl, currentDate, monthFormat, onMonthChangeClick } = this.options;
    // const showMonth = utils.dateFormat(new Date(currentDate), monthFormat);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    showMonthEl.textContent = monthNames[new Date(currentDate).getMonth()] + ' ' + new Date(currentDate).getFullYear();
    if (isMonthChanged) {
      onMonthChangeClick(new Date(currentDate).getFullYear() + '/' + (new Date(currentDate).getMonth() + 1) + '/01');
    }
  }

  appendActionsIconToDate(targetDate, actionsDate, actionClass) {
    if (actionsDate && actionsDate.length > 0) {
      for (const index in actionsDate) {
        if (new Date(actionsDate[index].date).setHours(0, 0, 0, 0) === new Date(targetDate).setHours(0, 0, 0, 0)) {
          if (actionsDate[index].xp > 0) {
            return `<div class=${actionClass} style="background-color: ${actionsDate[index].color}" ></div>`;
          }
        }
      }
    }
    return '';
  }

  getColorForDate(targetDate, actionsDate) {
    // const test = [
    //   {
    //     date: '2020-05-14T18:30:00.000Z',
    //     color: 'yellow'
    //   },
    //   {
    //     date: '2020-05-03T18:30:00.000Z',
    //     color: 'blue'
    //   },
    //   {
    //     date: '2020-05-10T18:30:00.000Z',
    //     color: 'red'
    //   },
    //   {
    //     date: '2020-05-14T18:30:00.000Z',
    //     color: 'yellow'
    //   }
    // ];
    let dateFormatForTarget = new Date(targetDate);
    const isToday = dateFormatForTarget.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0);
    // console.log('dateFormatForTarget.getDay() : ', dateFormatForTarget.getDay());
    if (dateFormatForTarget.getDay() > 0 && !isToday) {
      const currentMonth = dateFormatForTarget.getMonth();
      dateFormatForTarget.setDate(dateFormatForTarget.getDate() + (7 - dateFormatForTarget.getDay()));
      if ((dateFormatForTarget.setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0)) &&
        (new Date(targetDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0))) {
        dateFormatForTarget.setDate(new Date().getDate() - 1);
      }
      if (currentMonth < dateFormatForTarget.getMonth()) {
        // console.log(currentMonth);
        // console.log(new Date(dateFormatForTarget.getFullYear(), currentMonth + 1, 0).getDate());
        dateFormatForTarget = new Date(dateFormatForTarget.getFullYear(), currentMonth + 1, 0);
        // console.log(dateFormatForTarget)
      }
    } else {
      dateFormatForTarget.setDate(dateFormatForTarget.getDate());
    }
    // console.log('dateFormatForTarget : ', dateFormatForTarget.toISOString());
    if (actionsDate && actionsDate.length > 0) {
      for (const index in actionsDate) {
        if (new Date(actionsDate[index].date).setHours(0, 0, 0, 0) === dateFormatForTarget.setHours(0, 0, 0, 0)) {
          return actionsDate[index].color;
        }
      }
    }
    return '';
  }

  getDayValue(day) {
    const days = {
      'sunday': 0,
      'monday': 1,
      'tuesday': 2,
      'wednesday': 3,
      'thursday': 4,
      'friday': 5,
      'saturday': 6
    };

    return days[day.toLowerCase()];
  }

  getGradientStyling(color) {
    if (color.toLowerCase() === 'red') {
      return 'background-image: linear-gradient(#FF9976, #FFA889);';
    } else if (color.toLowerCase() === 'yellow') {
      return 'background-image: linear-gradient(#FFE068, #FFAF66);';
    } else if (color.toLowerCase() === 'blue') {
      return 'background-image: linear-gradient(#86E6F6, #72DFDF);';
    }
  }

  getBorderRadius(date, startDay, isBeginningOfMonth) {
    const currentDate = new Date();
    const prevDateNoTimeString = new Date(currentDate.setDate(currentDate.getDate() - 1)).setHours(0, 0, 0, 0);
    const receivedDayNoTimeString = new Date(date).setHours(0, 0, 0, 0);
    const receivedDay = new Date(date).getDay();
    // console.log(isBeginningOfMonth, new Date(date).getDate());
    if (isBeginningOfMonth && new Date(date).getDay() === 0) {
      return 'border-radius: 44%';
    } else if (prevDateNoTimeString === receivedDayNoTimeString || receivedDay === 0 || this.isLastDay(date)) {
      return 'border-radius: 0 44% 44% 0';
    } else if (receivedDay === startDay || receivedDay === 1 || isBeginningOfMonth) {
      return 'border-radius: 44% 0 0 44%';
    } else {
      return 'border-radius: 0';
    }
  }

  isLastDay(date) {
    const dt = new Date(date);
    return new Date(dt.getTime() + 86400000).getDate() === 1;
  }
}

export default Calendar;
