import React from 'react';
import { withRouter } from 'react-router';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from 'react-redux';
import Typography from 'material-ui/Typography';
import classNames from 'classnames';
import LoginForm from '../components/Login/LoginForm';
import { signIn , setrole } from '../actions';
import TopBackLogin from './topBackLogin';
import BottomBackLogin from './bottomBackLogin';
import QrReader from 'react-qr-reader'
import Fingerprint from 'material-ui-icons/Fingerprint'
import Button from 'material-ui/Button';
import './css/SignInFormContainer.css';
import { CSSTransitionGroup } from 'react-transition-group'
  // const container = {
  //   display: 'flex' ,
  //   flexDirection: 'row',
  // }
  // const containerBackground = {
  //   backgroundColor: '#013084',
  //   width: '100vw',
  //   height: '100vh',
  //   display: 'flex',
  //   flexDirection: 'column',
  //   justifyContent: 'space-between',
  //   position: 'absolute',
  //   alignItems: 'center',
  //   overflow: 'hidden',
  //   zIndex: '-1',
  //   minHeight: '600px',
  // };
  // const topBackLoginC={
  //   transform: 'scale(1.7)',
  //   width: '50vw',
  // };
  // const bottomBackLoginC={
  //   transform: 'scale(1.7)',
  //   transformOrigin: '50% 100%',
  //   alignSelf: 'flex-start',
  //   width: '50vw',
  // };
  // const bottomBackLoginSvg={
  //   position: 'relative',
  //   top: '5px',
  // };
  const styleTypog2 = {
    color:'#fff',
    };

    const styleTypogTitle = {
      color:'#fff',
      };
  //
  //   const formLogin ={
  //     display: 'flex',
  //     flexDirection: 'column',
  //     height: '100vh',
  //     justifyContent: 'center',
  //     alignContent: 'center',
  //     width: '50vw',
  //   }
  //   const containerQRcode ={
  //     width: '50vw',
  //     display: 'flex',
  //     flexDirection: 'row',
  //     justifyContent: 'center',
  //     alignItems: 'center',
  //   }
  //   const QRcode ={
  //     width: '30vw',
  //   }

class SignInFormContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { errors: [] , user : null  , qrcodeauth : false};
  }
  /**
   * Change the user object.
   *
   * @param {object} event - the JavaScript event object
   */
  changeUser(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({
      user
    });
  }
  handleScan=(data)=>{
    if(data){
      this.props.history.push(`/loggedas/${data}`);
    }
  }
  handleError(err){
    console.error(err)
  }
    handleOpenQrCode=()=>{
     this.setState({
       qrcodeauth : true
     })
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

  render() {
    const { classes } = this.props;
    return (
      <div>
        <div className="containerBackground">
          <div className="topBackLoginC">
          <TopBackLogin/>
          </div>
          <div className="bottomBackLoginC">
          <BottomBackLogin/>
          </div>
        </div>
        <div className="container">
            <div className="section1">
              <Typography type="display2" style = {styleTypog2}>
                  إدارة الحضور للانشطة والمناسبات
              </Typography>
            </div>

              <CSSTransitionGroup
                className="section2"
                transitionName="qrcode"
                transitionEnterTimeout={500}
                transitionLeaveTimeout={300}>
                <div className="formLogin article">
                    <Typography type="headline" gutterBottom style={styleTypogTitle}>
                        تسجيل الدخول
                    </Typography>
                    <LoginForm
                      onSubmit={this.handleSubmit.bind(this)}
                      errors={this.state.errors}
                      username={null}
                      user={this.state.user}
                    />
                </div>
                <Button className="buttonPrint" fab raised color="accent"  onClick={this.handleOpenQrCode}>
                  <Fingerprint />
                </Button>
                <div className="article">
                  {(this.state.qrcodeauth)&&( <QrReader
                   className="QRcode"
                    delay={this.state.delay}
                    onError={this.handleError}
                    onScan={this.handleScan}
                    facingMode="user"
                  /> )}
                </div>
                </CSSTransitionGroup>
            </div>
      </div>
    );
  }
};

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

const SignInWithData = graphql(signInMutation)(withRouter(SignInFormContainer));

const mapDispatchToProps = (dispatch) => ({
  signInDispatcher(token , _id) {
    dispatch(signIn(token , _id));
  },
  setRoleDispatcher(role) {
    dispatch(setrole(role));
  }
});

const SignInWithDataAndState = connect(
  null,
  mapDispatchToProps
)(SignInWithData);

export default SignInWithDataAndState;
