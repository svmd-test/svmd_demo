import React from 'react';
import './Collapsible.css'

class Collapsible extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            open: this.props.open?false:true
        }
        this.togglePanel = this.togglePanel.bind(this);
    }

    togglePanel(e){
        this.setState({open: !this.state.open})
    }

    componentDidUpdate(){
        
    }

    render() {
      return (<div>
        <div onClick={(e)=>this.togglePanel(e)} className='header'>
            {this.props.title}</div>
        {this.state.open ? (
            <div className='content'>
                {this.props.children}
            </div>
            ) : null}
      </div>);
    }
  }

  export default Collapsible;