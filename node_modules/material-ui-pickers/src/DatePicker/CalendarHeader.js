import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, IconButton, Typography } from 'material-ui';
import * as defaultUtils from '../utils/utils';

export var CalendarHeader = function CalendarHeader(props) {
  var classes = props.classes,
      theme = props.theme,
      currentMonth = props.currentMonth,
      onMonthChange = props.onMonthChange,
      leftArrowIcon = props.leftArrowIcon,
      rightArrowIcon = props.rightArrowIcon,
      utils = props.utils;


  var rtl = theme.direction === 'rtl';

  var selectNextMonth = function selectNextMonth() {
    return onMonthChange(utils.getNextMonth(currentMonth));
  };
  var selectPreviousMonth = function selectPreviousMonth() {
    return onMonthChange(utils.getPreviousMonth(currentMonth));
  };

  return React.createElement(
    'div',
    null,
    React.createElement(
      'div',
      { className: classes.switchHeader },
      React.createElement(
        IconButton,
        { onClick: selectPreviousMonth },
        rtl ? rightArrowIcon : leftArrowIcon
      ),
      React.createElement(
        Typography,
        { type: 'body1' },
        utils.getCalendarHeaderText(currentMonth)
      ),
      React.createElement(
        IconButton,
        { onClick: selectNextMonth },
        rtl ? leftArrowIcon : rightArrowIcon
      )
    ),
    React.createElement(
      'div',
      { className: classes.daysHeader },
      utils.getWeekdays().map(function (day) {
        return React.createElement(
          Typography,
          {
            key: day,
            type: 'caption',
            className: classes.dayLabel
          },
          day
        );
      })
    )
  );
};

CalendarHeader.propTypes = {
  currentMonth: PropTypes.object.isRequired,
  onMonthChange: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  leftArrowIcon: PropTypes.node,
  rightArrowIcon: PropTypes.node,
  utils: PropTypes.object
};

CalendarHeader.defaultProps = {
  leftArrowIcon: 'keyboard_arrow_left',
  rightArrowIcon: 'keyboard_arrow_right',
  utils: defaultUtils
};

var styles = function styles(theme) {
  return {
    switchHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.unit
    },
    daysHeader: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    dayLabel: {
      width: 36,
      margin: '0 2px',
      textAlign: 'center',
      color: theme.palette.text.hint
    }
  };
};

export default withStyles(styles, { withTheme: true, name: 'MuiPickersCalendarHeader' })(CalendarHeader);