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
    let workshop_fetched = WorkshopStore.fetchWorkshopDataForAgent(id);

  }
  getUsersStatistics =(users)=>{
    const in_guests = _.sumBy(users, i => (i.status==="IN"));
    const out_guests = _.sumBy(users, i => (i.status==="OUT"));
    const abscent_guests = _.sumBy(users, i => (i.status==="ABSCENT"));
    const data = [{name: 'indoor', value: in_guests}, {name: 'Abscent', value: out_guests},
                  {name: 'outdoor', value: abscent_guests}]
                  return data ;
  }
  render(){

    const {classes}=this.props
    if(WorkshopStore.selectedWorkshop.session!=null && WorkshopStore.selectedWorkshop.session!=undefined){
      const COLORS = ['#93EB82', '#434348' , '#7EB6EA'];
      let data = this.getUsersStatistics(WorkshopStore.selectedWorkshop.workshop.users);

      let start = moment(moment(WorkshopStore.selectedWorkshop.session.start_hour))
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
        <h3>{WorkshopStore.selectedWorkshop.workshop.name}</h3>
        <Button fab disabled><QueryBuilder color="action"/></Button><span>Started At </span><span>{moment(WorkshopStore.selectedWorkshop.session.start_hour).utcOffset(1, true).format('hh:mm')}</span>
        <Button fab disabled><People color="action"/></Button><span>Expected Attendies {WorkshopStore.selectedWorkshop.workshop.users.length}</span>
        <div>
          <Button className={classes.AddingButton}>
          Attendies Status
        </Button>
        <Button className={classes.AddingButton}>
        Operations
      </Button></div>
      </div>)
    }

    else{
      return(<div className={classes.root}><CircularProgress color="accent" /></div>)
    }
  }
}

export default withStyles(styles)(AgentDashboard);
