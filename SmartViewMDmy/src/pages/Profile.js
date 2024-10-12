import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSession } from '../firebase/UserProvider';
import { firestore } from '../firebase/config'; // requestFirebaseNotificationPermission
import { updateUserDocument, addUserReading } from '../firebase/user';
//import { ProfileImage } from '../ProfileImage';
import { RiMailSendLine } from 'react-icons/ri';
import SideMenu from '../SideMenu';
import JoinForm from '../components/JoinForm';
import { siteCode,siteLogo,doctors } from '../components/Doctors'
import { sampleReadings } from '../components/sampleReadings'

function Profile(props){
  const { user } = useSession();
  const params = useParams();
  const { register, setValue, handleSubmit } = useForm();
  const [userDocument, setUserDocument] = useState(null);
  const [isLoading, setLoading] = useState(false);

  // const launchReading = async () => {
  //   props.history.push(`/reading/${params.id}`);
  // };
    
  useEffect(() => {
    const docRef = firestore.collection('users').doc(params.id);
    const unsubscribe = docRef.onSnapshot((doc) => {
      if (doc.exists) {
        const documentData = doc.data();
        setUserDocument(documentData);
        const formData = Object.entries(documentData).map((entry) => ({
          [entry[0]]: entry[1],
        }));
        setValue(formData);
      }
    });
    return unsubscribe;
  }, [!!user &&user.uid, setValue, params.id]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      //console.log('Passwd...: ',state)
      if (data?.doctor?.substring(0,6) === "Demo: " ) {
        const diffDevices = data.devices.filter(x => !userDocument.devices.includes(x));
        diffDevices.forEach(deviceType => {
          const samples = sampleReadings(data.doctor,deviceType,10)
          console.log('userDocument',userDocument,'\ndata',data,'\ndiffDevices',diffDevices,'\nsampleReadings',samples)

          addUserReading({ uid: params.id, adds: samples });

          //     if ( ! data?.demo?.includes(element) ) {
          //       data.demo.push(element)

          //     }
          })
      }

      await updateUserDocument({ uid: params.id, ...data });
      if (data.devices[0]) {
        props.history.push(`/reading/${params.id}`);
      } 
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (!userDocument) {
    return null;
  }

  const formClassname = `ui big form twelve wide column ${isLoading ? 'loading' : ''}`;

  return (
    <div
      className="add-form-container"
      style={{ maxWidth: 960, margin: "50px auto" }}
    >
      {" "}
      <SideMenu id={params.id} profile />
      <div>
        <h1>
          <img src={siteLogo} alt={siteCode} height="40" />
        </h1>
      </div>   {" "}
       <div className="ui grid stackable">
        <form className={formClassname} onSubmit={handleSubmit(onSubmit)}>
        <button
          type="submit"
          className="ui submit large grey button right floated"
        >
          Submit
        </button>
        <div className="fields">
          <div className="field">
            <label key="doctors">
              Health Care Provider
              <select className="doctor" name="doctor" ref={register}>
                {doctors.map((doctor) => (
                  <option key={doctor.label} value={doctor.value}>{doctor.label}</option>
                ))}
              </select>
            </label>
          </div>
        </div>
        {( userDocument.devices?.length ) ?'':`Hi ${userDocument.name}, Please select your medical device(s) and update your information, and then at the end of this page [Submit] your Profile updates.`}
          <hr />
          <div className="fields">
            <div className="three wide field">
              <label>
                <input
                  type="checkbox"
                  name="devices"
                  value="bloodPressureMonitor"
                  ref={register}
                />
                Blood Pressure Monitor
              </label>
            </div>
            <div className="three wide field">
              <label>
                <input
                  type="checkbox"
                  name="devices"
                  value="bloodGlucoseMeter"
                  ref={register}
                />
                Blood Glucose Meter
              </label>
            </div>
            <div className="three wide field">
              <label>
                <input
                  type="checkbox"
                  name="devices"
                  value="continuousGlucoseMonitor"
                  ref={register}
                />
                Continuous Glucose Monitor
              </label>
            </div>
            <div className="three wide field">
              <label>
                <input
                  type="checkbox"
                  name="devices"
                  value="peakFlowMeter"
                  ref={register}
                />
                Peak Flow Meter
              </label>
            </div>
            <div className="three wide field">
              <label>
                <input
                  type="checkbox"
                  name="devices"
                  value="fingertipPulseOximeter"
                  ref={register}
                />
                Fingertip Pulse Oximeter
              </label>
            </div>
            <div className="three wide field">
              <label>
                <input
                  type="checkbox"
                  name="devices"
                  value="scale"
                  ref={register}
                />
                Scale
              </label>
            </div>
          </div>
          <hr />
          <div className="equal width fields">
            <div className="field">
              <label>
                Phone
                <input type="text" name="phone" ref={register} placeHolder="Required" />
              </label>
            </div>
          </div>
          <div className="field">
            <label>
              Date Of Birth
              <input type="date" name="dob" ref={register} />
            </label>
          </div>
          <div className="field">
            <label>
              Weight
              <input type="text" name="weight" ref={register} placeHolder="Optional" />
            </label>
          </div>
          <div className="field">
            <label>
              Height
              <input type="text" name="height" ref={register} placeHolder="Optional" />
            </label>
          </div>
          <div className="fields">
            <div className="six wide field">
              <label>
                Address
                <input type="text" name="address" ref={register} placeHolder="Optional" />
              </label>
            </div>
            <div className="five wide field">
              <label>
                City
                <input type="text" name="city" ref={register} placeHolder="Optional" />
              </label>
            </div>
            <div className="two wide field">
              <label>
                State
                <input type="text" name="state" ref={register} placeHolder="Optional" />
              </label>
            </div>
            <div className="three wide field">
              <label>
                Zip
                <input type="text" name="zip" ref={register} placeHolder="Optional" />
              </label>
            </div>
            <div className="field">
              <label>
                Gender
                <select className="gender" name="gender" ref={register} placeHolder="Optional" >
                  <option value="">Optional</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </label>
            </div>
          </div>
          <div className="fields">
            <div className="field">
              <JoinForm refReg={register} placeHolder="Change Password" />
            </div>
          </div>
          <div className="fields">
            <div className="eight wide field">
              <label>
                Name
                <input type="text" name="name" ref={register} />
              </label>
            </div>
            <div className="eight wide field">
              <label>
                Email
                <input type="text" name="email" disabled ref={register} />
              </label>
            </div>
          </div>
          <table style={{ width: "100%" }}>
            <tbody>
              <tr>
                <td style={{ textAlign: "left" }}>
                  <label>
                    <input
                      type="checkbox"
                      name="receiveEmail"
                      value={true}
                      ref={register}
                    />{" "}
                    <RiMailSendLine />{" "}
                  </label>
                </td>
                <td style={{ textAlign: "right" }}>
                  {" "}
                  <button
                    type="submit"
                    className="ui submit large grey button right floated"
                  >
                    Submit
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
        {/*<ProfileImage id={params.id} />*/}
      </div>
    </div>
  );
};

export default Profile;
