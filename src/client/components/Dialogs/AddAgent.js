import React from 'react';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

import Form from '../AdminSpace/AddAgentForm';
class AddAgentDialog extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            open: props.open,
          };
    }
    
  
    handleClickOpen = () => {
      this.setState({ open: true });
    };
  
    handleClose = () => {
      this.setState({ open: false });
    };
    componentWillReceiveProps(props){
        this.setState({
            open:props.open
        })
    }
    render() {
        const {AddForm} = this.props;
      return (
        <div>
        <Dialog
						open={this.state.open}
                        onClose={this.handleClose}
                        keepMounted
						aria-labelledby="form-dialog-title"
					>
						 <DialogTitle id="form-dialog-title">
                           إضافة وكيل جديد
                       </DialogTitle>
                       <DialogContent className="dialogContent">
                       <Form form={AddForm} successCallback={this.props.successCallback}/>
                       </DialogContent>
                       <DialogActions>
                         <Button onClick={AddForm.onSubmit} color="secondary">
                           حفظ
                         </Button>
                         <Button onClick={this.handleClose} >
                         إلغاء
                         </Button>
                       </DialogActions>
					</Dialog>
					
        </div>
      );
    }
  }
  
  export default AddAgentDialog;
  
  