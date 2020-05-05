import utils from './utils';
import s from './calendar.scss';

const TOTAL_DAYS = 42; // 日历一共显示42天
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

    this.options = { ...defaultOptions, ...options };

    this.init();
  }

  init() {
    this.renderContainer();
    this.renderController();
    this.renderContent();
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
    const prevArrow = utils.createElement('button', s.controllerArrow);
    prevArrow.onclick = () => this.switchMonth('prev');
    const nextArrow = utils.createElement(
      'button',
      `${s.controllerArrow} ${s.nextArrow}`
    );
    nextArrow.onclick = () => this.switchMonth('next');

    this.options.showMonthEl = showMonthEl;
    this.handelShowMonth();
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
    const weeks = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Award'];
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
    const { chooseDate, daysEl } = this.options;
    const days = this.generateCalendarGroup();
    const box = utils.createElement('div', s.dayBox);

    console.log(days);
    days.forEach((day, index) => {
      let dayItemClass = s.dayItem;
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

      if ((index > 0 && index <= 31) && (index % 7 === 0)) {
        // console.log(day.text, 'index : ', index)
        const awardEl = utils.createElement('button', dayItemClass);
        awardEl.setAttribute('id', 'award-' + (index / 6));
        box.appendChild(awardEl);
      }

      const dayEl = utils.createElement('button', dayItemClass);
      if (day.type === 'current') {
        dayEl.innerHTML = `<div class=${s.dayItemContainer}>
        <span class=${s.dayItemText}>${day.text}</span></div>`;
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
    const weekOfCurrentMonth = new Date(
      `${currentYear}/${utils.formatNumber(currentMonth)}/01`
    ).getDay() - 1; // 获取本月第一天星期几
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
    this.handelShowMonth();
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

  handelShowMonth() {
    const { showMonthEl, currentDate, monthFormat } = this.options;
    // const showMonth = utils.dateFormat(new Date(currentDate), monthFormat);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    showMonthEl.textContent = monthNames[new Date(currentDate).getMonth()] + ' ' + new Date(currentDate).getFullYear();
  }
}

export default Calendar;
