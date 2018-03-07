import React    from 'react'
import ReactDOM from 'react-dom'
import ReactCodeInput from 'react-code-input';
import { reactCodeInput } from 'react-code-input';
import Close from 'material-ui-icons/Close';
import Send from 'material-ui-icons/Send';
import Button from 'material-ui/Button';

class DialButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      active : false
    }
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
  }
  handleMouseDown(e) {
    this.setState({active: true})
  }
  handleMouseUp(e) {
    if (this.state.active) {
      this.setState({active: false})
    }
  }
  componentDidMount() {
    const element = ReactDOM.findDOMNode(this.refs.button)
    element.addEventListener('mousedown', this.handleMouseDown)
    window.addEventListener('mouseup', this.handleMouseUp)
  }
  componentWillUnmount() {
    const element = ReactDOM.findDOMNode(this.refs.button)
    element.removeEventListener('mousedown', this.handleMouseDown)
    window.removeEventListener('mouseup', this.handleMouseUp)
  }
  render() {
    const { symbol, alias, icon, compact } = this.props
    const { active } = this.state
    return (
      <p ref='button' style={{

        'color'             : '#00abc7',
        'fontSize'          : '30px',
        'fontWeight'        : '100',
      }}

      >
        <strong>
          {icon}
          {(!icon || !compact) && (
            <span style={{
              'paddingLeft'      :'8px',
            }}
            >&nbsp;{symbol}</span>
          )}
        </strong>

      </p>
    )
  }
}

export class DialPad extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { onClick, compact } = this.props
    const buttons = [
      {
        symbol : '3'
      },
      {
        symbol : '2'
      },
      {
        symbol : '1'
      },
      {
        symbol : '6'
      },
      {
        symbol : '5'
      },
      {
        symbol : '4'
      },
      {
        symbol : '9'
      },
      {
        symbol : '8'
      },
      {
        symbol : '7'
      },
      {
        icon   : (<Close/>),
        action : 'reset',
      },
      {
        symbol : '0'
      }
    ]
    return (
      <div>
        <div style={{
          // 'float'                : 'left',
          // 'display'              : 'block',
          // 'width'                : '280px',
          // 'height'                : '280px',
          'WebkitTouchCallout'   : 'none',
          'WebkitUserSelect'     : 'none',
          'KhtmlUserSelect'      : 'none',
          'MozUserSelect'        : 'none',
          'MsUserSelect'         : 'none',
          'userSelect'           : 'none',
          'fontFamily'           : 'Roboto, Arial, Verdana, sans-serif'
        }}>
          <ol style={{
            'listStyle'          : 'none',
            'display'            : 'grid',
            'gridTemplateColumns': 'repeat(3, 1fr)',
            'gridRowGap': '10px',
            'gridColumnGap': '10px',
            'fontFamily': 'Roboto',
            'direction':'rtl',
          }}>
            {buttons.map((button, i) => (
              <li onClick={() => onClick(button)}  className="liNumber"
              style={{
                // 'width'           : '8vw',
                // 'height'          : '8vw',
                // 'border-radius'   : '50%',
                // 'background'      : 'rgb(5, 55, 135) none repeat scroll 0% 0%',
                // 'display'         : 'flex',
                // 'alignItems'     : 'center',
                // 'justifyContent' : 'center',
                // 'maxWidth': '97px',
                // 'maxHeight': '97px',

              }} key={i}>
                <DialButton {...button} compact={compact} />
              </li>
            ))}
          </ol>
        </div>
      </div>
    )
  }
}

DialPad.defaultProps = {
  onClick : () => {}
}

export default class Dial extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value   : '',
      capture : true,
      compact : false,
      increment : 0
    }
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleResize = this.handleResize.bind(this)
  }
  isCompact() {
    const container = ReactDOM.findDOMNode(this.refs.container)
    return container ? container.getBoundingClientRect().width < 540 : false
  }
  handleResize(e) {
    const { compact } = this.state
    if (this.isCompact()) {
      if (!compact) {
        this.setState({compact: true})
      }
    } else {
      if (compact) {
        this.setState({compact: false})
      }
    }
  }
  handleClick(button) {
    const { value } = this.state
    if ((!button.action)&&('reset' != button.action)) {
      this.setState({
        //increment:i+1,
        value : `${value}${button.symbol}`
      })
    } else if ('call' === button.action) {
    } else if ('verify' === button.action) {
      this.props.handleValid(value)
    }
    else if ('reset' === button.action) {
      this.reset()
    }
    if ((this.state.increment<=3) &&('reset' !== button.action)){
      let i = this.state.increment;
      this.setState({
          increment:i+1,
      })
      let input=this.child.state.input;

      input[this.state.increment]=`${button.symbol}`;
      this.child.setState({
        input:input
      })
      //this.handleClickPad()
    }

  }
  handleKeyPress(e) {
    const { capture, value } = this.state
    if (!capture) {
      return
    }
    switch (e.charCode) {
      case 48:
      case 49:
      case 50:
      case 51:
      case 52:
      case 53:
      case 54:
      case 55:
      case 56:
      case 57:
      case 42:
      case 43:
        this.setState({
          value : value + String.fromCharCode(e.charCode)
        })
      default:
        break
    }
  }
  componentDidMount() {
    window.addEventListener('keypress', this.handleKeyPress)
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  }
  componentWillUnmount() {
    window.removeEventListener('keypress', this.handleKeyPress)
    window.removeEventListener('resize', this.handleResize)
  }
  beginCapture(e) {
    this.setState({
      capture : true
    })
  }
  endCapture(e) {
    this.setState({
      capture : false
    })
  }
  reset() {
    this.setState({
      value : '',
      increment : 0
    })
    let input =this.child.state.input;
    input.length=0;
    this.child.setState({
      input:input
    })
  }
  handleChange(e) {
    const { capture } = this.state
    if (!capture) {
      this.setState({
        value : e.target.value
      })
    }
  }
  handleSend=()=>{
    this.props.handleValid(this.state.value)
  }
  handleClickPad=()=>{
    const element = this.child
    element.handleClickPad()
  }
  render() {

    const props = {
      className: reactCodeInput,
      style:{
        fontFamily: 'Roboto',
        width:'178px',
        marginLeft:'70px',
        textAlign:'left',
        marginBottom: '16px',
        cursor:'not-allowed',
      },
      inputStyle: {
        fontFamily: 'Roboto',
        margin:  '2px',
        MozAppearance: 'textfield',
        width: '40px',
        borderRadius: '0px',
        paddingLeft: '0px',
        fontSize: '20pt',
        height: '45px',
        backgroundColor: 'rgb(238, 238, 238)',
        color: 'rgb(120, 120, 120)',
        border:'none',
        borderBottom: '3px solid #00abc7',
        textAlign:'center',
      },
      inputStyleInvalid: {
        fontFamily: 'Roboto',
        margin:  '2px',
        MozAppearance: 'textfield',
        width: '40px',
        borderRadius: '0px',
        paddingLeft: '0px',
        fontSize: '20pt',
        height: '45px',
        backgroundColor: 'rgb(238, 238, 238)',
        color: 'rgb(120, 120, 120)',
        border:'none',
        borderBottom: '3px solid #ef4035',
        textAlign:'center',
      },
    }

    const { value, compact } = this.state
    return (
      <div ref='container' className="dialContainer"
      >

      <div
      style= {{
        'height': '64px',
        'width':'320px',
        'display': 'flex',
        'alignItems': 'center',
        // 'marginBottom': '20px',
      }}>

            <input className="inputDial"
              style    = {{
              // 'border'      : 'none',
              // 'float'       : 'left',
              // 'display'     : 'block',
              // 'width'       : '26vw',
              // 'fontSize'    : compact ? '24px' : '40px',
              // 'minHeight'   : '47px',
              // 'marginBottom': '20px',
              // 'color'       : '#4d4d4d',
              // 'maxWidth'    : '311px',
            }}
              onChange = {this.handleChange.bind(this)}
              onFocus  = {this.endCapture.bind(this)}
              onBlur   = {this.beginCapture.bind(this)}
              type     = 'hidden'
              value    = {value} />

            <ReactCodeInput
                       fields={0}
                       disabled={true}
                       ref={instance => { this.child = instance; }}
                       {...props}
            />

            {this.state.increment >= 3 &&(
              <Button fab  color="secondary" aria-label="add" style= {{'marginLeft': '10px', 'padding': '0',}} onClick={this.handleSend.bind(this)}>
                <Send/>
              </Button>
            )}

        </div>

        <DialPad increment={this.state.increment} onClick={this.handleClick.bind(this)} compact={compact} />


      </div>
    )
  }
}
