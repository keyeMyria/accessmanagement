import React from 'react';
import { observer } from 'mobx-react';
import SessionStore from '../../mobx/sessionstore';
import AttendeeCard from './AttendeeCard';

@observer
class ListGuestBYSessionFilter extends React.Component {
  constructor(props) {
    super(props);
    SessionStore.getGuestStatusBySession(props.match.params.id);
  }
  render() {
    if (SessionStore.sessionusers != null) {
      return (
        <div>
          {SessionStore.sessionusers.map(user => {
            return <AttendeeCard key={user._id} data={user} dense />;
          })}
        </div>
      );
    }
  }
}
export default ListGuestBYSessionFilter;
