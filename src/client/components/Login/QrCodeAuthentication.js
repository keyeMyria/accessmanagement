import React from 'react';
import UserStore from '../../mobx/gueststore';
import {observer} from 'mobx-react';
import {withStyles} from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';
import LoginForm from './LoginForm';
import { withRouter } from 'react-router';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from 'react-redux';
import { signIn , setrole } from '../../actions';

const styles = {
  row: {
    display: 'flex',
    justifyContent: 'center',
  },
  avatar: {
    margin: 10,
  },
  bigAvatar: {
    width: 170 ,
    height: 170
  },
  container:{

      backgroundColor: '#013084',
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'absolute',
      alignItems: 'center',
      overflow: 'hidden',
      zIndex: '-1',
      minHeight: '600px',
  } ,
  infoLogin :{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      justifyContent: 'center',
      alignContent: 'center',
  }
};
@observer
class QrCodeAuthentication extends React.Component{
  constructor(props){
    super(props);
    this.state={
      errors:[]
    }
    UserStore.getUserByID(props.match.params.id);
  }
  handleSubmit(values) {
    this.props.mutate({ variables: values })
      .then((response) => {
        console.log(response)
        if (!response.data.hasOwnProperty('errors')) {

          this.props.signInDispatcher(response.data.signIn.token , response.data.signIn.user._id);
          this.props.setRoleDispatcher(response.data.signIn.user.role.name);
          if(response.data.signIn.user.role.name=="agent_in" || response.data.signIn.user.role.name=="agent_out" || response.data.signIn.user.role.name=="agent_workshop")
            this.props.history.push('/agent');
          if(response.data.signIn.user.role.name=="admin")
            this.props.history.push('/listguests');
        } else {
          console.log(response.data.errors)
          this.setState({
            errors: response.data.signIn.errors
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
  render(){
    const { classes } = this.props;
    const user = UserStore.selectedUser;
    if(user.profile!=undefined){
      return(
        <div className={classes.container}>
          <div className={classes.infoLogin}>
            <Avatar
             src={`/public/assets/avatars/${user.profile.avatar}`}
             className={classes.bigAvatar}
           />
           <h3>Identified As</h3>
           <p>{user.profile.forname} {user.profile.name}</p>
           <LoginForm
             onSubmit={this.handleSubmit.bind(this)}
             errors={this.state.errors}
             username={user.username}
             user={null}
           />
         </div>

       </div>)
    }
    else{
      return(<p>toto</p>)
    }

  }
}

const signInMutation = gql`
  mutation signIn($username: String!, $password: String!) {
    signIn(username: $username, password: $password) {
      user{
        _id
        username
        role{
          name
        }
      }
      token
    }
  }
`;

const QrCodeAuthenticationWithData = graphql(signInMutation)(withRouter(QrCodeAuthentication));

const mapDispatchToProps = (dispatch) => ({
  signInDispatcher(token , _id) {
    dispatch(signIn(token , _id));
  },
  setRoleDispatcher(role) {
    dispatch(setrole(role));
  }
});

const QrCodeAuthenticationWithDataAndState = connect(
  null,
  mapDispatchToProps
)(QrCodeAuthenticationWithData);

export default withStyles(styles)(QrCodeAuthenticationWithDataAndState);
