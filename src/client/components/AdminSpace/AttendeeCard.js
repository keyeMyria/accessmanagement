/* eslint-disable flowtype/require-valid-file-annotation */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import './vendor/testlist.css';
import classnames from 'classnames';
import Card, {
  CardHeader,
  CardMedia,
  CardContent,
  CardActions
} from 'material-ui/Card';
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
import List, {
  ListItem,
  ListItemSecondaryAction,
  ListItemText
} from 'material-ui/List';
import { Link } from 'react-router-dom';
import Noavatar from '../App/defaultAvatar.svg';
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from 'material-ui/ExpansionPanel';
import { REMOTE_ASSETS_PATH } from '../../app/config';

const styles = theme => ({
  container: {
    maxWidth: '1200px',
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '10px'
  },
  profil: {
    display: 'flex'
  },
  nameStatu: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  button: {
    margin: theme.spacing.unit
  },
  numbersButton: {
    fontFamily: 'Roboto',
    margin: theme.spacing.unit
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
  expandedPanelContainer: {
    alignItems: 'flex-end'
  }
});

const avatarExpansion = {
  width: '50px',
  height: '50px',
  marginLeft: '10px'
};
const ExpansionContainer = {
  width: '100%',
  textAlign: 'right'
};
const subheading = {
  color: '#8c8c8c'
};
class AttendeeCard extends React.Component {
  state = { expanded: false };

  handleExpandClick = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  convertCanvasToImage = canvas => {
    var image = new Image();
    image.src = canvas.toDataURL('image/png');
    return image;
  };
  render() {
    const { classes, data } = this.props;
    return (
        <div className="container_ui__item">
          <div className="face">
            {data.profile.avatar !== '' ? (
              <img
                id={`avatar_${data.identifiant}`}
                src={`${REMOTE_ASSETS_PATH}/${data.profile.avatar}`}
              />
            ) : (
              <Noavatar />
            )}
            <canvas height={0} width={0} id={`canvas_${data.identifiant}`} />
          </div>

          <div className={'itemInfosResponsive'}>
            <h2>
              {data.profile.name} {data.profile.forname}
            </h2>
            {
              // <h3> {data.identifiant} </h3>
            }
            <h3>
              {data.status == 'ABSCENT' && 'غائب (ة)'}
              {data.status == 'IN' && 'حاضر (ة) داخل القاعة'}
              {data.status == 'OUT' && 'غادر (ة) القاعة'}
            </h3>
          </div>
          <div className="itemActions">
            <Button disabled className={classes.phoneNbr}>
              <Phone />
              <p className={classes.phoneNbrText}>{data.profile.tel}</p>
            </Button>
            <Link to={`/useractivity/${data._id}`}>
              <Button color="secondary">
                <SwapHoriz />
                الاطلاع على التحركات
              </Button>
            </Link>
          </div>
        </div>
    );
  }
}

export default withStyles(styles)(AttendeeCard);
