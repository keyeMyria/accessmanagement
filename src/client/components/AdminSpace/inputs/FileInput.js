import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import {LOCAL_IMPORT_PATH} from '../../../app/config'
class FileInput extends React.Component{
	constructor(props) {
		super(props);

		this.handleFile = this.handleFile.bind(this);
	}

  handleFile(e) {
    var reader = new FileReader();
    var file = e.target.files[0];
		const data = new FormData();
		data.set('importedfile',file, file.filename);
    // '/files' is your node.js route that triggers our middleware
    axios.post(LOCAL_IMPORT_PATH, data).then((response) => {
			this.props.setSuccessResponse(response.data.filename);
    });
    if (!file) return;
  }

  render() {
    return (
      <input ref="in" type="file" accept="csv/*" onChange={this.handleFile} name="importedfile" />
    );
  }
}

export default FileInput;
