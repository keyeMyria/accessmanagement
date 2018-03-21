import React from 'react';
import AvatarCropper from './vendor/AvatarCropper';
//import "./css/font-awesome-4.7.0/css/font-awesome.min.css";
import FileInput from './vendor/FileInput';
import toFile from 'data-uri-to-file'

const avatarAddUser ={
    // width: '50%',
    // height: '247px',
    // display: 'flex',
    // flexDirection: 'column',
    // alignItems: 'flex-end',
    // padding: '0px 20px',
};

class AvatarCropperWidget extends React.Component{
	constructor(props) {
		super(props);
		this.state={

     	 cropperOpen: false,
      	 img: "",
        croppedImg: "http://www.fillmurray.com/400/400"
		}
		this.handleFileChange = this.handleFileChange.bind(this);
		this.handleCrop = this.handleCrop.bind(this);
		this.handleRequestHide = this.handleRequestHide.bind(this);
	}
	handleFileChange( dataURI) {
    this.setState({
      img: dataURI,
      croppedImg: this.state.croppedImg,
      cropperOpen: true
    });
  }
	handleCrop(dataURI) {

    this.setState({
      cropperOpen: false,
      img: null,
      croppedImg: dataURI
    });
  }
	componentWillReceiveProps(props){
		if(props.defaultPic){
			this.setState(
				{croppedImg : `../assets/avatars/${props.defaultPic}`}
			)
		}
	}
  handleRequestHide() {
    this.setState({
      cropperOpen: false
    });
  }
	setSuccessResponse =(value)=>{
				this.props.setSuccessResponse(value)
	}
	render(){
		const {av_photo , width , height , av_edit } = this.props ;

		return (
      <div style={avatarAddUser}>
        <div className={av_photo}>
          <FileInput setSuccessResponse ={this.setSuccessResponse} handleFileChange ={this.handleFileChange} name={this.props.key} />
          <div className={av_edit}>
            <span>Click to Pick Avatar</span>
            <i className="fa fa-camera"></i>
          </div>
          <img src={this.state.croppedImg} />
        </div>
        {this.state.cropperOpen &&
          <AvatarCropper
            onRequestHide={this.handleRequestHide}
            cropperOpen={this.state.cropperOpen}
            onCrop={this.handleCrop}
            image={this.state.img}
            width={width}
            height={height}
          />
        }
      </div>);
	}
}

export default AvatarCropperWidget;
