import React, { useState } from 'react';

import './TermsAndConditions.css';

const TermsAndConditions = () => {
  const [agree, setAgree] = useState(false);

  const checkboxHandler = () => {
    // if agree === true, it will be set to false
    // if agree === false, it will be set to true
    setAgree(!agree);
    // Don't miss the exclamation mark
  }

  // When the button is clicked
  const btnHandler = () => {
    alert('The buttion is clickable!');
  };

  return (
    <div className="TermAndConditions">
      <div className="container">
        <div>
          <input type="checkbox" id="agree" onChange={checkboxHandler} />
          <label htmlFor="agree"> I agree to <b>terms and conditions</b></label>
        </div>

        {/* Don't miss the exclamation mark* */}
        <button disabled={!agree} className="btn" onClick={btnHandler}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default TermsAndConditions;