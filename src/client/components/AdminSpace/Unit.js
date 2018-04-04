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
import SessionStore from '../../mobx/sessionstore';
import {Link} from 'react-router-dom';
import './vendor/dashboard.css';
import SwapHoriz from 'material-ui-icons/SwapHoriz';
import { CircularProgress } from 'material-ui/Progress';

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
    fontBize: '18pt',
    fontWeight: '500',
    fontFamily: 'Roboto, arial, sans-serif',
  },
  DashboardContainer: {
    display: 'flex',
    justifyContent: 'center',
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
class Unit extends React.Component{
  constructor(props){
    super(props);
    props.SessionStore.setSessionId(props.details._id);
    props.SessionStore.subscribe(props.details._id)
    
  }
  getUsersStatistics =()=>{
    let in_length = this.props.SessionStore.sessions[this.props.details._id]["in"]["data"]["getSessionStats"];
    let out_length = this.props.SessionStore.sessions[this.props.details._id]["out"]["data"]["getSessionStats"];
    let abscent_length = this.props.SessionStore.sessions[this.props.details._id]["abscent"]["data"]["getSessionStats"];
    
    let data = [{name: 'indoor', value: in_length}, {name: 'Abscent', value:abscent_length},
                  {name: 'outdoor', value:out_length }]

                  return data ;
  }

  render(){
    const {classes , details ,name } = this.props;
    if(this.props.SessionStore.sessions[details._id]!=undefined){
        
            
            const COLORS = ['#00abc7', '#686a77' , '#dcdcdc'];
                  let data;
                  if(details.stat=="OFF")
                   data = [
                     {name: 'indoor', value: details.closed_in},
                     {name: 'Abscent', value: details.closed_abscent},
                     {name: 'outdoor', value: details.closed_out}];
                  else
                    data= this.getUsersStatistics();
                  let end ;
                  let start = moment(moment(details.start_hour))
        if(details.end_hour!=null)
      {   end = moment(moment(details.end_hour))}
        else {
           end = moment(moment.now())
        }
        let difference = moment.duration(end.diff(start))
        return(
          <div key={details._id} className={classes.DashboardContainer}>
          <div  className="ChartContainer">
            <div  className="PieContainer">
                <PieChart width={400} height={400}>
                  <Pie data={data} dataKey="value" nameKey="name"  cx="50%" cy="50%" innerRadius={126} outerRadius={130} label>
                    {
                      data.map((entry, index) => <Cell key={`first_pie_cell_key${index}`} fill={COLORS[index % COLORS.length]}/>)
                    }
                  </Pie>
                  <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={90} outerRadius={115} fill="#00abc7" >
                    {
                      data.map((entry, index) => <Cell key={`second_pie_cell_key${index}`} fill={COLORS[index % COLORS.length]}/>)
                    }

                    <Label width={30} position="center"
                      content={<CustomLabel value2={`${difference._data.hours}h${difference._data.minutes}mn`} value1="الوقت المنقضي"/>}>
                    </Label>
                  </Pie>
                  <Tooltip/>
                </PieChart>
              </div>
              <div className="ChartInfosContainer">
                <div className={classes.cardInfos}>
                  <Typography className={classes.workshopName}>
                    {name}
                  </Typography>
                  <div className={classes.ChartInfos}>
                    <Button  fab={true}   disabled><QueryBuilder color="action"/>
                    </Button>
                    <div className={classes.timeDetail}>
                      <span className={classes.timeDetailText}>
                      البداية
                      </span>
                      <span className={classes.timeDetailHour}>{moment(details.start_hour).utcOffset(1, true).format('HH:mm')}</span>
                    </div>
                    {(details.end_hour!=null)&&(
                      <div className={classes.timeDetail} style={{...styleEndTime}}>
                        <span className={classes.timeDetailText}>
                          النهاية
                        </span>
                        <span className={classes.timeDetailHour}>{moment(details.end_hour).utcOffset(1, true).format('HH:mm')}</span>
                    </div>)}
                  </div>
                      {
                        (details.users!=undefined)&&(<div  className={classes.ChartInfos}>
                      <Button  fab={true}   disabled>
                        <People color="action"/>
                      </Button>

                        <div className={classes.timeDetail}>
                        <span className={classes.timeDetailText}>
                        الحضور المتوقع
                        </span>
                        <span className={classes.timeDetailHour}>{details.expected_guests}</span>
                      </div>
                    </div>)
                  }
                  <div><Link to={`/sessionactivity/${details._id}`}><Button  raised="true"color="secondary" className={classes.button}><SwapHoriz  className={classes.leftIcon} />
                   الاطلاع على التحركات
                  </Button></Link>
                  <Link to={`/listusersbysession/${details._id}`}><Button  raised="true"color="secondary" className={classes.button}><SwapHoriz  className={classes.leftIcon} />
                  حالة الحضور
                </Button></Link></div>
                </div>
              </div>
        </div>
      </div>)}
    else{
      return(	<div>
        <CircularProgress color="primary" />
      </div>)
    }

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
export default withStyles(styles)(Unit);
