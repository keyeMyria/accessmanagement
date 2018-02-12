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

import SwapHoriz from 'material-ui-icons/SwapHoriz';
const styles = theme => ({
  cardInfos:{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  card: {
    backgroundColor : '#053787',
    color :'white'
  } ,
  //appBar: {
  //  position: 'relative',
  //},
  //flex: {
  //  flex: 1,
  //},

  //icon :{
  //  maxWidth :'50%'
  //} ,
  //sessionItem :{
  //  borderLeft : '8px solid #053787' ,
  //  paddingTop : '5px'
  //} ,
  //workshopItem:{
  //  borderLeft : '8px solid #FC4482' ,
  //  marginTop : '5px',
  //  minHeight : '80px'
  //},
  //sessionListWork:{
  //  paddingTop :'0px' ,
  //  paddingBottom : '0px',
  //  marginTop : '0px'
  //},
  //workshopsessionitem:{
  //  borderLeft : '8px solid #CECECE' ,
  //  backgroundColor :'#F5F5F5',
  //  minHeight : '30px',
  //  marginLeft : '30px'
  //},
  //AddingButton :{
  //  minHeight : '70px' ,
  //  margin : '10px',
  //  textTransform :'none' ,
  //  fontsize : '0.2em'
  //},
  userItem :{
    width : '50%' ,
    float : 'right'
  } ,
  workshopName:{
   color:'#013084',
   fontSize: '2rem',
   fontFamily: 'Changa',
   fontWeight: '300',
   marginBottom:'24px',
 },
  timeDetail:{
    display: 'flex',
    paddingLeft: '10px',
    flexDirection: 'column',
    marginLeft: '10px',
  },
  timeDetailText:{
    color: 'gray',
    marginBottom: '5px',
  },
  timeDetailHour:{
    fontSize: '21pt',
    fontweight: 'bold',
    fontFamily: 'Roboto, arial, sans-serif',
  },

});
const containers={
  container:{
    display: 'flex',
    justifyContent: 'center',
  },
  DetailContainer:{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: '#fff',
     width: '70vw',
     marginBottom: '20px',
     width: '90vw',
     maxWidth:'1200px',
     margin: '8px 16px',
     boxShadow: '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
  },
   ChartContainer:{
     width: '50%',
      display: 'flex',
      justifyContent: 'center',
   },
  containerDetail :{
    // fontSize: 'small',
    // width : '100%' ,
    // float : 'left'
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '10px',
  }
}
const styleEndTime = {
    borderRight: '1px solid #eee',
};
const users=null ;

@observer
class DashboardUnit extends React.Component{

  getUsersStatistics =(users)=>{
    const in_guests = _.sumBy(users, i => (i.status==="IN"));
    const out_guests = _.sumBy(users, i => (i.status==="OUT"));
    const abscent_guests = _.sumBy(users, i => (i.status==="ABSCENT"));
    let data = [{name: 'indoor', value: in_guests}, {name: 'Abscent', value: out_guests},
                  {name: 'outdoor', value: abscent_guests}]

                  return data ;
  }
  buildContentBasedOnData =(details , classes , name , users)=>{
                  const COLORS = ['#93EB82', '#434348' , '#7EB6EA'];
                  let data= this.getUsersStatistics(users);
                  let end ;
                  let start = moment(moment(details.start_hour))
        if(details.end_hour!=null)
      {   end = moment(moment(details.end_hour))}
        else {
           end = moment(moment.now())
        }
        let difference = moment.duration(end.diff(start))
        return(
          <div style={containers.container}>
          <div style={containers.DetailContainer} key={details._id}>
            <div style={containers.ChartContainer}>
                <PieChart width={400} height={400}>
                  <Pie data={data} dataKey="value" nameKey="name"  cx="50%" cy="50%" innerRadius={100} outerRadius={110} fill="#00ABC7" label >
                    {
                      data.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]}/>)
                    }

                    <Label width={30} position="center"
                      content={<CustomLabel value2={`${difference._data.hours}h${difference._data.minutes}mn`} value1="Running Time"/>}>
                    </Label>
                  </Pie>
                  <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={90} fill="#00abc7" >
                    {
                      data.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]}/>)
                    }
                  </Pie>
                  <Tooltip/>
                </PieChart>
              </div>
              <div style={containers.ChartContainer}>
                <div className={classes.cardInfos}>
                  <Typography className={classes.workshopName}>
                    {name}
                  </Typography>
                  <div style={containers.containerDetail}>
                    <Button fab disabled><QueryBuilder color="action"/>
                    </Button>
                    <div className={classes.timeDetail}>
                      <span className={classes.timeDetailText}>Started At </span>
                      <span className={classes.timeDetailHour}>{moment(details.start_hour).utcOffset(1, true).format('hh:mm')}</span>
                    </div>
                    {(details.end_hour!=null)&&(
                      <div className={classes.timeDetail} style={{...styleEndTime}}>
                        <span className={classes.timeDetailText}>Ended At </span>
                        <span className={classes.timeDetailHour}>{moment(details.end_hour).utcOffset(1, true).format('hh:mm')}</span>
                    </div>)}
                  </div>
                      {
                        (details.users!=undefined)&&(<div  style={containers.containerDetail}>
                      <Button fab disabled>
                        <People color="action"/>
                      </Button>

                        <div className={classes.timeDetail}>
                        <span className={classes.timeDetailText}>Attendies </span>
                        <span className={classes.timeDetailHour}>{details.users.length}</span>
                      </div>
                    </div>)
                  }
                  <div><Link to={`/sessionactivity/${details._id}`}><Button raised color="secondary" ><SwapHoriz  className={classes.leftIcon} />
                   الاطلاع على التحركات
                  </Button></Link>
                  <Link to={`/listusersbysession/${details._id}`}><Button raised color="secondary" ><SwapHoriz  className={classes.leftIcon} />
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
   <text x={cx} y={cy} fill="#3d405c" className="recharts-text recharts-label" textAnchor="middle" dominantBaseline="central">
      <tspan alignmentBaseline="middle" fontSize="14">{value1}</tspan>
      <tspan  x={cx+15} y={cy+20}   fontSize="20">{value2}</tspan>
   </text>
  )
}
export default withStyles(styles)(DashboardUnit);
