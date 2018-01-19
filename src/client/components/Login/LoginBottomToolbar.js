import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import BottomNavigation, { BottomNavigationButton } from 'material-ui/BottomNavigation';
import People from 'material-ui-icons/People';
import SwapHoriz from 'material-ui-icons/SwapHoriz';

const styles = {
  root: {
    width: 500,
  },
};

class LoginBottomToolbar extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <BottomNavigation
        value={value}
        onChange={this.handleChange}
        showLabels
      >
        <BottomNavigationButton label="Attendies Status" icon={<People />} />
        <BottomNavigationButton label="Activity" icon={<SwapHoriz />} />
      </BottomNavigation>
    );
  }
}

LoginBottomToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LoginBottomToolbar);
