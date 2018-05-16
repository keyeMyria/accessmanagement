import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem } from 'material-ui/List';
import DirectionsRun from 'material-ui-icons/DirectionsRun';
import Search from 'material-ui-icons/Search';
import IconButton from 'material-ui/IconButton';
import Checkbox from 'material-ui/Checkbox';
import Avatar from 'material-ui/Avatar';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { red, lightblue } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Input, { InputAdornment } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import Card, {
  CardHeader,
  CardMedia,
  CardContent,
  CardActions
} from 'material-ui/Card';
import Collapse from 'material-ui/transitions/Collapse';
import AttendeeCard from './AttendeeCard';
import { CircularProgress } from 'material-ui/Progress';
import { PieChart, Pie, Legend, Tooltip, Sector, Cell } from 'recharts';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import GuestCardToManage from './GuestCardToManage';
import EmptyAttendeesStatusIcon from '../App/EmptyAttenteesStatus.svg';
import Fade from 'material-ui/transitions/Fade';
import Slide from 'material-ui/transitions/Slide';
import { withLastLocation } from 'react-router-last-location';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: '1200px',
    margin: 'auto'
  },
  formControl: {
    width: '100%',
    padding: '16px'
  },
  IN: {
    fill: '#00abc7',
    '-webkit-transform': 'rotateY(180deg)',
    '-moz-transform': 'rotateY(180deg)',
    '-ms-transform': 'rotateY(180deg)',
    '-o-transform': 'rotateY(180deg)',
    transform: 'rotateY(180deg)'
  },
  OUT: {
    fill: '#ef4035'
  },
  containerGuest: {
    padding: '0 16px',
    height: 'calc(100vh - 209px)',
    maxWidth: '1200px'
  },
  container_ui: {
    width: '100%'
  },
  progressCircle: {
    margin: '16px 0'
  },
  fakeContainerGuest: {
    background: '#f9f9f9',
    maxWidth: '1200px',
    margin: '0 16px',
    overflow: 'hidden'
  },
  fakeContainer_ui: {
    display: 'flex',
    padding: '16px',
    borderBottom: '1px solid #eee'
  },
  fakeAvatar: {
    width: '72px',
    height: '72px',
    background: '#eee',
    borderRadius: '50%',
    marginRight: '16px'
  },
  fakeText: {
    display: 'block',
    width: 'calc(100% - 216px)'
  },
  fakeHeading: {
    height: '26px',
    width: '25vw',
    background: '#eee',
    margin: '10px 0',
    borderRadius: '13px'
  },
  fakeSecondaryText: {
    height: '16px',
    width: '10vw',
    background: '#eee',
    borderRadius: '8px'
  },
  fakeButton: {
    height: '16px',
    width: '50px',
    background: '#eee',
    borderRadius: '8px',
    marginLeft: '8px',
    alignSelf: 'flex-end'
  }
});

class AttendiesList extends React.Component {
  state = {
    checked: [1],
    total: 0,
    in_attendies: 0,
    out_attendies: 0,
    present_precent: 0,
    attendies_list: [],
    unfiltered_list: []
  };
  componentWillReceiveProps(newProps) {
    if (newProps.data.guestusers) {
      let out = newProps.data.guestusers.filter(user => user.status == 'IN');
      this.setState({
        attendies_list: newProps.data.guestusers,
        unfiltered_list: newProps.data.guestusers,
        total: newProps.data.guestusers.length,
        in_attendies: out.length,
        out_attendies:
          (newProps.data.guestusers.length - out.length) /
          newProps.data.guestusers.length *
          100,
        present_precent: out.length / newProps.data.guestusers.length * 100
      });
    }
  }
  handleToggle = value => () => {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked
    });
  };
  filterList = event => {
    var updatedList = this.state.attendies_list;
    if (event.target.value == '') {
      updatedList = this.state.unfiltered_list;
    } else {
      updatedList = updatedList.filter(function(item) {
        return (
          item.profile.name
            .toLowerCase()
            .search(event.target.value.toLowerCase()) !== -1 ||
          item.profile.forname
            .toLowerCase()
            .search(event.target.value.toLowerCase()) !== -1
        );
      });
    }

    this.setState({ attendies_list: updatedList });
  };
  render() {
    const { classes } = this.props;

    let slideDirection = "left";
    if(this.props.lastLocation!=null){
      switch(this.props.lastLocation.pathname){
        case '/':
        slideDirection = "down";
        break;
      }
    }


    if (this.props.data.loading == true)
      return (
        <div className={classes.root}>
          <CircularProgress
            color="primary"
            className={classes.progressCircle}
          />
          <Slide direction={slideDirection} in={true} timeout="600">
            <div
              className="fakeContainerGuest"
              className={classes.fakeContainerGuest}>
              <div
                className="fakeContainer_ui"
                className={classes.fakeContainer_ui}>
                <div className="fakeAvatar" className={classes.fakeAvatar} />
                <div className="fakeText" className={classes.fakeText}>
                  <div className="fakeHeading" className={classes.fakeHeading} />
                  <div
                    className="fakeSecondaryText"
                    className={classes.fakeSecondaryText}
                  />
                </div>
                <div className="fakeButton" className={classes.fakeButton} />
                <div className="fakeButton" className={classes.fakeButton} />
              </div>
              <div
                className="fakeContainer_ui"
                className={classes.fakeContainer_ui}>
                <div className="fakeAvatar" className={classes.fakeAvatar} />
                <div className="fakeText" className={classes.fakeText}>
                  <div className="fakeHeading" className={classes.fakeHeading} />
                  <div
                    className="fakeSecondaryText"
                    className={classes.fakeSecondaryText}
                  />
                </div>
                <div className="fakeButton" className={classes.fakeButton} />
                <div className="fakeButton" className={classes.fakeButton} />
              </div>
              <div
                className="fakeContainer_ui"
                className={classes.fakeContainer_ui}>
                <div className="fakeAvatar" className={classes.fakeAvatar} />
                <div className="fakeText" className={classes.fakeText}>
                  <div className="fakeHeading" className={classes.fakeHeading} />
                  <div
                    className="fakeSecondaryText"
                    className={classes.fakeSecondaryText}
                  />
                </div>
                <div className="fakeButton" className={classes.fakeButton} />
                <div className="fakeButton" className={classes.fakeButton} />
              </div>
            </div>
          </Slide>
        </div>
      );
    else if (
      this.props.data.guestusers == null ||
      Object.keys(this.props.data.guestusers).length === 0
    ) {
      return (
        <Slide direction={slideDirection} in={true} timeout="600">
          <div className={classes.root} className="emptyStatus">
            <div className="emptyStatusIcon">
              <EmptyAttendeesStatusIcon />
            </div>
            <h3 className="emptyStatusTitle">لا يوجد مشاركين في هذا الحدث</h3>
            <p className="emptyStatusDesciption">
              Edit this event and upload a file with your guest list.
            </p>
          </div>
        </Slide>
      );
    } else {
      const data = [
        { name: 'indoor', value: this.state.present_precent },
        { name: 'outdoor', value: this.state.out_attendies }
      ];

      const COLORS = ['#00ABC7', '#cccccc'];

      return (
        <Slide direction={slideDirection} in={true} timeout="600">
          <div className={classes.root}>
            <FormControl className={classes.formControl}>
              <Input
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton>
                      <Search />
                    </IconButton>
                  </InputAdornment>
                }
                className={classes.search}
                placeholder="Search Attendies"
                onChange={this.filterList}
              />
            </FormControl>
            <Fade in={true}>
              <div className="containerGuest" className={classes.containerGuest}>
                <div className="container_ui" className={classes.container_ui}>
                  {this.state.attendies_list.map(value => (
                    <GuestCardToManage
                      key={value._id}
                      data={value}
                      readonly={true}
                    />
                  ))}
                </div>
              </div>
            </Fade>
          </div>
        </Slide>
      );
    }
  }
}

AttendiesList.propTypes = {
  classes: PropTypes.object.isRequired
};
const guestlist = gql`
  query guestlist {
    guestusers {
      _id
      username
      status
      profile {
        name
        forname
        avatar
        tel
      }
    }
  }
`;

const AttendeesWithData = graphql(guestlist)(AttendiesList);
const fromWithStyles = withStyles(styles)(AttendeesWithData);
export default withLastLocation(fromWithStyles);
