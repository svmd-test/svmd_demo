import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSession } from '../firebase/UserProvider';
import { firestore } from '../firebase/config';
import { onScaleDeviceButtonClick}  from '../devices/Scale';
import { onBloodPressureMonitorDeviceButtonClick}  from '../devices/BloodPressureMonitor';
import { onBloodGlucoseMeterDeviceButtonClick}  from '../devices/BloodGlucoseMeter';
import { addUserReading } from '../firebase/user';
import { Table } from 'semantic-ui-react';
import SideMenu from '../SideMenu';
import ProgressBar from '../components/ProgressBar';
import { FaBluetooth, FaBluetoothB } from 'react-icons/fa';
import {siteCode,siteLogo} from "../components/Doctors"
import { playAudio} from '../components/playAudio'

function AddReading(props){

  const { user } = useSession();
  const params = useParams();
  const { register, setValue, handleSubmit } = useForm();
  const [userDocument, setUserDocument] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const transmit = {continuousGlucoseMonitor:false,bloodGlucoseMeter:'Read',bloodPressureMonitor:'Pair',scale:'Pair',peakFlowMeter:false,fingertipPulseOximeter:false}
  const units = {continuousGlucoseMonitor:{Glucose:'mg/DL'},bloodGlucoseMeter:{Glucose:'mg/DL'},peakFlowMeter:{'Peak Flow':'I/min'},scale:{Weight:'lbs'},bloodPressureMonitor: {Upper:'mm Hg (Systolic)', Lower:'mm Hg (Diastolic)' ,Pulse:'bpm (Pulse Rate)'},fingertipPulseOximeter:{SpO2:'% (Oxygen Saturation)',PR:'bpm (Pulse Rate)',PI:'% (Perfusion Index)'}};
  const deviceLabel = {continuousGlucoseMonitor:'Glucose',bloodGlucoseMeter:'Glucose',peakFlowMeter:'Peak Flow',bloodPressureMonitor:'Upper,Lower,Pulse',scale:'Weight',fingertipPulseOximeter:'SpO2,PR,PI'};
  // ,'RRp™':'rpm (Respiration Rate)','PVi®':'% (Pleth Variability Index)'
  // ,RRp™,PVi®
  const dateTime=new Date(Date.now());
  const date = dateTime.toLocaleDateString().replace(/(\d+)\/(\d+)\/(\d+)/,"$3-$1-$2") ;
  const time = dateTime.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: false }); 
  //console.log(time)
  const [completed, setCompleted] = useState(0);
  const [completed_scale, setCompletedScale] = useState(0);
  const [isPaired, setIsPaired] = useState(true);
  const [isStandard, setIsStandard] = useState(false);
  useEffect(() => {
    localStorage.setItem('completed',0)
    setInterval(() => setCompleted(localStorage.getItem('completed'), 2000));
    localStorage.setItem('completed_scale',0)
    setInterval(() => setCompletedScale(localStorage.getItem('completed_scale'), 2000));
    const docRef = firestore.collection('users').doc(params.id);
    const unsubscribe = docRef.onSnapshot((doc) => {
      if (doc.exists) {
        const documentData = doc.data();
        //if (Object.entries(documentData)!=undefined) {
          setUserDocument(documentData);
          setIsStandard(documentData?.deviceInfo?.bloodPressureMonitor?.pw?.length>4)
          const formData = Object.entries(documentData).map((entry) => ({
            [entry[0]]: entry[1],
          }));
          setValue(formData);
        //}
      }
    });
    return unsubscribe;
  }, [!!user &&user.uid, setValue, params.id]);
{/* 
  const unPairButtonClicked = () => {
    alert('unPair (temp/test) feature not finalized yet ... ')
  }
*/}
  const bloodPressureMonitor_ButtonClicked = () => {
    //alert(JSON.stringify(userDocument?.deviceInfo))
    //console.log( userDocument?.deviceInfo['bloodPressureMonitor']?.pw )
    // NEED TO CHECK IF BT Enabled
    const device = 'bloodPressureMonitor'
    playAudio(`/audio/BluetoothConnecting_${device}.mp3`)
    //.then(()=>{
      onBloodPressureMonitorDeviceButtonClick(params.id,device,isStandard,isPaired && userDocument?.deviceInfo != null ? userDocument?.deviceInfo[device]?.pw : [] )
    //})
    // https://freetts.com/ SmartViewMD is requesting access to your Bluetooth device.  After a popup window appears on your phone, please select the BP100 device and then click done.
    
    //alert(userDocument?.deviceInfo[device]?.pw.length )
  }
  const bloodGlucoseMeter_ButtonClicked = () => {
    //alert(JSON.stringify(userDocument?.deviceInfo))
    const device = 'bloodGlucoseMeter'
    const audio = new Audio(`/audio/BluetoothConnecting_${device}.mp3`)
    // NiproBGM US:Joanna_Male https://freetts.com/ SmartViewMD is requesting Bluetooth access to your Blood Glucose Meter.  Please select Nypro B G M and click Pair.
    audio.play()
    //alert(device)
    onBloodGlucoseMeterDeviceButtonClick(params.id,device,isPaired && userDocument?.deviceInfo != null ? userDocument?.deviceInfo[device]?.lastReading : [] )
  }
  const scale_ButtonClicked = () => {
    //alert(JSON.stringify(userDocument?.deviceInfo))
    //console.log( userDocument?.deviceInfo['scale']?.pw )
    // NEED TO CHECK IF BT Enabled
    const device = 'scale'
    playAudio(`/audio/BluetoothConnecting_${device}.mp3`)
    //.then(()=>{
      onScaleDeviceButtonClick(params.id,device,isStandard,isPaired && userDocument?.deviceInfo != null ? userDocument?.deviceInfo[device]?.pw : [] )
    //})
    // https://freetts.com/ SmartViewMD is requesting access to your Bluetooth device.  After a popup window appears on your phone, please select the BP100 device and then click done.
    
    //alert(userDocument?.deviceInfo[device]?.pw.length )
  }
  const onSubmit = async (data) => {
    console.log('DATA: ' , data)
    console.log('PARAMS: ' , params)
    console.log('USER: ' , user)
    if (data.add.devices) {
    console.log('DATA: ' , data)
      try {
        setLoading(true);
        //console.log("data: ",data.add)
        if ( params.id == user.uid ) {
          await addUserReading({ uid: params.id, ...data });
        } else {
          await addUserReading({ uid: params.id, ...data, createdBy: { uid: user.uid, name: user.displayName, email: user.email, dateTime: dateTime } });
        }
        props.history.push(`/readings/${params.id}`) //console.log("data",data.add)
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }    
    }
  };

  if (userDocument==null) {

    return null

  } else {

    const formClassname = `ui big form twelve wide column ${isLoading ? 'loading' : ''}`;

    const camel2title = (camelCase) => camelCase
      .replace(/([A-Z])/g, (match) => ` ${match}`)
      .replace(/^./, (match) => match.toUpperCase());

    return (
      <div>
        <SideMenu id={params.id} reading />
        <Table className="ui selecTable celled table">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell key="th">
                <h2>
                  <img src={siteLogo} alt={siteCode} height="40" />
                </h2>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell key="td">
                <div
                  className="add-form-container"
                  style={{ maxWidth: 960, margin: "50px auto" }}
                >
                  <div className="ui grid stackable">
                    <form
                      className={formClassname}
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      {userDocument?.devices?.map((device) => (
                        <Table key={device}>
                          <Table.Body>
                            <Table.Row>
                              <Table.Cell key={device}>
                                <div className="content">
                                  <div className="fields">
                                    <div className="field">
                                      <h3>{camel2title(device)}</h3> 
                                      {/* && userDocument?.blueTooth */}
                                      { transmit[device] ? 
                                      (
                                        <div>
                                          <button type="button"
                                          onClick={
                                            device=="bloodPressureMonitor"?bloodPressureMonitor_ButtonClicked:
                                            device=="bloodGlucoseMeter"?bloodGlucoseMeter_ButtonClicked:
                                            device=="scale"?scale_ButtonClicked:''}
                                          className="ui submit small green button left "
                                          >
                                            { transmit[device] == "Read" || ( userDocument?.deviceInfo && userDocument?.deviceInfo[device]?.pw && isPaired)  ? 
                                              (<div><FaBluetoothB className="mr-1"/>Read</div>)
                                              : 
                                              (<div><FaBluetooth  className="mr-1"/>Pair</div>) 
                                            }
                                          </button>
                                          { userDocument?.deviceInfo && userDocument?.deviceInfo[device]?.pw ? 
                                                  <label>
                                                  <input
                                                    type="checkbox"
                                                    onChange={(event) => setIsPaired(event.currentTarget.checked)}
                                                    checked={isPaired}
                                                  />Paired
                                                  </label>
                                          : '' } {' '}
                                          { device === "bloodPressureMonitor" && ( ! userDocument?.deviceInfo?.bloodPressureMonitor?.pw || ! isPaired ) ?
                                                  <label>
                                                    <input
                                                    type="checkbox"
                                                    onChange={(event) => setIsStandard(event.currentTarget.checked)}
                                                    checked={isStandard}
                                                  />Standard
                                                  </label>
                                          : '' }
                                          {/* 
                                          <button type="button"
                                          onClick={unPairButtonClicked}
                                          className="ui submit small blue button right "
                                          >
                                            {userDocument?.deviceInfo && userDocument?.deviceInfo[device]?.pw ? 
                                              (<div><FaBluetooth className="mr-1"/>UnPair</div>)
                                              : 
                                              ( "" ) 
                                            }
                                          </button>
                                          */}
                                          {transmit[device] == "Pair" ? (
                                            <>
                                              <div id={`blueToothReadingsDiv${device}`}>ᛒluetooth</div>
                                              <ProgressBar bgcolor={"#6a1b9a"} completed={device === "bloodPressureMonitor" ? completed : completed_scale} />
                                            </>
                                          ):'' }
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </div>
                                  <div className="fields">
                                    <div className="field">
                                      {deviceLabel[device]
                                        ? deviceLabel[device]
                                            .split(",")
                                            .map((read) => (
                                              <label key={read}>
                                                {read === "PI" ? <hr /> : ""}
                                                {read}
                                                <input
                                                  type="text"
                                                  placeholder={
                                                    units[device][read]
                                                  }
                                                  name={`add.devices.${device}.reading.${read}`}
                                                  ref={register}
                                                />
                                              </label>
                                            ))
                                        : ""}
                                    </div>
                                    <div className="field">
                                      <label>
                                        Date
                                        <input
                                          type="text"
                                          onFocus={(e) => {
                                            e.currentTarget.type = "date";
                                            e.currentTarget.focus();
                                          }}
                                          placeholder={date}
                                          name={`add.devices.${device}.date`}
                                          ref={register}
                                        />
                                      </label>
                                    </div>
                                    <div className="field">
                                      <label>
                                        Time
                                        <input
                                          type="text"
                                          onFocus={(e) => {
                                            e.currentTarget.type = "time";
                                            e.currentTarget.focus();
                                          }}
                                          placeholder={time}
                                          name={`add.devices.${device}.time`}
                                          ref={register}
                                        />
                                      </label>
                                    </div>
                                    <div className="field">
                                      <label>
                                        Note
                                        <input
                                          type="text"
                                          name={`add.devices.${device}.note`}
                                          ref={register}
                                        />
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </Table.Cell>
                            </Table.Row>
                          </Table.Body>
                        </Table>
                      ))}{" "}
                      {userDocument?.devices?.length ? (
                        <button
                          type="submit"
                          className="ui submit large grey button right floated"
                        >
                          Submit
                        </button>
                      ) : (
                        <div>
                          Before adding a reading, please first select device(s)
                          in your <a href="/">profile</a>.
                        </div>
                      )}
                    </form>
                  </div>
                </div>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    );
  };
}

export default AddReading;
