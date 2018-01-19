import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import BottomNavigation, { BottomNavigationButton } from 'material-ui/BottomNavigation';
import People from 'material-ui-icons/People';
import PhotoCamera from 'material-ui-icons/PhotoCamera';
import {Link} from 'react-router-dom';
import Tabs, { Tab } from 'material-ui/Tabs';

import QReaderComponent from './QReaderComponent';
import Attendies from './Attendies';


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
    color:'white'
  }
});

class AgentBottomToolbar extends React.Component {
  state = {
    value: 1,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div>
        {value === 0 && <TabContainer><Attendies/></TabContainer>}
        {value === 1 && <TabContainer><QReaderComponent/></TabContainer>}
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
                    <Tab label="Capture Code" icon={<PhotoCamera />} />

                  </Tabs>
                </BottomNavigation>

</div>
    );
  }
}

AgentBottomToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AgentBottomToolbar);
