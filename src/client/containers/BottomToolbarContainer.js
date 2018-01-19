import { connect } from 'react-redux';

import { signOut } from '../actions';
import BottomBarComponent from '../components/App/BottomBarComponent';

const mapStateToProps = (state) => ({
  authenticated: state.auth.authenticated,
  role :state.auth.role
});
export default connect(
  mapStateToProps,
  //mapDispatchToProps
)(BottomBarComponent);
