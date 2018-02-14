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
import Grid from 'material-ui/Grid';

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
  button: {
    margin:'8px',
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

});
const containers={
  container:{
    display: 'flex',
    justifyContent: 'center',
  },
  DetailContainer:{
    alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: '#fff',
     width: '90vw',
     maxWidth:'1200px',
     margin: '8px 16px',
     padding:'16px',
     boxShadow: '0 1px 4px 0 rgba(0,0,0,0.14)',
  },
   ChartContainer:{
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
    marginBottom: '24px',
  }
}
const styleEndTime = {
    borderRight: '1px solid #eee',
};

class WorkshopUnit extends React.Component{
  getUsersStatistics =(users)=>{
    const in_guests = _.sumBy(users, i => (i.status==="IN"));
    const out_guests = _.sumBy(users, i => (i.status==="OUT"));
    const abscent_guests = _.sumBy(users, i => (i.status==="ABSCENT"));
    const data = [{name: 'indoor', value: in_guests}, {name: 'Abscent', value: out_guests},
                  {name: 'outdoor', value: abscent_guests}]
                  return data ;
  }
  buildContentBasedOnData =(details , classes , name , users)=>{
                  const COLORS = ['#00abc7', '#686a77' , '#dcdcdc'];
                  let data =[]
                       data= this.getUsersStatistics(users)

                       let end ;
      if(details.session_list!=null){
          return(<div>{details.session_list.map(session=>(this.buildContentBasedOnData(session , classes , details.name!=undefined ? details.name : "جلسة عامة" , users)))}</div>)
      }else{
        let start = moment(moment(details.start_hour))
        if(details.end_hour!=null)
      {   end = moment(moment(details.end_hour))}
        else {
           end = moment(moment.now())
        }
        let difference = moment.duration(end.diff(start))
        return(
          <div style={containers.container}>
            <Grid container style={containers.DetailContainer} key={details._id}>
              <Grid item xs={12} sm={6} style={containers.ChartContainer}>
                <PieChart width={400} height={400}>
                  <Pie data={data} dataKey="value" nameKey="name"  cx="50%" cy="50%" innerRadius={126} outerRadius={130} label>
                    {
                      data.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]}/>)
                    }
                  </Pie>
                  <Pie data={data} cx="50%" cy="50%" innerRadius={90} outerRadius={115} fill="#00abc7" >
                    {
                      data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
                    }

                    <Label width={30} position="center"
                      content={<CustomLabel value2={`${difference._data.hours}h${difference._data.minutes}mn`} value1="الوقت المنقضي"/>}>
                    </Label>
                  </Pie>
                  <Tooltip/>
                </PieChart>
              </Grid>
              <Grid item xs={12} sm={6} style={containers.ChartContainer}>
                <div className={classes.cardInfos}>
                  <Typography className={classes.workshopName}>
                    {name}
                  </Typography>
                  <div style={containers.containerDetail}>
                    <Button fab="true" disabled><QueryBuilder color="action"/>
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
                      {(details.users!=undefined)&&(<div  style={containers.containerDetail}>
                      <Button fab="true" disabled>
                        <People color="action"/>
                      </Button>

                        <div className={classes.timeDetail}>
                          <span className={classes.timeDetailText}>
                          الحضور المتوقع
                          </span>
                        <span className={classes.timeDetailHour}>{details.users.length}</span>
                      </div>
                    </div>)}
                    <div><Link to={`/sessionactivity/${details._id}`}><Button raised="true" color="secondary" className={classes.button}><SwapHoriz  className={classes.leftIcon} />
                     الاطلاع على التحركات
                    </Button></Link>
                    <Link to={`/listusersbysession/${details._id}`}><Button raised="true" color="secondary" className={classes.button}><SwapHoriz  className={classes.leftIcon} />
                    حالة الحضور
                  </Button></Link></div>
                </div>
              </Grid>
        </Grid>
      </div>)
      }
  }

  render(){
    const {classes , details , key , users} = this.props;

    return(<div>{this.buildContentBasedOnData(details , classes ,details.name!=undefined ? details.name : "جلسة عامة", users)}</div>)
  }
}
function CustomLabel({viewBox, value1, value2}){
  const {cx, cy} = viewBox;
  return (
   <text x={cx} y={cy} className="recharts-text recharts-label" textAnchor="middle" dominantBaseline="central">
      <tspan x={cx} y={cy-13} fontSize="14" fill="#a0a0a0" >{value1}</tspan>
      <tspan x={cx} y={cy+12} fontSize="20" fill="#000000" font-family="Roboto">{value2}</tspan>
   </text>
  )
}
export default withStyles(styles)(WorkshopUnit);
