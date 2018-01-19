import { connect } from 'react-redux';

import { signOut } from '../actions';
import AppBarComponent from '../components/App/AppBar';

const mapStateToProps = (state) => ({
  authenticated: state.auth.authenticated ,
  role : state.auth.role
});

const mapDispatchToProps = (dispatch) => ({
  logout() {
    dispatch(signOut());
    //browserHistory.push('/');
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppBarComponent);
