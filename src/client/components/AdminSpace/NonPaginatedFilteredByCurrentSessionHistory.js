import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import  { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';

import DirectionsRun from 'material-ui-icons/DirectionsRun';
import Checkbox from 'material-ui/Checkbox';
import Avatar from 'material-ui/Avatar';
import { LinearProgress } from 'material-ui/Progress';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import dateFormat from 'dateformat';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';

import Divider from 'material-ui/Divider';
const styles = theme => ({
  root: {
    width: '100%',
    background: theme.palette.background.paper,
  },
  IN:{
    fill :"#00B0FF",
    '-webkit-transform': 'rotateY(180deg)',
    '-moz-transform': 'rotateY(180deg)',
    '-ms-transform': 'rotateY(180deg)',
    '-o-transform': 'rotateY(180deg)',
    'transform': 'rotateY(180deg)',

  },
  OUT:{
    fill :"#ef4035",
  }
});



//injectTapEventPlugin()

let virtualizingList = []

 class NonPaginatedFilteredByCurrentSessionHistory  extends React.Component{
   constructor(props)
  {
    super(props)

  }

/******************************************************************************************************************
*  Used in List to render each row.
******************************************************************************************************************/
  _rowRenderer({ key, index, style}) {
       let content
       let rendered_content
       if (index<virtualizingList.length) {

           content = virtualizingList[index].node
           rendered_content = <div key={`item_${content.entryId}`  }><ListItem key={content.entryId} dense>
                                  <Avatar alt="" src={`../assets/avatars/${content.user.profile.avatar}`} />
                                  <ListItemText secondary={`${dateFormat(content.dateEntry , 'HH:mm:ss')}`} />
                                  <ListItemText primary={`${content.user.profile.name} ${content.user.profile.forname}`} />
                                  <ListItemText secondary={`${content.action=="IN" ? "joined" : "left"} the conference`  }/>
                                  {content.agent &&(<ListItemText secondary={`Registered By ${content.agent.username}`  }/>)}
                                  <DirectionsRun className={style[content.action]}/>
                                </ListItem>
                                <Divider inset/> </div>
       }
       else {
           rendered_content = '';
       }

       return (
         rendered_content
        );


   }
/******************************************************************************************************************
*  When no rows are returned
******************************************************************************************************************/
   _noRowsRenderer(){
       return (
         <div>
           <Paper elevation={4}>
             <Typography type="body1" component="h3">
               No Activity registered yet
             </Typography>
             <Typography type="subheader" component="p">
               You will see the entry and exit of the participants once the agents register them
             </Typography>
           </Paper>
         </div>
       );
   }
  render(){
    const {loadMoreRows , classes} = this.props

		return (
            <div>
              toot
			      </div>
		);
	}
  }
  const listentriesbyactivesession = gql`
      query activitylistbycurrentsession{
        entryId
        start_hour
        end_hour

      }
  `
const ActivityHistoryWithData = graphql(listentriesbyactivesession)(NonPaginatedFilteredByCurrentSessionHistory);
export default withStyles(styles)(ActivityHistoryWithData);
