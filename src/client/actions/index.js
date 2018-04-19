export const AUTH_SIGNIN = 'AUTH_SIGNIN';
export const AUTH_SIGNOUT = 'AUTH_SIGNOUT';
export const SET_ROLE ='SET_ROLE' ;
export const SET_USERID = 'SET_USERID';

export const signIn = (token , _id) => {
  localStorage.setItem('token', token );
  localStorage.setItem('loogedin_id' , _id)
  return { type: AUTH_SIGNIN };
};
export const setuserid=(id)=>{
  return { type: SET_USERID , id };
}
export const signOut = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('loogedin_id');
  localStorage.removeItem('role');
  return { type: AUTH_SIGNOUT };
};
export const setrole = (role)=>{
  localStorage.setItem('role' , role);
  return {
    type : SET_ROLE ,
    role
  }
}
