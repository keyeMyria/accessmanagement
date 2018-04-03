import React from 'react';
import  {PieChart, Pie, Legend , Tooltip, Sector, Cell , Label} from 'recharts';
import { withStyles } from 'material-ui/styles';
import QueryBuilder from 'material-ui-icons/QueryBuilder';
import People from 'material-ui-icons/People'
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import _ from 'lodash';
import moment from 'moment'
import {observer , inject} from 'mobx-react'
import EventStore from '../../mobx/eventstore';
import {Link} from 'react-router-dom';
import SwapHoriz from 'material-ui-icons/SwapHoriz';
import './vendor/dashboard.css';
import Unit from './Unit'
import SessionStore from '../../mobx/sessionstore';
const styles = theme => ({
  cardInfos:{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  card:{
    backgroundColor : '#053787',
    color :'white'
  },
  button: {
    margin:'8px',
  },
  userItem :{
    width : '50%' ,
    float : 'right'
  } ,
  DashboardContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  workshopName:{
   color:'#013084',
   fontSize: '2rem',
   fontFamily: 'Changa',
   fontWeight: '300',
   marginBottom:'24px',
 },
  timeDetail:{
    display: 'flex',
    alignItems:'flex-start',
    paddingLeft: '10px',
    flexDirection: 'column',
    marginLeft: '10px',
  },
  timeDetailText:{
    color: '#959595',
    marginBottom: '5px',
  },
  timeDetailHour:{
    fontSize: '18pt',
    fontWeight: '500',
    fontFamily: 'Roboto, arial, sans-serif',
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

@inject('SessionStore')
@observer
class WorkshopUnit extends React.Component{
  constructor(props){
    super(props);
    
  }
 
  buildContentBasedOnData =(details , classes , name )=>{
     
      if(details.session_list!=null){
          return(<div>{details.session_list.map(session=>(this.buildContentBasedOnData(session , classes , details.name)))}</div>)
      }else{
        return(
          <div key={`work_${details._id}`} className={classes.DashboardContainer}>
            <Unit details={details} name={name} />
      </div>)
      }
  }

  render(){
    const {classes , details , key } = this.props;
    return(<div key={details._id}>{this.buildContentBasedOnData(details , classes ,details.name)}</div>)
  }
}
function CustomLabel({viewBox, value1, value2}){
  const {cx, cy} = viewBox;
  return (
   <text x={cx} y={cy} className="recharts-text recharts-label" textAnchor="middle" dominantBaseline="central">
      <tspan x={cx} y={cy-13} fontSize="14" fill="#a0a0a0" >{value1}</tspan>
      <tspan x={cx} y={cy+12} fontSize="20" fill="#000000" fontFamily="Roboto">{value2}</tspan>
   </text>
  )
}
export default withStyles(styles)(WorkshopUnit);
