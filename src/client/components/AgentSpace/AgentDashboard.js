import React from 'react';
import {observer} from 'mobx-react';
import WorkshopStore from '../../mobx/workshopstore';
import  {PieChart, Pie, Legend , Tooltip, Sector, Cell , Label} from 'recharts';
import { withStyles } from 'material-ui/styles';
import QueryBuilder from 'material-ui-icons/QueryBuilder';
import People from 'material-ui-icons/People'
import Button from 'material-ui/Button';

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
  render(){
    const data = [{name: 'indoor', value: 400}, {name: 'Abscent', value: 300},
                  {name: 'outdoor', value: 300}]
                  const COLORS = ['#93EB82', '#434348' , '#7EB6EA'];
    const {classes}=this.props

    return(
      <div>
      <PieChart width={400} height={400}>
        <Pie data={data} cx="50%" cy="50%" innerRadius={74} outerRadius={80} fill="#00ABC7" label>
          {
            data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
          }
          <Label value="Running Time" position="topcenter" className={classes.boldLabel}/>
          <Label value="1h43mn" position="center" className={classes.raffined} />
        </Pie>
        <Pie data={data} cx="50%" cy="50%" innerRadius={45} outerRadius={60} fill="#00abc7">
          {
            data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
          }
        </Pie>

        <Tooltip/>
      </PieChart>
      <h3>Workshop Name</h3>
      <Button fab disabled><QueryBuilder color="action"/></Button><span>Started At 14h08mn</span>
      <Button fab disabled><People color="action"/></Button><span>Expected Attendies 40</span>
      <div>
        <Button className={classes.AddingButton}>
        Attendies Status
      </Button>
      <Button className={classes.AddingButton}>
      Operations
    </Button></div>
    </div>)
  }
}

export default withStyles(styles)(AgentDashboard);
