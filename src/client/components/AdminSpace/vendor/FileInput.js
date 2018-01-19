import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import {REMOTE_UPLOAD_PATH} from '../../../app/config'
class FileInput extends React.Component{
	constructor(props) {
		super(props);

		this.handleFile = this.handleFile.bind(this);
	}

  handleFile(e) {
    var reader = new FileReader();
    var file = e.target.files[0];
		const data = new FormData();
		//data.append('file', e.target.files[0]);
		data.set('avatar',file, file.filename);
    // '/files' is your node.js route that triggers our middleware
    axios.post(REMOTE_UPLOAD_PATH, data).then((response) => {
			this.props.setSuccessResponse(response.data.filename);
    });
		//const response =  this.props.mutate({variables : {file :file}});
    if (!file) return;
    let field = e.target;
    reader.onload = function(img) {
      ReactDOM.findDOMNode(this.refs.in).value = '';
      this.props.handleFileChange(img.target.result);
      field.setAttribute('value' , img.target.result);
    }.bind(this);
    reader.readAsDataURL(file);
  }

  render() {
    return (
      <input ref="in" type="file" accept="image/*" onChange={this.handleFile} name="avatar" />
    );
  }
}

export default FileInput;
