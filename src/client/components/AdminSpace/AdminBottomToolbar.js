import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import BottomNavigation, { BottomNavigationButton } from 'material-ui/BottomNavigation';
import People from 'material-ui-icons/People';
import SwapHoriz from 'material-ui-icons/SwapHoriz';
import {Link} from 'react-router-dom';
import Tabs, { Tab } from 'material-ui/Tabs';
import AttendiesList from './AttendiesList';
import ActivityHistory from './ActivityHistory';

function TabContainer(props) {
  return <div style={{ padding: 8 * 3 }}>{props.children}</div>;
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    backgroundColor: theme.palette.background.paper,
  },
});

class AdminBottomToolbar extends React.Component {
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
      <div>
        {value === 0 && <TabContainer><AttendiesList/></TabContainer>}
        {value === 1 && <TabContainer><ActivityHistory/></TabContainer>}
      <BottomNavigation
        value={value}
        onChange={this.handleChange}
        className={classes.root}
      >
        <Tabs
                    value={value}
                    onChange={this.handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                  >
                    <Tab label="Attendies Status" icon={<People />} />
                    <Tab label="Activity" icon={<SwapHoriz />} />

                  </Tabs>
                </BottomNavigation>

</div>
    );
  }
}

AdminBottomToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AdminBottomToolbar);
