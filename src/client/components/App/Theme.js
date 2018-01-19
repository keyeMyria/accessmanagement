import { createMuiTheme } from 'material-ui/styles';
import pink from 'material-ui/colors/pink';
import green from 'material-ui/colors/green';
import indigo from 'material-ui/colors/indigo';

const theme = createMuiTheme({
  palette: {
    primary: indigo
  },
  status: {
    danger: 'orange',
  },
  overrides: {
    MuiAppBar: {
      // Name of the styleSheet
      root: {
        // Name of the rule
        background: '#003489',
        borderRadius: 0,
        border: 0,
        color: 'white',
        height: 56,
        boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .16)',
      },
    },
    MuiPaper: {
      // Name of the styleSheet
      root: {
        // Name of the rule
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',

      },
    },
    MuiButton: {
      // Name of the styleSheet
    },
    
    MuiBottomNavigation :{
      root: {
        // Name of the rule
        //add code in them.js
        position: 'fixed',
        bottom: '0',
        width: '100%',
        background: 'white',
        borderRadius: 3,
        border: 0,
        color: 'white',
        boxShadow: '0 -2px 6px rgba(0, 0, 0, .16)',
      },
    },
    MuiToolbar :{
      root: {
        padding: '0 !important',
        width : '100%',
        justifyContent: 'space-between',
      },
    },
    'MuiInput-underline':{
      root:{
        borderColor: '#fff',
      },
    },
    MuiInput:{
      root: {
        marginBottom: '10px',
      },
    }
  },
  direction: 'rtl'
});

export default theme;
