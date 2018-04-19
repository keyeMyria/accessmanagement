import {
  AUTH_SIGNIN,
  AUTH_SIGNOUT,
  SET_ROLE,
  SET_USERID
} from '../actions';

const initialState = {
  authenticated: false ,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTH_SIGNIN:
      return { ...state, authenticated: true  };
    case AUTH_SIGNOUT:
      return { ...state, authenticated: false  };
    case SET_ROLE:
      return {...state  , role:action.role}
    case SET_USERID :
      return {...state , userid : action.id}
    
    default:
      return state;
  }
};
