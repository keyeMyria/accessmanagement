import React from 'react';
import {observer} from 'mobx-react';
import WorkshopStore from '../../mobx/workshopstore';
import  {PieChart, Pie, Legend , Tooltip, Sector, Cell , Label} from 'recharts';
import { withStyles } from 'material-ui/styles';
import QueryBuilder from 'material-ui-icons/QueryBuilder';
import People from 'material-ui-icons/People'
import Button from 'material-ui/Button';
import { CircularProgress } from 'material-ui/Progress';
import moment from 'moment'

const styles ={
  boldLabel :{
    fontSize : '0.8em'
  },
  raffined :{
    fontSize : '0.6em',

  },
  AddingButton :{
    minHeight : '30px' ,
    margin : '10px',
    textTransform :'none' ,
    fontsize : '0.2em',
    backgroundColor:'#E0E0E0'
  },
}
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
    const data = [{name: 'indoor', value: in_guests}, {name: 'Abscent', value: out_guests},
                  {name: 'outdoor', value: abscent_guests}]
                  return data ;
  }
  buildDashboard=(users  , session , workshop)=>{
    console.log(users)
    const {classes}=this.props
      const COLORS = ['#93EB82', '#434348' , '#7EB6EA'];
    let data = this.getUsersStatistics(users);

    let start = moment(moment(session.start_hour))
    let end = moment(moment.now())
    let difference = moment.duration(end.diff(start))
    return(
      <div>
      <PieChart width={400} height={400}>
        <Pie data={data} cx="50%" cy="50%" innerRadius={74} outerRadius={80} fill="#00ABC7" label>
          {
            data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
          }
          <Label value="Running Time" position="topcenter" className={classes.boldLabel}/>
          <Label value={`${difference._data.hours}h${difference._data.minutes}mn`} position="center" className={classes.raffined} />
        </Pie>
        <Pie data={data} cx="50%" cy="50%" innerRadius={45} outerRadius={60} fill="#00abc7">
          {
            data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
          }
        </Pie>

        <Tooltip/>
      </PieChart>
      <h3>{workshop!=null?workshop.name:"Session Générale"}</h3>
      <Button fab disabled><QueryBuilder color="action"/></Button><span>Started At </span><span>{moment(session.start_hour).utcOffset(1, true).format('hh:mm')}</span>
      <Button fab disabled><People color="action"/></Button><span>Expected Attendies {users.length}</span>
      <div>
        <Button className={classes.AddingButton}>
        Attendies Status
      </Button>
      <Button className={classes.AddingButton}>
      Operations
    </Button></div>
    </div>)
  }
  render(){

    if(WorkshopStore.selectedWorkshop!=null && WorkshopStore.selectedWorkshop.session!=undefined){
      return(<div>{this.buildDashboard(WorkshopStore.users , WorkshopStore.selectedWorkshop.session , WorkshopStore.selectedWorkshop)}</div>)

    }else{
      if(WorkshopStore.agent_session!=null){
        return(<div>{this.buildDashboard(WorkshopStore.users , WorkshopStore.agent_session , null)}</div>)
      }
      else{
        return(<div className={classes.root}>You haven't been affected to any workshop</div>)
      }
    }


  }
}

export default withStyles(styles)(AgentDashboard);
