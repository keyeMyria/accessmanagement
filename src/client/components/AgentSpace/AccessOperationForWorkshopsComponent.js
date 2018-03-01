import React from 'react' ;
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Paper from 'material-ui/Paper';
import Snackbar, { SnackbarContent } from 'material-ui/Snackbar';
import Badge from 'material-ui/Badge';
import Button from 'material-ui/Button';
import DeleteIcon from 'material-ui-icons/Delete';
import Tooltip from 'material-ui/Tooltip';
import NotificationsActive from 'material-ui-icons/NotificationsActive';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import { compose } from 'react-apollo';
import classNames from 'classnames';
import Avatar from 'material-ui/Avatar';

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
  },
  tooltip:{
    'max-width' :"200px"
  },
  bigAvatar: {
    width: '40%',
    height: '40%',
    'max-width': '300px',
    margin: '30px 0',
  },
  verfEnter:{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    'padding-top': '50px',
  },
  button:{
    color: '#fff',
    'fontSize': '32px',
    width: '60%',
    lineHeight: '3em',
    'max-width': '550px',
    marginBottom: '20px',
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
class AccessOperationForWorkshopsComponent extends React.Component{
  constructor(props){
    super(props)
      this.state = {
            open: false,
            displayed :false
          };
  }


    handleClick = () => {
      this.setState({ open: true });
    };

    handleRequestClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }

      this.setState({ open: false });
    };

  componentDidUpdate(props){
    if(this.props.userToEnter.hasOwnProperty('userId')&&this.props.userToEnter.userId.status=='IN' && this.state.open==false && this.state.displayed==false){
      this.setState({
        open:true ,
        displayed : true
      })
    }
  }
  handleClick = () => {
  };

  handleIconButtonRequestClose = () => {
  this.setState({ open: false });
};

handleIconButtonRequestOpen = () => {
  this.setState({ open: true });
};
  handleEnter = async () => {
    let id = this.props.match.params.id ;
    let status = "IN";
    let agent = localStorage.getItem('loogedin_id');
    await this.props.updateUserStatus({
    variables: {
      id ,
      status,
      agent

    }
  }).then(res=>{
    this.props.history.push('/agent');
  })
}
handleExit = async () => {
  let id = this.props.match.params.id ;
  let status = "OUT";
  let agent = localStorage.getItem('loogedin_id');
  await this.props.updateUserStatus({
  variables: {
    id ,
    status,
    agent

  }
}).then(res=>{
  this.props.history.push('/agent');
})
}
  render(){
    const {userToEnter , classes} = this.props;
    if(this.props.userToEnter.loading==true)
      return(<div className={classes.root}><CircularProgress  color="secondary"   /></div>);
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
      return(<div>
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
            <div className={classNames(classes.verfEnter)}>
                <Avatar
                  alt="radhoin benhaj"
                  src={`../assets/avatars/${this.props.userToEnter.userId.profile.avatar}`}
                  className={classNames(classes.bigAvatar)}
                />
                <span className={classNames(classes.styleCommun , classes.profileName)}>
                {this.props.userToEnter.userId.profile.name} {this.props.userToEnter.userId.profile.forname}</span>
                <span className={classNames(classes.styleCommun , classes.profileFunction)}>
                {this.props.userToEnter.userId.profile.function} </span>
                <Button className={classes.button}  raised="true"color="primary" onClick={this.handleEnter}>
                       دخول
                </Button>
                <Button className={classes.button}  raised="true"color="primary" onClick={this.handleExit}>
                     خروج
                </Button>
                <span className={classNames(classes.styleCommun , classes.profileCin)}>
                {this.props.userToEnter.userId.cin}  </span>
                <div style={{ display: 'flex', width: '90%', 'justifyContent': 'space-between', fontSize:'18px', 'height': '50px', marginTop:'115px'}}>
                  <div style={{ display: 'flex', flexDirection:'column'}}>
                      <span style={{ color: '#9E9E9E', }}> بطاقة تعريف وطنية </span>
                      <span> {this.props.userToEnter.userId.cin} </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection:'column'}}>
                      <span style={{ color: '#9E9E9E', }}> المعرف </span>
                      <span>{this.props.userToEnter.userId.identifiant}</span>
                  </div>
                </div>
            </div>
      </div>)
    }

  }
}
const userToEnter = gql`
  query userToEnter($id: ID!) {
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
const AccessOperationForWorkshopsComponentWithData =  compose(
  graphql(userToEnter, {
    name : 'userToEnter' ,
    options: (props) => ({ variables: { id: props.match.params.id }})
  }),
  graphql(updateUserStatus, {
    name: 'updateUserStatus'
  })
)(AccessOperationForWorkshopsComponent)

export default withStyles(styles)(AccessOperationForWorkshopsComponentWithData);
