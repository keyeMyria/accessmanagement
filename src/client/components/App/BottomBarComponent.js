import React from 'react';

import BottomNavigation , { BottomNavigationAction } from 'material-ui/BottomNavigation';
//import BottomNavigationAction from 'material-ui/BottomNavigation';
import RestoreIcon from 'material-ui-icons/Restore';
import FavoriteIcon from 'material-ui-icons/Favorite';
import LocationOnIcon from 'material-ui-icons/LocationOn';

import People from 'material-ui-icons/People';
import PhotoCamera from 'material-ui-icons/PhotoCamera';
import SwapHoriz from 'material-ui-icons/SwapHoriz';
import DonutLarge from 'material-ui-icons/DonutLarge';
import GroupWork from 'material-ui-icons/GroupWork';
import TransferWithinAStation from 'material-ui-icons/TransferWithinAStation'
import Toys from 'material-ui-icons/Toys';
import { withRouter } from 'react-router';

class BottomBarComponent extends React.Component{
  state = {
      value: 0,
    };

  handleChange = (event, value) => {
    this.props.history.push(value);
    this.setState({ value });
  };
  render(){
    const { value  } = this.state;
    const{authenticated , role}=this.props;
    if(authenticated){
      return(
        <BottomNavigation
        value={value}
        onChange={this.handleChange}
        showLabels
        >
        {(role=='agent_in' || role=='agent_out'|| role=='agent_workshop')&&(<BottomNavigationAction label="حالة الحضور" icon={<People />} value="/listattendies" />)}
        {(role=='agent_in' || role=='agent_out'|| role=='agent_workshop')&&(<BottomNavigationAction label="التقاط الرمز" icon={<PhotoCamera />} value="/agent"/>)}
        {(role=='agent_in' || role=='agent_out'|| role=='agent_workshop')&&(<BottomNavigationAction label="لوحة المراقبة" icon={<DonutSmall />} value="/dashboard"/>)}
        {(role=='agent_in' || role=='agent_out'|| role=='agent_workshop')&&(<BottomNavigationAction label="Operate on list" icon={<TransferWithinAStation />} value="/operateonguestlist"/>)}
        {((role=='admin')&&(this.props.addEventItems==true))&&(<BottomNavigationAction label="حالة الحضور" icon={<People />} value="/listguests" />)}
        {((role=='admin')&&(this.props.addEventItems==true))&&(<BottomNavigationAction label="التحركات" icon={<SwapHoriz />} value="/activitylog"/>)}
        {((role=='admin') &&(this.props.addEventItems==true))&&(<BottomNavigationAction label="لوحة المراقبة" icon={<DonutLarge />} value={`/event-dashboard/${this.props.eventid}`}/>)}
        {((role=='admin')&&(this.props.addEventItems==true))&&(<BottomNavigationAction label="الجلسات" icon={<GroupWork />} value="/activitylog"/>)}
      </BottomNavigation>
    )
    }
    return (<p style={{position:'fixed'}}>All rights reserved</p>)
  }
}
export default withRouter(BottomBarComponent);
