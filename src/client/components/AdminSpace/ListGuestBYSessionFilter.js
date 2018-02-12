import React from 'react';
import {observer} from 'mobx-react';
import SessionStore from '../../mobx/sessionstore';

@observer
class ListGuestBYSessionFilter extends React.Component{
  constructor(props){
    super(props);
    SessionStore.getGuestStatusBySession(props.match.params.id)
  }
  render(){
    return(<div>coucou</div>)
  }
}
export default ListGuestBYSessionFilter;
