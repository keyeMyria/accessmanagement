/* eslint-disable flowtype/require-valid-file-annotation */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';
import Card, { CardHeader, CardMedia, CardContent, CardActions } from 'material-ui/Card';
import Collapse from 'material-ui/transitions/Collapse';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import red from 'material-ui/colors/red';
import FavoriteIcon from 'material-ui-icons/Favorite';
import ShareIcon from 'material-ui-icons/Share';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import Phone from 'material-ui-icons/Phone';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import Button from 'material-ui/Button';
import SwapHoriz from 'material-ui-icons/SwapHoriz';
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import {Link} from 'react-router-dom';
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';
import {REMOTE_ASSETS_PATH} from '../../app/config'

const styles = theme => ({
  card: {
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  button: {
    margin: theme.spacing.unit,
  },
  numbersButton: {
    fontFamily: 'Roboto',
    margin: theme.spacing.unit,
  },
  leftIcon: {
   marginRight: theme.spacing.unit,
 },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  expandedPanelContainer:{
    alignItems: 'flex-end',
  },
});

const avatarExpansion={
  width: '50px',
  height: '50px',
  marginLeft: '10px',
};
const ExpansionContainer={
  width: '100%',
  textAlign: 'right',
};
const subheading={
color: '#8c8c8c',
}
class AttendeeCard extends React.Component {
  state = { expanded: false };

  handleExpandClick = () => {
    this.setState({ expanded: !this.state.expanded });
  };

 convertCanvasToImage =(canvas)=>{
	   var image = new Image();
	   image.src = canvas.toDataURL("image/png");
	   return image;
}
  render() {
    const { classes , data} = this.props;
    return (
      <div>
        <ExpansionPanel className={classes.expandedPanelContainer}>
        {data.profile!=null &&( <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}  style={ExpansionContainer}>
          <Avatar src={`${REMOTE_ASSETS_PATH}/${data.profile.avatar}`} style={avatarExpansion}/>

            <div>
              <Typography type="title" gutterBottom>
                {data.profile.name} {data.profile.forname}
              </Typography>
              <Typography type="subheading" gutterBottom style={subheading}>
                { data.status == 'ABSCENT'&& 'غائب (ة)'}
                { data.status == 'IN' && 'حاضر (ة) داخل القاعة'}
                { data.status == 'OUT' && 'غادر (ة) القاعة'}
              </Typography>
            </div>
          </ExpansionPanelSummary>)}
          {data.profile!=null &&(<ExpansionPanelDetails>
          <div>
            <Button  raised="true"className={classes.numbersButton}  disabled >
              <Phone  className={classes.leftIcon} />
              {data.profile.tel}
            </Button>
            <Link to={`/useractivity/${data._id}`}>
              <Button  raised="true"color="secondary" ><SwapHoriz  className={classes.leftIcon} />
               الاطلاع على التحركات
              </Button>
            </Link>
          </div>
          </ExpansionPanelDetails>)}
        </ExpansionPanel>
      </div>
    );
  }
}

AttendeeCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AttendeeCard);
