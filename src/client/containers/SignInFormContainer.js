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
import QrReader from 'react-qr-reader';
import Fingerprint from 'material-ui-icons/Fingerprint';
import PhotoCamera from 'material-ui-icons/PhotoCamera';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import ButtonBase from 'material-ui/ButtonBase';
import './css/SignInFormContainer.css';
import { CSSTransitionGroup } from 'react-transition-group';
import UserStore from '../mobx/gueststore';
import {observer} from 'mobx-react';
import {withStyles} from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';
import {REMOTE_ASSETS_PATH} from '../app/config'

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
    fontFamily:'Changa',
    fontWeight:'300',
    marginBottom:'32px',
    };

  const styleTypogTitle = {
      color:'#fff',
      fontFamily:'Changa',
      fontWeight:'300',
      };

  const QRCodeContainer= {
      display:'flex',
      flexDirection:'column',
      justifyContent:'center',
      };

  const buttonQRCode= {
        color:'rgba(255, 255, 255, 0.50)',
        height:'300px',
        width:'300px',
        padding:'72px',
        backgroundColor:'rgba(0, 0, 0, 0.20)',
        border:'1px solid rgba(255, 255, 255, 0.30)',
        };
  const buttonQRCodeText= {
        color:'#00abc7',
        fontFamily:'Changa',
        fontWeight:'300',
        fontSize:'14pt',
        padding:'8px',
        marginTop:'32px',
        backgroundColor:'#fff',
        borderRadius:'2px',
        };
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
            height: 170,
            margin:'24px auto 24px',
          },
          textAuthentification: {
            fontFamily:'Changa',
            fontWeight:'300',
            fontSize:'14pt',
            color:'#fff',
            marginBottom:'16px',
          },
          authentifiedUserName: {
            fontFamily:'Changa',
            fontWeight:'300',
            fontSize:'20pt',
            color:'#fff',
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
class SignInFormContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { errors: [] , user : null  , qrcodeauth : false };
    if(props.match.params.uid){
      UserStore.getUserByID(props.match.params.uid , this.setUserData);

    }
  }
  setUserData=(user)=>{
    this.setState({
      user :user
    })
  }
  ComponentWillReceiveProps=(props)=>{

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
        if (!response.data.hasOwnProperty('errors')) {

          this.props.signInDispatcher(response.data.signIn.token , response.data.signIn.user._id);
          this.props.setRoleDispatcher(response.data.signIn.user.role.name);
          if(response.data.signIn.user.role.name=="agent_in" || response.data.signIn.user.role.name=="agent_out" || response.data.signIn.user.role.name=="agent_workshop")
            this.props.history.push('/agent');
          if(response.data.signIn.user.role.name=="admin")
            this.props.history.push('/listguests');
        } else {
          console.log(response.errors)
          this.setState({
            errors: response.data.signIn.errors
          });
        }
      })
      .catch((err) => {
        this.setState({
          errors:[err]
        })
      });
  }

  render() {
    const { classes } = this.props;
    if(this.props.match.params.uid){
      if(this.state.user!=null)
        return(
          <div><div className="containerBackground">
            <div className="topBackLoginC">
            <TopBackLogin/>
            </div>
            <div className="bottomBackLoginC">
            <BottomBackLogin/>
            </div>
          </div>
          <div className="container" className="containerAutentified">
              <div className="section1">
                <Typography type="display2" style = {styleTypog2}>
                إدارة الأحداث والحضور
                </Typography>
              </div>
              {(this.state.user.profile != null)&&
                (
                  <div>
                    <Avatar
                     src={`${REMOTE_ASSETS_PATH}/${this.state.user.profile.avatar}`}
                     className={classes.bigAvatar}/>
                     <p className={classes.textAuthentification}> Identified As </p>
                     <h2 className={classes.authentifiedUserName}>
                       {this.state.user.profile.forname} {this.state.user.profile.name}
                     </h2>
                     <LoginForm
                       onSubmit={this.handleSubmit.bind(this)}
                       errors={this.state.errors}
                       username={this.state.user.username}
                       user={this.state.user}
                     />
                   </div>
               )}
           </div></div>)
         else{
           return(<div>Loading...</div>)
         }
    }
    else{
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
                إدارة الأحداث والحضور
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
                  <div style={QRCodeContainer}>
                    <div>
                      {!this.state.qrcodeauth &&(<ButtonBase
                          focusRipple
                          style={buttonQRCode}
                          onClick={this.handleOpenQrCode}
                        >
                          <span>
                            <PhotoCamera style={{ height: 48, width:48 }}/>
                            <Typography
                              component="span"
                              style={buttonQRCodeText}
                            >
                            تسجيل الدخول برمز QR
                            </Typography>
                          </span>
                        </ButtonBase>)}
                      </div>
                      <div className="article">
                        {(this.state.qrcodeauth)&&( <QrReader
                         className="QRcode"
                          delay={this.state.delay}
                          onError={this.handleError}
                          onScan={this.handleScan}
                          facingMode="user"
                        /> )}
                      </div>
                    </div>
                  </CSSTransitionGroup>
              </div>
        </div>
      );
    }


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

export default withStyles(styles)(SignInWithDataAndState);
