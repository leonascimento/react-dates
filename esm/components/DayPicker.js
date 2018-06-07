var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

import _objectAssign from 'object.assign';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import PropTypes from 'prop-types';
import shallowCompare from 'react-addons-shallow-compare';
import { forbidExtraProps, nonNegativeInteger } from 'airbnb-prop-types';
import { css, withStyles, withStylesPropTypes } from 'react-with-styles';

import moment from 'moment';
import throttle from 'lodash/throttle';
import isTouchDevice from 'is-touch-device';
import OutsideClickHandler from 'react-outside-click-handler';

import { DayPickerPhrases } from '../defaultPhrases';
import getPhrasePropTypes from '../utils/getPhrasePropTypes';

import CalendarMonthGrid from './CalendarMonthGrid';
import DayPickerNavigation from './DayPickerNavigation';
import DayPickerKeyboardShortcuts, { TOP_LEFT, TOP_RIGHT, BOTTOM_RIGHT } from './DayPickerKeyboardShortcuts';

import getNumberOfCalendarMonthWeeks from '../utils/getNumberOfCalendarMonthWeeks';
import getCalendarMonthWidth from '../utils/getCalendarMonthWidth';
import calculateDimension from '../utils/calculateDimension';
import getActiveElement from '../utils/getActiveElement';
import isDayVisible from '../utils/isDayVisible';

import ScrollableOrientationShape from '../shapes/ScrollableOrientationShape';
import DayOfWeekShape from '../shapes/DayOfWeekShape';
import CalendarInfoPositionShape from '../shapes/CalendarInfoPositionShape';

import { HORIZONTAL_ORIENTATION, VERTICAL_ORIENTATION, VERTICAL_SCROLLABLE, DAY_SIZE, INFO_POSITION_TOP, INFO_POSITION_BOTTOM, INFO_POSITION_BEFORE, INFO_POSITION_AFTER, MODIFIER_KEY_NAMES } from '../constants';

var MONTH_PADDING = 23;
var DAY_PICKER_PADDING = 9;
var PREV_TRANSITION = 'prev';
var NEXT_TRANSITION = 'next';

var propTypes = forbidExtraProps(_objectAssign({}, withStylesPropTypes, {

  // calendar presentation props
  enableOutsideDays: PropTypes.bool,
  numberOfMonths: PropTypes.number,
  orientation: ScrollableOrientationShape,
  withPortal: PropTypes.bool,
  onOutsideClick: PropTypes.func,
  hidden: PropTypes.bool,
  initialVisibleMonth: PropTypes.func,
  firstDayOfWeek: DayOfWeekShape,
  renderCalendarInfo: PropTypes.func,
  calendarInfoPosition: CalendarInfoPositionShape,
  hideKeyboardShortcutsPanel: PropTypes.bool,
  daySize: nonNegativeInteger,
  isRTL: PropTypes.bool,
  verticalHeight: nonNegativeInteger,
  noBorder: PropTypes.bool,
  transitionDuration: nonNegativeInteger,
  verticalBorderSpacing: nonNegativeInteger,
  child: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),

  // navigation props
  navPrev: PropTypes.node,
  navNext: PropTypes.node,
  noNavButtons: PropTypes.bool,
  onPrevMonthClick: PropTypes.func,
  onNextMonthClick: PropTypes.func,
  onMultiplyScrollableMonths: PropTypes.func, // VERTICAL_SCROLLABLE daypickers only

  // month props
  renderMonth: PropTypes.func,

  // day props
  modifiers: PropTypes.object,
  renderCalendarDay: PropTypes.func,
  renderDayContents: PropTypes.func,
  onDayClick: PropTypes.func,
  onDayMouseEnter: PropTypes.func,
  onDayMouseLeave: PropTypes.func,

  // accessibility props
  isFocused: PropTypes.bool,
  getFirstFocusableDay: PropTypes.func,
  onBlur: PropTypes.func,
  showKeyboardShortcuts: PropTypes.bool,

  // internationalization
  monthFormat: PropTypes.string,
  weekDayFormat: PropTypes.string,
  phrases: PropTypes.shape(getPhrasePropTypes(DayPickerPhrases)),
  dayAriaLabelFormat: PropTypes.string
}));

export var defaultProps = {
  // calendar presentation props
  enableOutsideDays: false,
  numberOfMonths: 2,
  orientation: HORIZONTAL_ORIENTATION,
  withPortal: false,
  onOutsideClick: function () {
    function onOutsideClick() {}

    return onOutsideClick;
  }(),

  hidden: false,
  initialVisibleMonth: function () {
    function initialVisibleMonth() {
      return moment();
    }

    return initialVisibleMonth;
  }(),
  firstDayOfWeek: null,
  renderCalendarInfo: null,
  calendarInfoPosition: INFO_POSITION_BOTTOM,
  hideKeyboardShortcutsPanel: false,
  daySize: DAY_SIZE,
  isRTL: false,
  verticalHeight: null,
  noBorder: false,
  transitionDuration: undefined,
  verticalBorderSpacing: undefined,
  child: null,

  // navigation props
  navPrev: null,
  navNext: null,
  noNavButtons: false,
  onPrevMonthClick: function () {
    function onPrevMonthClick() {}

    return onPrevMonthClick;
  }(),
  onNextMonthClick: function () {
    function onNextMonthClick() {}

    return onNextMonthClick;
  }(),
  onMultiplyScrollableMonths: function () {
    function onMultiplyScrollableMonths() {}

    return onMultiplyScrollableMonths;
  }(),


  // month props
  renderMonth: null,

  // day props
  modifiers: {},
  renderCalendarDay: undefined,
  renderDayContents: null,
  onDayClick: function () {
    function onDayClick() {}

    return onDayClick;
  }(),
  onDayMouseEnter: function () {
    function onDayMouseEnter() {}

    return onDayMouseEnter;
  }(),
  onDayMouseLeave: function () {
    function onDayMouseLeave() {}

    return onDayMouseLeave;
  }(),


  // accessibility props
  isFocused: false,
  getFirstFocusableDay: null,
  onBlur: function () {
    function onBlur() {}

    return onBlur;
  }(),

  showKeyboardShortcuts: false,

  // internationalization
  monthFormat: 'MMMM YYYY',
  weekDayFormat: 'dd',
  phrases: DayPickerPhrases,
  dayAriaLabelFormat: undefined
};

var DayPicker = function (_React$Component) {
  _inherits(DayPicker, _React$Component);

  function DayPicker(props) {
    _classCallCheck(this, DayPicker);

    var _this = _possibleConstructorReturn(this, (DayPicker.__proto__ || Object.getPrototypeOf(DayPicker)).call(this, props));

    var currentMonth = props.hidden ? moment() : props.initialVisibleMonth();

    var focusedDate = currentMonth.clone().startOf('month');
    if (props.getFirstFocusableDay) {
      focusedDate = props.getFirstFocusableDay(currentMonth);
    }

    var translationValue = props.isRTL && _this.isHorizontal() ? -getCalendarMonthWidth(props.daySize) : 0;

    _this.hasSetInitialVisibleMonth = !props.hidden;
    _this.state = {
      currentMonth: currentMonth,
      monthTransition: null,
      translationValue: translationValue,
      scrollableMonthMultiple: 1,
      calendarMonthWidth: getCalendarMonthWidth(props.daySize),
      focusedDate: !props.hidden || props.isFocused ? focusedDate : null,
      nextFocusedDate: null,
      showKeyboardShortcuts: props.showKeyboardShortcuts,
      onKeyboardShortcutsPanelClose: function () {
        function onKeyboardShortcutsPanelClose() {}

        return onKeyboardShortcutsPanelClose;
      }(),

      isTouchDevice: isTouchDevice(),
      withMouseInteractions: true,
      hasSetHeight: false,
      calendarInfoWidth: 0,
      monthTitleHeight: 0
    };

    _this.setCalendarMonthWeeks();

    _this.calendarMonthGridHeight = 0;
    _this.setCalendarInfoWidthTimeout = null;

    _this.onKeyDown = _this.onKeyDown.bind(_this);
    _this.throttledKeyDown = throttle(_this.onFinalKeyDown, 200, { trailing: false });
    _this.onPrevMonthClick = _this.onPrevMonthClick.bind(_this);
    _this.onNextMonthClick = _this.onNextMonthClick.bind(_this);
    _this.multiplyScrollableMonths = _this.multiplyScrollableMonths.bind(_this);
    _this.updateStateAfterMonthTransition = _this.updateStateAfterMonthTransition.bind(_this);

    _this.openKeyboardShortcutsPanel = _this.openKeyboardShortcutsPanel.bind(_this);
    _this.closeKeyboardShortcutsPanel = _this.closeKeyboardShortcutsPanel.bind(_this);

    _this.setCalendarInfoRef = _this.setCalendarInfoRef.bind(_this);
    _this.setContainerRef = _this.setContainerRef.bind(_this);
    _this.setTransitionContainerRef = _this.setTransitionContainerRef.bind(_this);
    _this.setMonthTitleHeight = _this.setMonthTitleHeight.bind(_this);
    return _this;
  }

  _createClass(DayPicker, [{
    key: 'componentDidMount',
    value: function () {
      function componentDidMount() {
        if (this.calendarInfo) {
          this.setState({
            isTouchDevice: isTouchDevice(),
            calendarInfoWidth: calculateDimension(this.calendarInfo, 'width', true, true)
          });
        } else {
          this.setState({ isTouchDevice: isTouchDevice() });
        }

        this.setCalendarMonthWeeks();
      }

      return componentDidMount;
    }()
  }, {
    key: 'componentWillReceiveProps',
    value: function () {
      function componentWillReceiveProps(nextProps) {
        var hidden = nextProps.hidden,
            isFocused = nextProps.isFocused,
            showKeyboardShortcuts = nextProps.showKeyboardShortcuts,
            onBlur = nextProps.onBlur,
            renderMonth = nextProps.renderMonth;
        var currentMonth = this.state.currentMonth;


        if (!hidden) {
          if (!this.hasSetInitialVisibleMonth) {
            this.hasSetInitialVisibleMonth = true;
            this.setState({
              currentMonth: nextProps.initialVisibleMonth()
            });
          }
        }

        if (nextProps.daySize !== this.props.daySize) {
          this.setState({
            calendarMonthWidth: getCalendarMonthWidth(nextProps.daySize)
          });
        }

        if (isFocused !== this.props.isFocused) {
          if (isFocused) {
            var focusedDate = this.getFocusedDay(currentMonth);

            var onKeyboardShortcutsPanelClose = this.state.onKeyboardShortcutsPanelClose;

            if (nextProps.showKeyboardShortcuts) {
              // the ? shortcut came from the input and we should return input there once it is close
              onKeyboardShortcutsPanelClose = onBlur;
            }

            this.setState({
              showKeyboardShortcuts: showKeyboardShortcuts,
              onKeyboardShortcutsPanelClose: onKeyboardShortcutsPanelClose,
              focusedDate: focusedDate,
              withMouseInteractions: false
            });
          } else {
            this.setState({ focusedDate: null });
          }
        }

        if (renderMonth !== this.props.renderMonth) {
          this.setState({
            monthTitleHeight: null
          });
        }
      }

      return componentWillReceiveProps;
    }()
  }, {
    key: 'shouldComponentUpdate',
    value: function () {
      function shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
      }

      return shouldComponentUpdate;
    }()
  }, {
    key: 'componentWillUpdate',
    value: function () {
      function componentWillUpdate() {
        var _this2 = this;

        var transitionDuration = this.props.transitionDuration;

        // Calculating the dimensions trigger a DOM repaint which
        // breaks the CSS transition.
        // The setTimeout will wait until the transition ends.

        if (this.calendarInfo) {
          this.setCalendarInfoWidthTimeout = setTimeout(function () {
            var calendarInfoWidth = _this2.state.calendarInfoWidth;

            var calendarInfoPanelWidth = calculateDimension(_this2.calendarInfo, 'width', true, true);
            if (calendarInfoWidth !== calendarInfoPanelWidth) {
              _this2.setState({
                calendarInfoWidth: calendarInfoPanelWidth
              });
            }
          }, transitionDuration);
        }
      }

      return componentWillUpdate;
    }()
  }, {
    key: 'componentDidUpdate',
    value: function () {
      function componentDidUpdate(prevProps) {
        var isFocused = this.props.isFocused;
        var focusedDate = this.state.focusedDate;


        if (!prevProps.isFocused && isFocused && !focusedDate) {
          this.container.focus();
        }
      }

      return componentDidUpdate;
    }()
  }, {
    key: 'componentWillUnmount',
    value: function () {
      function componentWillUnmount() {
        clearTimeout(this.setCalendarInfoWidthTimeout);
      }

      return componentWillUnmount;
    }()
  }, {
    key: 'onKeyDown',
    value: function () {
      function onKeyDown(e) {
        e.stopPropagation();
        if (!MODIFIER_KEY_NAMES.has(e.key)) {
          this.throttledKeyDown(e);
        }
      }

      return onKeyDown;
    }()
  }, {
    key: 'onFinalKeyDown',
    value: function () {
      function onFinalKeyDown(e) {
        this.setState({ withMouseInteractions: false });

        var _props = this.props,
            onBlur = _props.onBlur,
            isRTL = _props.isRTL;
        var _state = this.state,
            focusedDate = _state.focusedDate,
            showKeyboardShortcuts = _state.showKeyboardShortcuts;

        if (!focusedDate) return;

        var newFocusedDate = focusedDate.clone();

        var didTransitionMonth = false;

        // focus might be anywhere when the keyboard shortcuts panel is opened so we want to
        // return it to wherever it was before when the panel was opened
        var activeElement = getActiveElement();
        var onKeyboardShortcutsPanelClose = function () {
          function onKeyboardShortcutsPanelClose() {
            if (activeElement) activeElement.focus();
          }

          return onKeyboardShortcutsPanelClose;
        }();

        switch (e.key) {
          case 'ArrowUp':
            e.preventDefault();
            newFocusedDate.subtract(1, 'week');
            didTransitionMonth = this.maybeTransitionPrevMonth(newFocusedDate);
            break;
          case 'ArrowLeft':
            e.preventDefault();
            if (isRTL) {
              newFocusedDate.add(1, 'day');
            } else {
              newFocusedDate.subtract(1, 'day');
            }
            didTransitionMonth = this.maybeTransitionPrevMonth(newFocusedDate);
            break;
          case 'Home':
            e.preventDefault();
            newFocusedDate.startOf('week');
            didTransitionMonth = this.maybeTransitionPrevMonth(newFocusedDate);
            break;
          case 'PageUp':
            e.preventDefault();
            newFocusedDate.subtract(1, 'month');
            didTransitionMonth = this.maybeTransitionPrevMonth(newFocusedDate);
            break;

          case 'ArrowDown':
            e.preventDefault();
            newFocusedDate.add(1, 'week');
            didTransitionMonth = this.maybeTransitionNextMonth(newFocusedDate);
            break;
          case 'ArrowRight':
            e.preventDefault();
            if (isRTL) {
              newFocusedDate.subtract(1, 'day');
            } else {
              newFocusedDate.add(1, 'day');
            }
            didTransitionMonth = this.maybeTransitionNextMonth(newFocusedDate);
            break;
          case 'End':
            e.preventDefault();
            newFocusedDate.endOf('week');
            didTransitionMonth = this.maybeTransitionNextMonth(newFocusedDate);
            break;
          case 'PageDown':
            e.preventDefault();
            newFocusedDate.add(1, 'month');
            didTransitionMonth = this.maybeTransitionNextMonth(newFocusedDate);
            break;

          case '?':
            this.openKeyboardShortcutsPanel(onKeyboardShortcutsPanelClose);
            break;

          case 'Escape':
            if (showKeyboardShortcuts) {
              this.closeKeyboardShortcutsPanel();
            } else {
              onBlur();
            }
            break;

          default:
            break;
        }

        // If there was a month transition, do not update the focused date until the transition has
        // completed. Otherwise, attempting to focus on a DOM node may interrupt the CSS animation. If
        // didTransitionMonth is true, the focusedDate gets updated in #updateStateAfterMonthTransition
        if (!didTransitionMonth) {
          this.setState({
            focusedDate: newFocusedDate
          });
        }
      }

      return onFinalKeyDown;
    }()
  }, {
    key: 'onPrevMonthClick',
    value: function () {
      function onPrevMonthClick(nextFocusedDate, e) {
        var _props2 = this.props,
            daySize = _props2.daySize,
            isRTL = _props2.isRTL,
            numberOfMonths = _props2.numberOfMonths;
        var _state2 = this.state,
            calendarMonthWidth = _state2.calendarMonthWidth,
            monthTitleHeight = _state2.monthTitleHeight;


        if (e) e.preventDefault();

        var translationValue = void 0;
        if (this.isVertical()) {
          var calendarMonthWeeksHeight = this.calendarMonthWeeks[0] * (daySize - 1);
          translationValue = monthTitleHeight + calendarMonthWeeksHeight + 1;
        } else if (this.isHorizontal()) {
          translationValue = calendarMonthWidth;
          if (isRTL) {
            translationValue = -2 * calendarMonthWidth;
          }

          var visibleCalendarWeeks = this.calendarMonthWeeks.slice(0, numberOfMonths);
          var _calendarMonthWeeksHeight = Math.max.apply(Math, [0].concat(_toConsumableArray(visibleCalendarWeeks))) * (daySize - 1);
          var newMonthHeight = monthTitleHeight + _calendarMonthWeeksHeight + 1;
          this.adjustDayPickerHeight(newMonthHeight);
        }

        this.setState({
          monthTransition: PREV_TRANSITION,
          translationValue: translationValue,
          focusedDate: null,
          nextFocusedDate: nextFocusedDate
        });
      }

      return onPrevMonthClick;
    }()
  }, {
    key: 'onNextMonthClick',
    value: function () {
      function onNextMonthClick(nextFocusedDate, e) {
        var _props3 = this.props,
            isRTL = _props3.isRTL,
            numberOfMonths = _props3.numberOfMonths,
            daySize = _props3.daySize;
        var _state3 = this.state,
            calendarMonthWidth = _state3.calendarMonthWidth,
            monthTitleHeight = _state3.monthTitleHeight;


        if (e) e.preventDefault();

        var translationValue = void 0;

        if (this.isVertical()) {
          var firstVisibleMonthWeeks = this.calendarMonthWeeks[1];
          var calendarMonthWeeksHeight = firstVisibleMonthWeeks * (daySize - 1);
          translationValue = -(monthTitleHeight + calendarMonthWeeksHeight + 1);
        }

        if (this.isHorizontal()) {
          translationValue = -calendarMonthWidth;
          if (isRTL) {
            translationValue = 0;
          }

          var visibleCalendarWeeks = this.calendarMonthWeeks.slice(2, numberOfMonths + 2);
          var _calendarMonthWeeksHeight2 = Math.max.apply(Math, [0].concat(_toConsumableArray(visibleCalendarWeeks))) * (daySize - 1);
          var newMonthHeight = monthTitleHeight + _calendarMonthWeeksHeight2 + 1;
          this.adjustDayPickerHeight(newMonthHeight);
        }

        this.setState({
          monthTransition: NEXT_TRANSITION,
          translationValue: translationValue,
          focusedDate: null,
          nextFocusedDate: nextFocusedDate
        });
      }

      return onNextMonthClick;
    }()
  }, {
    key: 'getFirstDayOfWeek',
    value: function () {
      function getFirstDayOfWeek() {
        var firstDayOfWeek = this.props.firstDayOfWeek;

        if (firstDayOfWeek == null) {
          return moment.localeData().firstDayOfWeek();
        }

        return firstDayOfWeek;
      }

      return getFirstDayOfWeek;
    }()
  }, {
    key: 'getFirstVisibleIndex',
    value: function () {
      function getFirstVisibleIndex() {
        var orientation = this.props.orientation;
        var monthTransition = this.state.monthTransition;


        if (orientation === VERTICAL_SCROLLABLE) return 0;

        var firstVisibleMonthIndex = 1;
        if (monthTransition === PREV_TRANSITION) {
          firstVisibleMonthIndex -= 1;
        } else if (monthTransition === NEXT_TRANSITION) {
          firstVisibleMonthIndex += 1;
        }

        return firstVisibleMonthIndex;
      }

      return getFirstVisibleIndex;
    }()
  }, {
    key: 'getFocusedDay',
    value: function () {
      function getFocusedDay(newMonth) {
        var _props4 = this.props,
            getFirstFocusableDay = _props4.getFirstFocusableDay,
            numberOfMonths = _props4.numberOfMonths;


        var focusedDate = void 0;
        if (getFirstFocusableDay) {
          focusedDate = getFirstFocusableDay(newMonth);
        }

        if (newMonth && (!focusedDate || !isDayVisible(focusedDate, newMonth, numberOfMonths))) {
          focusedDate = newMonth.clone().startOf('month');
        }

        return focusedDate;
      }

      return getFocusedDay;
    }()
  }, {
    key: 'setMonthTitleHeight',
    value: function () {
      function setMonthTitleHeight(monthTitleHeight) {
        var daySize = this.props.daySize;

        var calendarMonthWeeksHeight = Math.max.apply(Math, [0].concat(_toConsumableArray(this.calendarMonthWeeks))) * (daySize - 1);
        var newMonthHeight = monthTitleHeight + calendarMonthWeeksHeight + 1;

        if (this.isHorizontal()) {
          this.adjustDayPickerHeight(newMonthHeight);
        }

        this.setState({
          monthTitleHeight: monthTitleHeight,
          hasSetHeight: true
        });
      }

      return setMonthTitleHeight;
    }()
  }, {
    key: 'setCalendarMonthWeeks',
    value: function () {
      function setCalendarMonthWeeks() {
        var numberOfMonths = this.props.numberOfMonths;
        var currentMonth = this.state.currentMonth;


        this.calendarMonthWeeks = [];
        var month = currentMonth.clone().subtract(1, 'months');
        var firstDayOfWeek = this.getFirstDayOfWeek();
        for (var i = 0; i < numberOfMonths + 2; i += 1) {
          var numberOfWeeks = getNumberOfCalendarMonthWeeks(month, firstDayOfWeek);
          this.calendarMonthWeeks.push(numberOfWeeks);
          month = month.add(1, 'months');
        }
      }

      return setCalendarMonthWeeks;
    }()
  }, {
    key: 'setContainerRef',
    value: function () {
      function setContainerRef(ref) {
        this.container = ref;
      }

      return setContainerRef;
    }()
  }, {
    key: 'setCalendarInfoRef',
    value: function () {
      function setCalendarInfoRef(ref) {
        this.calendarInfo = ref;
      }

      return setCalendarInfoRef;
    }()
  }, {
    key: 'setTransitionContainerRef',
    value: function () {
      function setTransitionContainerRef(ref) {
        this.transitionContainer = ref;
      }

      return setTransitionContainerRef;
    }()
  }, {
    key: 'maybeTransitionNextMonth',
    value: function () {
      function maybeTransitionNextMonth(newFocusedDate) {
        var numberOfMonths = this.props.numberOfMonths;
        var _state4 = this.state,
            currentMonth = _state4.currentMonth,
            focusedDate = _state4.focusedDate;


        var newFocusedDateMonth = newFocusedDate.month();
        var focusedDateMonth = focusedDate.month();
        var isNewFocusedDateVisible = isDayVisible(newFocusedDate, currentMonth, numberOfMonths);
        if (newFocusedDateMonth !== focusedDateMonth && !isNewFocusedDateVisible) {
          this.onNextMonthClick(newFocusedDate);
          return true;
        }

        return false;
      }

      return maybeTransitionNextMonth;
    }()
  }, {
    key: 'maybeTransitionPrevMonth',
    value: function () {
      function maybeTransitionPrevMonth(newFocusedDate) {
        var numberOfMonths = this.props.numberOfMonths;
        var _state5 = this.state,
            currentMonth = _state5.currentMonth,
            focusedDate = _state5.focusedDate;


        var newFocusedDateMonth = newFocusedDate.month();
        var focusedDateMonth = focusedDate.month();
        var isNewFocusedDateVisible = isDayVisible(newFocusedDate, currentMonth, numberOfMonths);
        if (newFocusedDateMonth !== focusedDateMonth && !isNewFocusedDateVisible) {
          this.onPrevMonthClick(newFocusedDate);
          return true;
        }

        return false;
      }

      return maybeTransitionPrevMonth;
    }()
  }, {
    key: 'multiplyScrollableMonths',
    value: function () {
      function multiplyScrollableMonths(e) {
        var onMultiplyScrollableMonths = this.props.onMultiplyScrollableMonths;

        if (e) e.preventDefault();

        if (onMultiplyScrollableMonths) onMultiplyScrollableMonths(e);

        this.setState({
          scrollableMonthMultiple: this.state.scrollableMonthMultiple + 1
        });
      }

      return multiplyScrollableMonths;
    }()
  }, {
    key: 'isHorizontal',
    value: function () {
      function isHorizontal() {
        var orientation = this.props.orientation;

        return orientation === HORIZONTAL_ORIENTATION;
      }

      return isHorizontal;
    }()
  }, {
    key: 'isVertical',
    value: function () {
      function isVertical() {
        var orientation = this.props.orientation;

        return orientation === VERTICAL_ORIENTATION || orientation === VERTICAL_SCROLLABLE;
      }

      return isVertical;
    }()
  }, {
    key: 'updateStateAfterMonthTransition',
    value: function () {
      function updateStateAfterMonthTransition() {
        var _this3 = this;

        var _props5 = this.props,
            onPrevMonthClick = _props5.onPrevMonthClick,
            onNextMonthClick = _props5.onNextMonthClick,
            numberOfMonths = _props5.numberOfMonths,
            isRTL = _props5.isRTL;
        var _state6 = this.state,
            currentMonth = _state6.currentMonth,
            monthTransition = _state6.monthTransition,
            focusedDate = _state6.focusedDate,
            nextFocusedDate = _state6.nextFocusedDate,
            withMouseInteractions = _state6.withMouseInteractions,
            calendarMonthWidth = _state6.calendarMonthWidth;


        if (!monthTransition) return;

        var newMonth = currentMonth.clone();
        var firstDayOfWeek = this.getFirstDayOfWeek();
        if (monthTransition === PREV_TRANSITION) {
          if (onPrevMonthClick) onPrevMonthClick();
          newMonth.subtract(1, 'month');
          var newInvisibleMonth = newMonth.clone().subtract(1, 'month');
          var numberOfWeeks = getNumberOfCalendarMonthWeeks(newInvisibleMonth, firstDayOfWeek);
          this.calendarMonthWeeks = [numberOfWeeks].concat(_toConsumableArray(this.calendarMonthWeeks.slice(0, -1)));
        } else if (monthTransition === NEXT_TRANSITION) {
          if (onNextMonthClick) onNextMonthClick();
          newMonth.add(1, 'month');
          var _newInvisibleMonth = newMonth.clone().add(numberOfMonths, 'month');
          var _numberOfWeeks = getNumberOfCalendarMonthWeeks(_newInvisibleMonth, firstDayOfWeek);
          this.calendarMonthWeeks = [].concat(_toConsumableArray(this.calendarMonthWeeks.slice(1)), [_numberOfWeeks]);
        }

        var newFocusedDate = null;
        if (nextFocusedDate) {
          newFocusedDate = nextFocusedDate;
        } else if (!focusedDate && !withMouseInteractions) {
          newFocusedDate = this.getFocusedDay(newMonth);
        }

        this.setState({
          currentMonth: newMonth,
          monthTransition: null,
          translationValue: isRTL && this.isHorizontal() ? -calendarMonthWidth : 0,
          nextFocusedDate: null,
          focusedDate: newFocusedDate
        }, function () {
          // we don't want to focus on the relevant calendar day after a month transition
          // if the user is navigating around using a mouse
          if (withMouseInteractions) {
            var activeElement = getActiveElement();
            if (activeElement && activeElement !== document.body && _this3.container.contains(activeElement)) {
              activeElement.blur();
            }
          }
        });
      }

      return updateStateAfterMonthTransition;
    }()
  }, {
    key: 'adjustDayPickerHeight',
    value: function () {
      function adjustDayPickerHeight(newMonthHeight) {
        var monthHeight = newMonthHeight + MONTH_PADDING;
        if (monthHeight !== this.calendarMonthGridHeight) {
          this.calendarMonthGridHeight = monthHeight;
          this.transitionContainer.style.height = String(monthHeight) + 'px';
        }
      }

      return adjustDayPickerHeight;
    }()
  }, {
    key: 'openKeyboardShortcutsPanel',
    value: function () {
      function openKeyboardShortcutsPanel(onCloseCallBack) {
        this.setState({
          showKeyboardShortcuts: true,
          onKeyboardShortcutsPanelClose: onCloseCallBack
        });
      }

      return openKeyboardShortcutsPanel;
    }()
  }, {
    key: 'closeKeyboardShortcutsPanel',
    value: function () {
      function closeKeyboardShortcutsPanel() {
        var onKeyboardShortcutsPanelClose = this.state.onKeyboardShortcutsPanelClose;


        if (onKeyboardShortcutsPanelClose) {
          onKeyboardShortcutsPanelClose();
        }

        this.setState({
          onKeyboardShortcutsPanelClose: null,
          showKeyboardShortcuts: false
        });
      }

      return closeKeyboardShortcutsPanel;
    }()
  }, {
    key: 'renderNavigation',
    value: function () {
      function renderNavigation() {
        var _this4 = this;

        var _props6 = this.props,
            navPrev = _props6.navPrev,
            navNext = _props6.navNext,
            noNavButtons = _props6.noNavButtons,
            orientation = _props6.orientation,
            phrases = _props6.phrases,
            isRTL = _props6.isRTL;


        if (noNavButtons) {
          return null;
        }

        var onNextMonthClick = void 0;
        if (orientation === VERTICAL_SCROLLABLE) {
          onNextMonthClick = this.multiplyScrollableMonths;
        } else {
          onNextMonthClick = function () {
            function onNextMonthClick(e) {
              _this4.onNextMonthClick(null, e);
            }

            return onNextMonthClick;
          }();
        }

        return React.createElement(DayPickerNavigation, {
          onPrevMonthClick: function () {
            function onPrevMonthClick(e) {
              _this4.onPrevMonthClick(null, e);
            }

            return onPrevMonthClick;
          }(),
          onNextMonthClick: onNextMonthClick,
          navPrev: navPrev,
          navNext: navNext,
          orientation: orientation,
          phrases: phrases,
          isRTL: isRTL
        });
      }

      return renderNavigation;
    }()
  }, {
    key: 'renderWeekHeader',
    value: function () {
      function renderWeekHeader(index) {
        var _props7 = this.props,
            daySize = _props7.daySize,
            orientation = _props7.orientation,
            weekDayFormat = _props7.weekDayFormat,
            styles = _props7.styles;
        var calendarMonthWidth = this.state.calendarMonthWidth;

        var verticalScrollable = orientation === VERTICAL_SCROLLABLE;
        var horizontalStyle = {
          left: index * calendarMonthWidth
        };
        var verticalStyle = {
          marginLeft: -calendarMonthWidth / 2
        };

        var weekHeaderStyle = {}; // no styles applied to the vertical-scrollable orientation
        if (this.isHorizontal()) {
          weekHeaderStyle = horizontalStyle;
        } else if (this.isVertical() && !verticalScrollable) {
          weekHeaderStyle = verticalStyle;
        }

        var firstDayOfWeek = this.getFirstDayOfWeek();

        var header = [];
        for (var i = 0; i < 7; i += 1) {
          header.push(React.createElement(
            'li',
            _extends({ key: i }, css(styles.DayPicker_weekHeader_li, { width: daySize })),
            React.createElement(
              'small',
              null,
              moment().day((i + firstDayOfWeek) % 7).format(weekDayFormat)
            )
          ));
        }

        return React.createElement(
          'div',
          _extends({}, css(styles.DayPicker_weekHeader, this.isVertical() && styles.DayPicker_weekHeader__vertical, verticalScrollable && styles.DayPicker_weekHeader__verticalScrollable, weekHeaderStyle), {
            key: 'week-' + String(index)
          }),
          React.createElement(
            'ul',
            css(styles.DayPicker_weekHeader_ul),
            header
          )
        );
      }

      return renderWeekHeader;
    }()
  }, {
    key: 'render',
    value: function () {
      function render() {
        var _this5 = this;

        var _state7 = this.state,
            calendarMonthWidth = _state7.calendarMonthWidth,
            currentMonth = _state7.currentMonth,
            monthTransition = _state7.monthTransition,
            translationValue = _state7.translationValue,
            scrollableMonthMultiple = _state7.scrollableMonthMultiple,
            focusedDate = _state7.focusedDate,
            showKeyboardShortcuts = _state7.showKeyboardShortcuts,
            isTouch = _state7.isTouchDevice,
            hasSetHeight = _state7.hasSetHeight,
            calendarInfoWidth = _state7.calendarInfoWidth,
            monthTitleHeight = _state7.monthTitleHeight;
        var _props8 = this.props,
            enableOutsideDays = _props8.enableOutsideDays,
            numberOfMonths = _props8.numberOfMonths,
            orientation = _props8.orientation,
            modifiers = _props8.modifiers,
            withPortal = _props8.withPortal,
            onDayClick = _props8.onDayClick,
            onDayMouseEnter = _props8.onDayMouseEnter,
            onDayMouseLeave = _props8.onDayMouseLeave,
            firstDayOfWeek = _props8.firstDayOfWeek,
            renderMonth = _props8.renderMonth,
            renderCalendarDay = _props8.renderCalendarDay,
            renderDayContents = _props8.renderDayContents,
            renderCalendarInfo = _props8.renderCalendarInfo,
            calendarInfoPosition = _props8.calendarInfoPosition,
            hideKeyboardShortcutsPanel = _props8.hideKeyboardShortcutsPanel,
            onOutsideClick = _props8.onOutsideClick,
            monthFormat = _props8.monthFormat,
            daySize = _props8.daySize,
            isFocused = _props8.isFocused,
            isRTL = _props8.isRTL,
            styles = _props8.styles,
            phrases = _props8.phrases,
            verticalHeight = _props8.verticalHeight,
            dayAriaLabelFormat = _props8.dayAriaLabelFormat,
            noBorder = _props8.noBorder,
            transitionDuration = _props8.transitionDuration,
            verticalBorderSpacing = _props8.verticalBorderSpacing,
            child = _props8.child;


        var isHorizontal = this.isHorizontal();

        var numOfWeekHeaders = this.isVertical() ? 1 : numberOfMonths;
        var weekHeaders = [];
        for (var i = 0; i < numOfWeekHeaders; i += 1) {
          weekHeaders.push(this.renderWeekHeader(i));
        }

        var verticalScrollable = orientation === VERTICAL_SCROLLABLE;
        var height = void 0;
        if (isHorizontal) {
          height = this.calendarMonthGridHeight;
        } else if (this.isVertical() && !verticalScrollable && !withPortal) {
          // If the user doesn't set a desired height,
          // we default back to this kind of made-up value that generally looks good
          height = verticalHeight || 1.75 * calendarMonthWidth;
        }

        var isCalendarMonthGridAnimating = monthTransition !== null;

        var shouldFocusDate = !isCalendarMonthGridAnimating && isFocused;

        var keyboardShortcutButtonLocation = BOTTOM_RIGHT;
        if (this.isVertical()) {
          keyboardShortcutButtonLocation = withPortal ? TOP_LEFT : TOP_RIGHT;
        }

        var isHorizontalAndAnimating = isHorizontal && isCalendarMonthGridAnimating;

        var calendarInfoPositionTop = calendarInfoPosition === INFO_POSITION_TOP;
        var calendarInfoPositionBottom = calendarInfoPosition === INFO_POSITION_BOTTOM;
        var calendarInfoPositionBefore = calendarInfoPosition === INFO_POSITION_BEFORE;
        var calendarInfoPositionAfter = calendarInfoPosition === INFO_POSITION_AFTER;
        var calendarInfoIsInline = calendarInfoPositionBefore || calendarInfoPositionAfter;

        var calendarInfo = renderCalendarInfo && React.createElement(
          'div',
          _extends({
            ref: this.setCalendarInfoRef
          }, css(calendarInfoIsInline && styles.DayPicker_calendarInfo__horizontal)),
          renderCalendarInfo()
        );

        var calendarInfoPanelWidth = renderCalendarInfo && calendarInfoIsInline ? calendarInfoWidth : 0;

        var firstVisibleMonthIndex = this.getFirstVisibleIndex();
        var wrapperHorizontalWidth = calendarMonthWidth * numberOfMonths + 2 * DAY_PICKER_PADDING;
        // Adding `1px` because of whitespace between 2 inline-block
        var fullHorizontalWidth = wrapperHorizontalWidth + calendarInfoPanelWidth + 1;

        var transitionContainerStyle = {
          width: isHorizontal && wrapperHorizontalWidth,
          height: height
        };

        var dayPickerWrapperStyle = {
          width: isHorizontal && wrapperHorizontalWidth
        };

        var dayPickerStyle = {
          width: isHorizontal && fullHorizontalWidth,

          // These values are to center the datepicker (approximately) on the page
          marginLeft: isHorizontal && withPortal ? -fullHorizontalWidth / 2 : null,
          marginTop: isHorizontal && withPortal ? -calendarMonthWidth / 2 : null
        };

        return React.createElement(
          'div',
          _extends({
            role: 'application',
            'aria-label': phrases.calendarLabel
          }, css(styles.DayPicker, isHorizontal && styles.DayPicker__horizontal, verticalScrollable && styles.DayPicker__verticalScrollable, isHorizontal && withPortal && styles.DayPicker_portal__horizontal, this.isVertical() && withPortal && styles.DayPicker_portal__vertical, dayPickerStyle, !hasSetHeight && styles.DayPicker__hidden, !noBorder && styles.DayPicker__withBorder)),
          React.createElement(
            OutsideClickHandler,
            { onOutsideClick: onOutsideClick },
            (calendarInfoPositionTop || calendarInfoPositionBefore) && calendarInfo,
            React.createElement(
              'div',
              css(dayPickerWrapperStyle, calendarInfoIsInline && isHorizontal && styles.DayPicker_wrapper__horizontal),
              React.createElement(
                'div',
                _extends({}, css(styles.DayPicker_weekHeaders, isHorizontal && styles.DayPicker_weekHeaders__horizontal), {
                  'aria-hidden': 'true',
                  role: 'presentation'
                }),
                weekHeaders
              ),
              React.createElement(
                'div',
                _extends({}, css(styles.DayPicker_focusRegion), {
                  ref: this.setContainerRef,
                  onClick: function () {
                    function onClick(e) {
                      e.stopPropagation();
                    }

                    return onClick;
                  }(),
                  onKeyDown: this.onKeyDown,
                  onMouseUp: function () {
                    function onMouseUp() {
                      _this5.setState({ withMouseInteractions: true });
                    }

                    return onMouseUp;
                  }(),
                  role: 'region',
                  tabIndex: -1
                }),
                !verticalScrollable && this.renderNavigation(),
                React.createElement(
                  'div',
                  _extends({}, css(styles.DayPicker_transitionContainer, isHorizontalAndAnimating && styles.DayPicker_transitionContainer__horizontal, this.isVertical() && styles.DayPicker_transitionContainer__vertical, verticalScrollable && styles.DayPicker_transitionContainer__verticalScrollable, transitionContainerStyle), {
                    ref: this.setTransitionContainerRef
                  }),
                  React.createElement(CalendarMonthGrid, {
                    setMonthTitleHeight: !monthTitleHeight ? this.setMonthTitleHeight : undefined,
                    translationValue: translationValue,
                    enableOutsideDays: enableOutsideDays,
                    firstVisibleMonthIndex: firstVisibleMonthIndex,
                    initialMonth: currentMonth,
                    isAnimating: isCalendarMonthGridAnimating,
                    modifiers: modifiers,
                    orientation: orientation,
                    numberOfMonths: numberOfMonths * scrollableMonthMultiple,
                    onDayClick: onDayClick,
                    onDayMouseEnter: onDayMouseEnter,
                    onDayMouseLeave: onDayMouseLeave,
                    renderMonth: renderMonth,
                    renderCalendarDay: renderCalendarDay,
                    renderDayContents: renderDayContents,
                    onMonthTransitionEnd: this.updateStateAfterMonthTransition,
                    monthFormat: monthFormat,
                    daySize: daySize,
                    firstDayOfWeek: firstDayOfWeek,
                    isFocused: shouldFocusDate,
                    focusedDate: focusedDate,
                    phrases: phrases,
                    isRTL: isRTL,
                    dayAriaLabelFormat: dayAriaLabelFormat,
                    transitionDuration: transitionDuration,
                    verticalBorderSpacing: verticalBorderSpacing
                  }),
                  verticalScrollable && this.renderNavigation()
                ),
                child && child,
                !isTouch && !hideKeyboardShortcutsPanel && React.createElement(DayPickerKeyboardShortcuts, {
                  block: this.isVertical() && !withPortal,
                  buttonLocation: keyboardShortcutButtonLocation,
                  showKeyboardShortcutsPanel: showKeyboardShortcuts,
                  openKeyboardShortcutsPanel: this.openKeyboardShortcutsPanel,
                  closeKeyboardShortcutsPanel: this.closeKeyboardShortcutsPanel,
                  phrases: phrases
                })
              )
            ),
            (calendarInfoPositionBottom || calendarInfoPositionAfter) && calendarInfo
          )
        );
      }

      return render;
    }()
  }]);

  return DayPicker;
}(React.Component);

DayPicker.propTypes = propTypes;
DayPicker.defaultProps = defaultProps;

export { DayPicker as PureDayPicker };
export default withStyles(function (_ref) {
  var _ref$reactDates = _ref.reactDates,
      color = _ref$reactDates.color,
      font = _ref$reactDates.font,
      zIndex = _ref$reactDates.zIndex;
  return {
    DayPicker: {
      background: color.background,
      position: 'relative',
      textAlign: 'left'
    },

    DayPicker__horizontal: {
      background: color.background
    },

    DayPicker__verticalScrollable: {
      height: '100%'
    },

    DayPicker__hidden: {
      visibility: 'hidden'
    },

    DayPicker__withBorder: {
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.07)',
      borderRadius: 3
    },

    DayPicker_portal__horizontal: {
      boxShadow: 'none',
      position: 'absolute',
      left: '50%',
      top: '50%'
    },

    DayPicker_portal__vertical: {
      position: 'initial'
    },

    DayPicker_focusRegion: {
      outline: 'none'
    },

    DayPicker_calendarInfo__horizontal: {
      display: 'inline-block',
      verticalAlign: 'top'
    },

    DayPicker_wrapper__horizontal: {
      display: 'inline-block',
      verticalAlign: 'top'
    },

    DayPicker_weekHeaders: {
      position: 'relative'
    },

    DayPicker_weekHeaders__horizontal: {
      marginLeft: 9
    },

    DayPicker_weekHeader: {
      color: color.placeholderText,
      position: 'absolute',
      top: 62,
      zIndex: zIndex + 2,
      padding: '0 13px',
      textAlign: 'left'
    },

    DayPicker_weekHeader__vertical: {
      left: '50%'
    },

    DayPicker_weekHeader__verticalScrollable: {
      top: 0,
      display: 'table-row',
      borderBottom: '1px solid ' + String(color.core.border),
      background: color.background,
      marginLeft: 0,
      left: 0,
      width: '100%',
      textAlign: 'center'
    },

    DayPicker_weekHeader_ul: {
      listStyle: 'none',
      margin: '1px 0',
      paddingLeft: 0,
      paddingRight: 0,
      fontSize: font.size
    },

    DayPicker_weekHeader_li: {
      display: 'inline-block',
      textAlign: 'center'
    },

    DayPicker_transitionContainer: {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 3
    },

    DayPicker_transitionContainer__horizontal: {
      transition: 'height 0.2s ease-in-out'
    },

    DayPicker_transitionContainer__vertical: {
      width: '100%'
    },

    DayPicker_transitionContainer__verticalScrollable: {
      paddingTop: 20,
      height: '100%',
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      overflowY: 'scroll'
    }
  };
})(DayPicker);