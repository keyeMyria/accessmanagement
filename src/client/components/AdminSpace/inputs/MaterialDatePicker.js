import React, { Fragment, Component } from 'react';
import { observer } from 'mobx-react';
import { IconButton, Typography, withStyles } from 'material-ui';
import classNames from 'classnames';
import { DateTimePicker, DatePicker } from 'material-ui-pickers';
import PropTypes from 'prop-types';
import KeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft';
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight';
import InsertInvitation from 'material-ui-icons/InsertInvitation';
import AccessTime from 'material-ui-icons/AccessTime';
// styles
const $input = 'input-reset ba b--black-10 br1 pa2 mb2 db w-100 f6';
const $label = 'f7 db mb2 mt3 light-silver';
const $small = 'f6 black-60 db red';
const onChange = field => (e, k, payload) => {
  field.set('value', e._d); // not sure about this
  field.validate();
};
export default observer(({ field, type = 'text',minDate,value,disablePast, placeholder = null ,onChange}) => (
    <MaterialDatePickerWidget
      {...field.bind({ type, placeholder })}
        name ={field.name}
       minDate={minDate}
       value={value}
       disablePast={disablePast}
       onChange = {onChange}
   />
));
class MaterialDatePicker extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  state = {
    selectedDate: new Date(),
  }
  handleDateChange = (date) => {
    this.setState({ selectedDate: date });
     this.props.onChange(date);
  }

  handleWeekChange = (date) => {
    this.setState({ selectedDate: date.clone().startOf('week') });
  }

  formatWeekSelectLabel = (date, invalidLabel) => {
    if (date === null) {
      return '';
    }

    return date && date.isValid() ?
      `Week of ${date.clone().startOf('week').format('MMM Do')}`
      :
      invalidLabel;
  }

  renderCustomDayForDateTime = (date, selectedDate, dayInCurrentMonth, dayComponent) => {
    const { classes } = this.props;

    const dayClassName = classNames({
      [classes.customDayHighlight]: date.isSame(selectedDate, 'day'),
    });

    return (
      <div className={classes.dayWrapper}>
        {dayComponent}
        <div className={dayClassName} />
      </div>
    );
  }

  renderWrappedDefaultDay = (date, selectedDate, dayInCurrentMonth) => {
    const { classes } = this.props;

    const startDate = selectedDate.clone().day(0).startOf('day');
    const endDate = selectedDate.clone().day(6).endOf('day');

    const dayIsBetween = (
      date.isSame(startDate) ||
      date.isSame(endDate) ||
      (date.isAfter(startDate) && date.isBefore(endDate))
    );

    const firstDay = date.isSame(startDate, 'day');
    const lastDay = date.isSame(endDate, 'day');

    const wrapperClassName = classNames({
      [classes.highlight]: dayIsBetween,
      [classes.firstHighlight]: firstDay,
      [classes.endHighlight]: lastDay,
    });

    const dayClassName = classNames(classes.day, {
      [classes.nonCurrentMonthDay]: !dayInCurrentMonth,
      [classes.highlightNonCurrentMonthDay]: !dayInCurrentMonth && dayIsBetween,
    });

    return (
      <div className={wrapperClassName}>
        <IconButton className={dayClassName}>
          <span> { date.format('DD')} </span>
        </IconButton>
      </div>
    );
  }

  render() {
    const { selectedDate } = this.state;
    const {name , minDate} = this.props;
    return (
      <Fragment>
        <div className="picker">
        <DateTimePicker
          autoSubmit={false}
          value={this.props.value}
          disablePast={this.props.disablePast}
          minDate={this.props.minDate}
          name={name}
          onChange={this.handleDateChange}
          renderDay={this.renderCustomDayForDateTime}
          leftArrowIcon= {<KeyboardArrowLeft />}
          rightArrowIcon ={<KeyboardArrowRight />}
          dateRangeIcon ={<InsertInvitation />}
          timeIcon={<AccessTime />}
        />
        </div>
      </Fragment>
    );
  }
}

const styles = theme => ({
  dayWrapper: {
    position: 'relative',
  },
  day: {
    width: 36,
    height: 36,
    fontSize: theme.typography.caption.fontSize,
    margin: '0 2px',
    color: 'inherit',
  },
  customDayHighlight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '2px',
    right: '2px',
    border: `2px solid ${theme.palette.primary[100]}`,
    borderRadius: '50%',
  },
  nonCurrentMonthDay: {
    color: theme.palette.common.minBlack,
  },
  highlightNonCurrentMonthDay: {
    color: '#676767',
  },
  highlight: {
    background: theme.palette.primary[500],
    color: theme.palette.common.white,
  },
  firstHighlight: {
    extend: 'highlight',
    borderTopLeftRadius: '50%',
    borderBottomLeftRadius: '50%',
  },
  endHighlight: {
    extend: 'highlight',
    borderTopRightRadius: '50%',
    borderBottomRightRadius: '50%',
  },
});
export const MaterialDatePickerWidget = withStyles(styles)(MaterialDatePicker);
