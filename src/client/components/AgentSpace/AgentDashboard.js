import React from 'react';
import {observer} from 'mobx-react';
import WorkshopStore from '../../mobx/workshopstore';
import  {PieChart, Pie, Legend , Tooltip, Sector, Cell , Label} from 'recharts';
import { withStyles } from 'material-ui/styles';
import QueryBuilder from 'material-ui-icons/QueryBuilder';
import People from 'material-ui-icons/People';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { CircularProgress } from 'material-ui/Progress';
import moment from 'moment';
import {Link} from 'react-router-dom';
import SwapHoriz from 'material-ui-icons/SwapHoriz';
import '../AdminSpace/vendor/dashboard.css';
import Unit from '../AdminSpace/Unit';
import DashboardUnit from '../AdminSpace/DashboardUnit';

const styles = theme => ({
  cardInfos:{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  button:{
    margin : '8px' ,
  },
  workshopName: {
   color: '#013084',
   fontSize: '2rem',
   fontFamily: 'Changa',
   fontWeight: '300',
   marginBottom: '24px',
  },
  timeDetail:{
    display: 'flex',
    alignItems: 'flex-start',
    paddingLeft: '10px',
    flexDirection: 'column',
    marginLeft: '10px',
  },
  timeDetailText:{
    color: '#959595',
    marginBottom: '5px',
  },
  timeDetailHour: {
    fontSize: '18pt',
    fontWeight: '500',
    fontFamily: 'Roboto, arial, sans-serif',
  },
  DashboardContainer: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '70px',
  },
  ChartInfos :{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px',
  },
});

const styleEndTime = {
    borderRight: '1px solid #eee',
};
@observer
class AgentDashboard extends React.Component{
  constructor(props){
    super(props)
    let id = localStorage.getItem('loogedin_id');
    WorkshopStore.fetchWorkshopDataForAgent(id);

  }
  render(){
    if(WorkshopStore.selectedWorkshop!=null && WorkshopStore.selectedWorkshop.session!=undefined){
      if(!WorkshopStore.selectedWorkshop.session_empty){
        let session = WorkshopStore.getActiveSession(WorkshopStore.selectedWorkshop.workshop.session_list);
        return(<Unit details={session} name={WorkshopStore.selectedWorkshop.name} users={WorkshopStore.selectedWorkshop.guests_number} />);

      }
          else{
        return(<div>You're not allowed to access this ...No Session is active yet</div>)

      }
    }else{
      if(WorkshopStore.agent_session!=null){
        if(WorkshopStore.agent_session.stat=="ON")
        return(<DashboardUnit key={WorkshopStore.agent_session._id} details={WorkshopStore.agent_session} />);

       else{
          return(<div>You're not allowed to access this ...No Session is active yet</div>)
        }
      }
      else{
        return(<div className={classes.root}>You haven't been affected to any workshop</div>)
      }
    }


  }
}function CustomLabel({viewBox, value1, value2}){
  const {cx, cy} = viewBox;
  return (
   <text x={cx} y={cy} className="recharts-text recharts-label"  textAnchor="middle" dominantBaseline="central">
      <tspan x={cx} y={cy-13} fontSize="14" fill="#a0a0a0" >{value1}</tspan>
      <tspan x={cx} y={cy+12} fontSize="20" fill="#000000" fontFamily="Roboto">{value2}</tspan>
   </text>
  )
}

export default withStyles(styles)(AgentDashboard);
