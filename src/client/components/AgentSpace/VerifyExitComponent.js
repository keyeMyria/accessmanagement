import React from 'react' ;
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Paper from 'material-ui/Paper';
import {SnackbarContent } from 'material-ui/Snackbar';
import Badge from 'material-ui/Badge';
import Tooltip from 'material-ui/Tooltip';
import NotificationsActive from 'material-ui-icons/NotificationsActive';
import Button from 'material-ui/Button';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import { compose } from 'react-apollo';
import classNames from 'classnames';
import Avatar from 'material-ui/Avatar';
import {observer} from 'mobx-react';
import UserStore from '../../mobx/gueststore';
import {REMOTE_ASSETS_PATH} from '../../app/config'

const styles = theme => ({
  root: {
    width: '100%',
    background: theme.palette.background.paper,
  },
  progressCircle:{
    margin: '16px 0 0 0',
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
  },
  tooltip:{
    'max-width' :"200px"
  },
  bigAvatar: {
    width: 220,
    height: 220,
    maxWidth:'220px',
    margin: '30px 0',
  },
  button:{
    color: '#fff',
    fontSize: '32px',
    width: '240px',
    lineHeight: '3em',
    maxWidth: '550px',
  },
  styleCommun:{
    'margin-bottom':'20px',
    'font-family': 'Cairo',
  },
  profileName:{
    'font-size': '30px',
    color: '#212121',
  },
  profileFunction:{
    'font-size': '24px',
    color: '#757575',

  },
  profileCin:{
    'font-size': '18px',
    color: '#212121',
  },
});
const role = localStorage.getItem('role');
const id = localStorage.getItem('loogedin_id');

@observer
class VerifyExitComponent extends React.Component{
  constructor(props){
    super(props)
    this.state = {
        open: false,
        displayed :false
      };
    UserStore.fetchGuestForAgentWorkshop(id);

  }
  handleRequestClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ open: false });
  };
  ComponentWillMount=()=>{
    UserStore.fetchGuestForAgentWorkshop(id);

  }
  componentDidUpdate(props){
    if(this.props.userToEnter.userId.status=='OUT' && this.state.open==false &&this.state.displayed==false){
      this.setState({
        open:true ,
        displayed : true
      })
    }
  }
  handleClick = () => {
    this.setState({ open: true });
  };

    handleIconButtonRequestClose = () => {
    this.setState({ open: false });
  };

  handleIconButtonRequestOpen = () => {
    this.setState({ open: true });
  };
  handleEnter = async () => {
    // let id = this.props.match.params.id ;
    let id = this.props.userToEnter.userId._id;

    let status = "OUT";
    let agent = localStorage.getItem('loogedin_id');

          await UserStore.alterGuestStatus(id , status , agent)
          // .then(res=>{
            this.props.history.push('/agent');
          // });
  //   await this.props.updateUserStatus({
  //   variables: {
  //     id ,
  //     status,
  //     agent
  //
  //   }
  // }).then(res=>{
  //   this.props.history.push('/agent');
  // })
}
  render(){
    const {userToEnter , classes} = this.props;
    if(this.props.userToEnter.loading==true)
      return(<div className={classes.root}><CircularProgress  color="primary" className={classes.progressCircle}/></div>);
    if(userToEnter.userId==null){
        return(
          <SnackbarContent
         className={classes.snackbar}
         message={
           'The QRcode of this person is unknown. \
           Please contact an orgonizer before allowing the passage'
         }

       />
        );
    }
    else{
      const { vertical, horizontal, open } = this.state;
      const {classes} = this.props;
      return(
        <div>
        {open && (<Snackbar
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    open={this.state.open}
                    autoHideDuration={6000}
                    onRequestClose={this.handleRequestClose}
                    SnackbarContentProps={{
                      'aria-describedby': 'message-id',
                    }}
                    message={<p id="message-id">Please ask this person to respect the procedure of scanning his/her badge at every passage</p>}
                    action={[
                      <IconButton
                        key="close"
                        aria-label="Close"
                        color="inherit"
                        className={classes.close}
                        onClick={this.handleRequestClose}
                      >
                        <CloseIcon />
                      </IconButton>
                    ]}
                  />
        )}
        <div className="verf">
          <div className="profileGuest">
            <Avatar
            alt=""
            src={`${REMOTE_ASSETS_PATH}/${this.props.userToEnter.userId.profile.avatar}`}
            className={classNames(classes.bigAvatar)}
            />
            <span className={classNames(classes.styleCommun , classes.profileName)}>
            {this.props.userToEnter.userId.profile.name} {this.props.userToEnter.userId.profile.forname}</span>
            <span className={classNames(classes.styleCommun , classes.profileFunction)}>
            {this.props.userToEnter.userId.profile.function}
            </span>
          </div>
          <Button className={classes.button} raised="true" color="secondary" onClick={this.handleEnter}>
              خروج
          </Button>
            <div className="containerIdentifiant">
              <div className="infoIdentifiant">
                  <span className="labelIdentifiant"> بطاقة تعريف وطنية </span>
                  <span className="cin"> {this.props.userToEnter.userId.cin} </span>
              </div>
              <div className="infoIdentifiant">
                  <span className="labelIdentifiant"> المعرف </span>
                  <span className="id">{this.props.userToEnter.userId.identifiant}</span>
              </div>
              </div>
            </div>
      </div>
    )}

  }
}
const userToEnter = gql`
  query userToEnter($id: String!) {
    userId(id :$id) {
      username
      status
      identifiant
      cin
      profile{
        name
        forname
        avatar
        tel
        function
        region
        gouvernorat

      }
    }
  }
`;
const updateUserStatus = gql`
mutation updateUserStatus($id: ID! , $status:String! , $agent : String!)  {
  updateUserStatus(id: $id , status :$status, agent:$agent) {
    id
  }
}
`
const VerifyExitComponentWithData =  compose(
  graphql(userToEnter, {
    name : 'userToEnter' ,
    options: (props) => ({ variables: { id: props.match.params.id }})
  }),
  graphql(updateUserStatus, {
    name: 'updateUserStatus'
  })
)(VerifyExitComponent)

export default withStyles(styles)(VerifyExitComponentWithData);
