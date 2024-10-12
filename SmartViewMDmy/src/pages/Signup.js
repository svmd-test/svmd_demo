import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signup } from '../firebase/auth';
import { addUserReading } from '../firebase/user';
import { Link } from 'react-router-dom';
import { RiMailSendLine } from 'react-icons/ri';
import JoinForm from '../components/JoinForm';
import Popup from '../components/Popup';  
import { sampleReadings } from '../components/sampleReadings'

//import TermsAndConditions from '../components/TermsAndConditions';
const termsAndAgreement=['Welcome to Belle IT’s SmartViewMD.com application. If you continue to browse and use this SmartViewMD app (application), you are agreeing to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern Belle IT ’s relationship with you in relation to this SmartViewMD app. If you disagree with any part of these terms and conditions, please do not use our SmartViewMD app.',<br/>,<br/>,'The term ‘Belle IT’ or ‘us’ or ‘we’ refers to the owner of the SmartViewMD app whose registered office is in Florida. Our company’s website is BelleIT.net. The term ‘you’ refers to the user or viewer of our SmartViewMD app.',<br/>,<br/>,'The content of the pages of this SmartViewMD app is for your general information and use only. It is subject to change without notice.',<br/>,<br/>,'This SmartViewMD app uses cookies to monitor browsing preferences, push notifications and SMS texting . If you do allow cookies, notifications or SMS notifications to be used, the following personal information may be stored by us for use by business associates of BelleIT.',<br/>,<br/>,'BelleIT is a third-party HIPAA “covered entity” under the BAA (Business Associate Agreement) with JTCHS (Jessie Trice Community Health System). As such, only the patient information identified in SmartViewMD, by you, is designated as protected “PHI” (Protected Health Information) as defined by the HIPPA Privacy Rule located at 45 CFR Part 160 and Subparts A and E of Part 164. SmartViewMD app:',<br/>,<br/>,'(1) Creates, receives, maintains, or transmits “protected health information”, as the term is defined below, on behalf of JTCHS and you (the JTCHS patient) to carry out HIPAA covered health functions or activities regarding JTCHS and you (JTCHS patient).(2) Provides certain services to JTCHS that involve Protected Health Information (PHI).',<br/>,<br/>,'The HIPAA Privacy Rule provides federal protections for “personal health information” held by covered entities and gives patients an array of rights with respect to that information. At the same time, the Privacy Rule is balanced so that it permits the disclosure of personal health information needed for patient care and other important purposes.',<br/>,<br/>,'You, the JTCHS patient, using the SmartView application understands the role of BelleIT as a 3rd party vendor for JTCHS. Also the user/patient acknowledges the use, function and purpose of SmartViewMD with respect to their health information.',<br/>,<br/>,'Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this SmartViewMD app for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.',<br/>,<br/>,'Your use of any information or materials on this SmartViewMD app is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through this SmartViewMD app meet your specific requirements.',<br/>,<br/>,'This SmartViewMD app contains material which is owned by us or licensed to JTCHS. This material includes, but is not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.',<br/>,<br/>,'All trademarks reproduced in this SmartViewMD app, which are not the property of, or licensed to the operator, are acknowledged on the SmartViewMD app is considered a claim for damages and/or be a criminal offense.',<br/>,<br/>,'From time to time, this SmartViewMD app may also include links to other SmartViewMD apps. These links are provided for your convenience to provide further information. They do not signify that we endorse any of the associated links in the SmartViewMD app(s). We have no responsibility for the content of the linked SmartViewMD app(s).',<br/>,<br/>,'Your use of this SmartViewMD app and any dispute arising out of such use of the SmartViewMD app is subject to the laws of Broward County, Florida.' ]


function Signup(props) {
  const { register, handleSubmit, reset } = useForm();
  const [isLoading, setLoading] = useState(false);

  const [agree, setAgree] = useState(false);
  const checkboxHandler = () => {
    // if agree === true, it will be set to false
    // if agree === false, it will be set to true
    setAgree(!agree);
    // Don't miss the exclamation mark
  }

  const [showPopup, setPopup] = useState(false);
  const togglePopup= () => { 
    setPopup(!showPopup);
  }

  const onSubmit = async (data) => {
    let newUser;
    setLoading(true);
    try {
      //console.log(data)
      newUser = await signup(data);
      if (data.email.includes("@patient.test")) {
        alert(`SmartViewMD adding sample readings for ${data.email} demo/training.`)
        const samples = sampleReadings("Demo: Dr. Demo Training, MD","bloodPressureMonitor",10)  
        addUserReading({ uid: newUser.uid, adds: samples });
      }  
      reset();
    } catch (error) {
      console.log(error);
    }

    if (newUser) {
      props.history.push(`/profile/${newUser.uid}`);
    } else {
      setLoading(false);
    }
  };

  const formClassName = `ui form ${isLoading ? 'loading' : ''}`;

  return (
    <div className="login-container">
      <div className="ui card login-card">
        <div className="content">
          <form className={formClassName} onSubmit={handleSubmit(onSubmit)}>
            <div className="two fields">
              <div className="field">
                <label>
                  First Name
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    ref={register}
                  />
                </label>
              </div>
              <div className="field">
                <label>
                  Last Name
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    ref={register}
                  />
                </label>
              </div>
            </div>
            <div className="field">
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  ref={register}
                />
              </label>
            </div>
            <div className="field">
              <label>
                Phone
                <input
                  type="text"
                  name="phone"
                  placeholder="Cell Phone #"
                  ref={register}
                />
              </label>
            </div>            
            <div className="field">
              <JoinForm refReg={register} placeHolder="Strong Password"/>
            </div>
            <div className="field actions">
              <table style={{ width:'100%' }}>
                <tbody>
                <tr>
                  <td style={{ 'textAlign':'left' }}>
                    <label>
                      <input
                        type="checkbox"
                        name="receiveEmail"
                        defaultChecked={true}
                        ref={register}
                      />{" "}
                      <RiMailSendLine />{" "} Notifications
                    </label>
                    <br/>
                    <label htmlFor="agree"> 
                  <input type="checkbox" id="agree" onChange={checkboxHandler}/>
                        {" "}I agree to<a href="#" onClick={togglePopup}><b>terms and conditions</b></a>
                    </label>
                     </td>
                  <td style={{ 'textAlign':'right' }}>
                    {"   "}
                    <button disabled={!agree} className="ui primary button login" type="submit">
                      Signup
                    </button>
                    or
                    <Link to="/login"><label style={{'whiteSpace': 'nowrap'}}> Log In</label></Link>
                  </td>
                </tr>
                </tbody>
              </table>{showPopup ? <Popup text={termsAndAgreement} closePopup={togglePopup} /> : null }
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
