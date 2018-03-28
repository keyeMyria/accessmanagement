import React from 'react';
import  {PieChart, Pie, Legend , Tooltip, Sector, Cell , Label} from 'recharts';
import { withStyles } from 'material-ui/styles';
import QueryBuilder from 'material-ui-icons/QueryBuilder';
import People from 'material-ui-icons/People'
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import _ from 'lodash';
import moment from 'moment'
import {observer} from 'mobx-react'
import EventStore from '../../mobx/eventstore';
import {Link} from 'react-router-dom';
import './vendor/dashboard.css';
import SwapHoriz from 'material-ui-icons/SwapHoriz';

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
const users=null ;

@observer
class DashboardUnit extends React.Component{

  getUsersStatistics =(users)=>{
    console.log(users.length)
    const in_guests = _.sumBy(users, i => (i.status==="IN"));
    const out_guests = _.sumBy(users, i => (i.status==="OUT"));
    const abscent_guests = _.sumBy(users, i => (i.status==="ABSCENT"));
    let data = [{name: 'indoor', value: in_guests}, {name: 'Abscent', value:  abscent_guests},
                  {name: 'outdoor', value:out_guests }]

                  return data ;
  }
  buildContentBasedOnData =(details , classes , name , users)=>{
                  const COLORS = ['#00abc7', '#686a77' , '#dcdcdc'];
                  let data;
                  if(details.stat=="OFF")
                   data = [
                     {name: 'indoor', value: details.closed_in},
                     {name: 'Abscent', value: details.closed_abscent},
                     {name: 'outdoor', value: details.closed_out}];
                  else
                    data= this.getUsersStatistics(users);
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
                    <Button fab  disabled><QueryBuilder color="action"/>
                    </Button>
                    <div className={classes.timeDetail}>
                      <span className={classes.timeDetailText}>
                      البداية
                      </span>
                      <span className={classes.timeDetailHour}>{moment(details.start_hour).utcOffset(1, true).format('hh:mm')}</span>
                    </div>
                    {(details.end_hour!=null)&&(
                      <div className={classes.timeDetail} style={{...styleEndTime}}>
                        <span className={classes.timeDetailText}>
                          النهاية
                        </span>
                        <span className={classes.timeDetailHour}>{moment(details.end_hour).utcOffset(1, true).format('hh:mm')}</span>
                    </div>)}
                  </div>
                      {
                        (details.users!=undefined)&&(<div  className={classes.ChartInfos}>
                      <Button fab  disabled>
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
      </div>)
  }

  render(){
    const {classes , details , key , users} = this.props;
        return(<div>{this.buildContentBasedOnData(details , classes ,details.name!=undefined ? details.name : "جلسة عامة", details.users)}</div>)


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
export default withStyles(styles)(DashboardUnit);
