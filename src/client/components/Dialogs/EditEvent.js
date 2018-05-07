import React from 'react';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import EditFormComponent from '../AdminSpace/EditFormComponent';

class EditEventDialog extends React.Component {
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
    handleClickOpenEditEvent = () => {
		EditForm.update({
			title: EventStore.selectedEvent.title,
			// type: EventStore.selectedEvent.type,
			// place: EventStore.selectedEvent.place,
			// start_date: EventStore.selectedEvent.start_date,
			end_date: EventStore.selectedEvent.end_date,
			_id: EventStore.selectedEvent._id
		});
		this.setState({
			open_edit_event: true
		});
	};
	addEventOperation = (e) => {
		this.props.EditForm.onSubmit(e);
		this.handleClickOpenEditEvent();
	};
    render() {
        const {EditForm} = this.props;
      return (
        <div>
        <Dialog
						open={this.state.open}
                        onClose={this.handleClose}
                        keepMounted
						aria-labelledby="form-dialog-title"
					>
						<DialogTitle id="form-dialog-title">تحديث يبانات الحدث</DialogTitle>
						<DialogContent className="dialogContent">
							<EditFormComponent form={EditForm} />
						</DialogContent>
						<DialogActions>
							<Button onClick={(e) => this.addEventOperation(e)} color="secondary">
								حفظ
							</Button>
							<Button onClick={this.handleClose}>إلغاء</Button>
						</DialogActions>
					</Dialog>

					
        </div>
      );
    }
  }
  
  export default EditEventDialog;
  
  