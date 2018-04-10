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
import '../AdminSpace/vendor/dashboard.css';
import {Link} from 'react-router-dom';
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
  getUsersStatistics =(users)=>{


    const in_guests = _.sumBy(users, i => (i.status==="IN"));
    const out_guests = _.sumBy(users, i => (i.status==="OUT"));
    const abscent_guests = _.sumBy(users, i => (i.status==="ABSCENT"));
    const data = [
                  {name: 'داخل الجلسة', value: in_guests},
                  {name: 'غائب', value: out_guests},
                  {name: 'خارج الجلسة', value: abscent_guests}]
                  return data ;
  }
  buildDashboard=(users  , session , workshop)=>{
    console.log(users)
    const {classes}=this.props
      const COLORS = ['#00abc7', '#686a77' , '#dcdcdc'];
    let data = this.getUsersStatistics(users);

    let start = moment(moment(session.start_hour))
    let end = moment(moment.now())
    let difference = moment.duration(end.diff(start))
    return(
    <div className={classes.DashboardContainer}>
      <div className="ChartContainer">
        <div  className="PieContainer">
            <PieChart width={400} height={350}>
              <Pie data={data} cx="50%" cy="50%" innerRadius={126} outerRadius={130} label>
                {
                  data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
                }
              </Pie>
              <Pie data={data} cx="50%" cy="50%" innerRadius={90} outerRadius={115} fill="#00abc7">
                {
                  data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
                }
                <Label width={30} position="center"
                  content={<CustomLabel value1={`الوقت المنقضي`}/>}>
                </Label>
                <Label width={30} position="center"
                  content={<CustomLabel value2={`${difference._data.hours} س ${difference._data.minutes} دق `}/>}>
                </Label>
              </Pie>
              <Tooltip/>
            </PieChart>
            <div className="containerLegand">
              <div className="subContaineLegand">
                <p>غائب</p>
                <div className="legandChart abscent"></div>
              </div>
              <div className="subContaineLegand">
                <p> داخل القاعة </p>
                <div  className="legandChart in"></div>
              </div>
              <div className="subContaineLegand">
                <p> غادر القاعة </p>
                <div  className="legandChart out"></div>
               </div>
            </div>
          </div>
        <div className="ChartInfosContainer">
          <div className={classes.cardInfos}>
            <Typography className={classes.workshopName}>
              {name}
            </Typography>
            <div className={classes.ChartInfos}>
              <Button   variant="fab"    disabled><QueryBuilder color="action"/>
              </Button>
              <div className={classes.timeDetail}>
                <span className={classes.timeDetailText}>
                البداية
                </span>
                <span className={classes.timeDetailHour}>{moment(session.start_hour).utcOffset(1, true).format('HH:mm')}</span>
              </div>
              {(session.end_hour!=null)&&(
                <div className={classes.timeDetail} style={{...styleEndTime}}>
                  <span className={classes.timeDetailText}>
                    النهاية
                  </span>
                  <span className={classes.timeDetailHour}>{moment(session.end_hour).utcOffset(1, true).format('HH:mm')}</span>
              </div>)}
            </div>
                {
                  (users!=undefined)&&(<div  className={classes.ChartInfos}>
                <Button   variant="fab"    disabled>
                  <People color="action"/>
                </Button>

                  <div className={classes.timeDetail}>
                  <span className={classes.timeDetailText}>
                  الحضور المتوقع
                  </span>
                  <span className={classes.timeDetailHour}>{users.length}</span>
                </div>
              </div>)
            }
            <div><Link to={`/sessionactivity/${session._id}`}><Button  raised="true"color="secondary" className={classes.button}><SwapHoriz  className={classes.leftIcon} />
             الاطلاع على التحركات
            </Button></Link>
            <Link to={`/listusersbysession/${session._id}`}><Button  raised="true"color="secondary" className={classes.button}><SwapHoriz  className={classes.leftIcon} />
            حالة الحضور
          </Button></Link></div>
          </div>
          </div>
        </div>
    </div>)
  }
  render(){
    if(WorkshopStore.selectedWorkshop!=null && WorkshopStore.selectedWorkshop.session!=undefined){
      if(!WorkshopStore.selectedWorkshop.session_empty)
      return(<div>{this.buildDashboard(WorkshopStore.users , WorkshopStore.selectedWorkshop.session , WorkshopStore.selectedWorkshop)}</div>)
      else{
        return(<div>You're not allowed to access this ...No Session is active yet</div>)

      }
    }else{
      if(WorkshopStore.agent_session!=null){
        if(WorkshopStore.agent_session.stat=="ON")
        return(<div>{this.buildDashboard(WorkshopStore.users , WorkshopStore.agent_session , null)}</div>)
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
      <tspan x={cx} y={cy+12} fontSize="20" fill="#000000" font-family="Roboto">{value2}</tspan>
   </text>
  )
}

export default withStyles(styles)(AgentDashboard);
