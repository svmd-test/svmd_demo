import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
// https://www.digitalocean.com/community/tutorials/how-to-build-a-password-strength-meter-in-react
class FormField extends Component {

  // initialize state
  state = { value: '', dirty: false, errors: [] }

  hasChanged = e => {
    e.preventDefault();

    // destructure props - assign default dummy functions to validator and onStateChanged props
    const { label, required = false, validator = f => f, onStateChanged = f => f } = this.props;

    const value = e.target.value;
    const isEmpty = value.length === 0;
    const requiredMissing = this.state.dirty && required && isEmpty;

    let errors = [];

    if (requiredMissing) {
      // if required and is empty, add required error to state
      errors = [ ...errors, `${label} is required` ];
    } else if ('function' === typeof validator) {
      try {
        validator(value);
      } catch (e) {
        // if validator throws error, add validation error to state
        errors = [ ...errors, e.message ];
      }
    }

    // update state and call the onStateChanged callback fn after the update
    // dirty is only changed to true and remains true on and after the first state update
    this.setState(({ dirty = false }) => ({ value, errors, dirty: !dirty || dirty }), () => onStateChanged(this.state));
  }

  render() {
    const { value, dirty, errors } = this.state;
    const { type, label, fieldId, refReg,placeholder, children } = this.props;

    const hasErrors = errors.length > 0;
    const controlClass = ['form-control', dirty ? hasErrors ? 'is-invalid' : 'is-valid' : '' ].join(' ').trim();

    return (
      <Fragment>
        <div>
          <div className="d-flex flex-row justify-content-between align-items-center">
            <label htmlFor={fieldId} className="control-label">{label}</label>
            {/** Render the first error if there are any errors **/}
            { hasErrors && <div className="error form-hint font-weight-bold text-right m-0 mb-2">{ errors[0] }</div> }
          </div>
          {/** Render the children nodes passed to component **/}
          {children}
          <input autoComplete="new-password" type={type} className={controlClass} id={fieldId} name={fieldId} placeholder={placeholder} value={value} onChange={this.hasChanged} ref={refReg} />
        </div>
      </Fragment>
    );
  }

}

FormField.propTypes = {
  type: PropTypes.oneOf(["text", "password"]).isRequired,
  label: PropTypes.string.isRequired,
  fieldId: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  required: PropTypes.bool,
  children: PropTypes.node,
  validator: PropTypes.func,
  onStateChanged: PropTypes.func
};

export default FormField;