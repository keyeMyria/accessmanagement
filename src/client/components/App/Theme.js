import { createMuiTheme } from 'material-ui/styles';
import pink from 'material-ui/colors/pink';
import green from 'material-ui/colors/green';
import indigo from 'material-ui/colors/indigo';

const theme = createMuiTheme({
  palette: {
    primary: {
    main: '#003489',
    contrastText: '#fff',
    },
    secondary: {
    main: '#00abc7',
    contrastText: '#fff',
    },
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
      root: {
        fontFamily: 'Changa',
      },
    },
    MuiTypography: {
      display1: {
        fontFamily: 'Changa',
        fontWeight:'300',
      },
      title: {
        fontFamily: 'Changa',
        fontWeight:'300',
      },
    },
    MuiDialogTitle:{
          root: {
            disableTypography:"true",
            fontFamily: 'Changa',
            fontWeight:'500',
          },
  },
  MuiDialogActions:{
        root: {
          paddingBottom:'24px',
        },
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
    MuiBottomNavigationAction:{
      label: {
        // Name of the rule
        fontFamily: 'Changa',
        fontWeight:'500',
      },
    },
    MuiToolbar :{
      root: {
        padding: '0 !important',
        width : '100%',
        justifyContent: 'space-between',
      },
      iconButton:{
        color:'#fff',
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
