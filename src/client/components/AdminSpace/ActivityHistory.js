import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import  { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';

import DirectionsRun from 'material-ui-icons/DirectionsRun';
import Checkbox from 'material-ui/Checkbox';
import Avatar from 'material-ui/Avatar';
import { LinearProgress } from 'material-ui/Progress';
import injectTapEventPlugin from 'react-tap-event-plugin'

import {InfiniteLoader,AutoSizer,List} from "react-virtualized"
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
    fill :"red",
  }
});



//injectTapEventPlugin()

let virtualizingList = []

 class ActivityHistory  extends React.Component{
   constructor(props)
  {
    super(props)
      const {loadMoreRows,mainQuery} = this.props
      this._isRowLoaded = this._isRowLoaded.bind(this)
      this._rowRenderer = this._rowRenderer.bind(this)
      this._noRowsRenderer = this._noRowsRenderer.bind(this)
  }
/******************************************************************************************************************
*  Used in InfiniteLoader to track the loaded state of each row.
******************************************************************************************************************/
  _isRowLoaded ({ index }) {
       return !!virtualizingList[index];
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
                                  <Avatar alt="" src={`public/assets/avatars/${content.user.profile.avatar}`} />
                                  <ListItemText secondary={`${dateFormat(content.dateEntry , 'hh:mm:ss')}`} />
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
    const {loadMoreRows,mainQuery , classes} = this.props
        virtualizingList = mainQuery.edges

		return (
            <div>
               <InfiniteLoader
                   isRowLoaded={this._isRowLoaded}
                   loadMoreRows={loadMoreRows}
                   rowCount={mainQuery.totalCount}
                   >
                   {({ onRowsRendered, registerChild }) => (

                        <div style={{ height: 'calc(100vh - 64px)', width: '100vw'}}>
                            <AutoSizer>
                            {({ height, width }) => (
                                 <List
                                 height={height}
                                 onRowsRendered={onRowsRendered}
                                 noRowsRenderer={this._noRowsRenderer}
                                 ref={registerChild}
                                 rowCount={mainQuery.totalCount}
                                 rowHeight={60}
                                 rowRenderer={this._rowRenderer}
                                 width={width}
                                 overscanRowCount={0}
                                 />
                            )}
                            </AutoSizer>
                        </div>
                   )}
       </InfiniteLoader>
			</div>
		);
	}
  }
//const ActivityHistoryWithData = graphql(historylist)(ActivityHistory);
export default withStyles(styles)(ActivityHistory);
