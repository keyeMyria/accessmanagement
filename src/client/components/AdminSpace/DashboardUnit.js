import React from 'react';
import  {PieChart, Pie, Legend , Tooltip, Sector, Cell , Label} from 'recharts';
import { withStyles } from 'material-ui/styles';
import QueryBuilder from 'material-ui-icons/QueryBuilder';
import People from 'material-ui-icons/People'
import Button from 'material-ui/Button';
import moment from 'moment'
const styles = theme => ({
  card: {
    backgroundColor : '#053787',
    color :'white'
  } ,
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },

  icon :{
    maxWidth :'50%'
  } ,
  sessionItem :{
    borderLeft : '8px solid #053787' ,
    paddingTop : '5px'
  } ,
  workshopItem:{
    borderLeft : '8px solid #FC4482' ,
    marginTop : '5px',
    minHeight : '80px'
  },
  sessionListWork:{
    paddingTop :'0px' ,
    paddingBottom : '0px',
    marginTop : '0px'
  },
  workshopsessionitem:{
    borderLeft : '8px solid #CECECE' ,
    backgroundColor :'#F5F5F5',
    minHeight : '30px',
    marginLeft : '30px'
  },
  AddingButton :{
    minHeight : '70px' ,
    margin : '10px',
    textTransform :'none' ,
    fontsize : '0.2em'
  },
  workshopform:{
    width : '100%'
  },
  userItem :{
    width : '50%' ,
    float : 'right'
  } ,

});
const containers={
  DetailContainer:{
    display: 'flex',
    flexDirection: 'row'
  },
  ChartContainer:{

  },
  smallFont :{
    fontSize: 'small',
    width : '100%' ,
    float : 'left'
  }
}
class DashboardUnit extends React.Component{

  render(){
    const {classes , details , key} = this.props;
    const data = [{name: 'indoor', value: 400}, {name: 'Abscent', value: 300},
                  {name: 'outdoor', value: 300}]
                  const COLORS = ['#93EB82', '#434348' , '#7EB6EA'];

                  let start = moment(moment(details.start_hour))
                  let end = moment(moment(details.end_hour))
                  let difference = moment.duration(end.diff(start))

    return(
      <div style={containers.DetailContainer} key={key}>
        <div className="ChartContainer">
          <PieChart width={400} height={400}>
          <Pie data={data} cx="50%" cy="50%" innerRadius={74} outerRadius={80} fill="#00ABC7" label >
            {
              data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
            }
            <Label value="Running Time" position="topcenter" className={classes.boldLabel}/>
            <Label value={`${difference._data.hours}h${difference._data.minutes}mn`} position="center" className={classes.raffined} />
          </Pie>
          <Pie data={data} cx="50%" cy="50%" innerRadius={45} outerRadius={60} fill="#00abc7" >
            {
              data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
            }
          </Pie>

          <Tooltip/>
        </PieChart>
      </div>
            <div><h3>Workshop Name</h3>
            <div style={containers.smallFont}>
              <Button fab disabled><QueryBuilder color="action"/>
              </Button>
              <span >Started At </span>
              <span>{moment(details.start_hour).utcOffset(1, true).format('hh:mm')}</span>
            </div>
              <div style={containers.smallFont}>

                <span>Ended At </span>
                <span>{moment(details.end_hour).utcOffset(1, true).format('hh:mm')}</span>
            </div>
            <div>
              <div  style={containers.smallFont}><Button fab disabled>
                <People color="action"/>
              </Button>
              <span>
                Expected Attendies 40</span>
              </div>
            </div>
      </div>
    </div>)
  }
}
export default withStyles(styles)(DashboardUnit);
