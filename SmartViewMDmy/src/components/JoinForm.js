import React, { Component } from 'react';

import PasswordField from './PasswordField';

class JoinForm extends Component {

  // initialize state to hold validity of form fields
  state = {  newPassword: false }

  // higher-order function that returns a state change watch function
  // sets the corresponding state property to true if the form field has no errors
  fieldStateChanged = field => state => this.setState({ [field]: state.errors.length === 1 });

  // state change watch functions for each field

  passwordChanged = this.fieldStateChanged('password');

  render() {
    //const { password } = this.state;
    const { refReg, placeHolder } = this.props;

    return (

          <div >
            {/** Render the password field component using thresholdLength of 7 and minStrength of 3 **/}
            <PasswordField fieldId="password" refReg={refReg} label="Password" placeholder={placeHolder} onStateChanged={this.passwordChanged} thresholdLength={7} minStrength={3} />
          </div>

    );
  }

}

export default JoinForm;