import React from 'react';
import { observer } from 'mobx-react';
import SessionStore from '../../mobx/sessionstore';
import AttendeeCard from './AttendeeCard';
import Grow from 'material-ui/transitions/Grow';

const style = {
  width: '100%',
  maxWidth: '1200px',
  margin: 'auto',
  paddingBottom: 16,
};

@observer
class ListGuestBYSessionFilter extends React.Component {
  constructor(props) {
    super(props);
    SessionStore.getGuestStatusBySession(props.match.params.id);
  }




  render() {
    if (SessionStore.sessionusers != null) {
      return (
        <div style={style}>
          {SessionStore.sessionusers.map(user => {
            return <AttendeeCard key={user._id} data={user} dense />;
          })}
        </div>
      );
    }
  }
}
export default ListGuestBYSessionFilter;
