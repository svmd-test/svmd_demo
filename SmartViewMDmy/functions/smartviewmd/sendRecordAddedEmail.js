/*
<table style="border:1px solid black;border-collapse:collapse;">
<tr>
<th style="border:1px solid red;">Table Header</th><th style="border:1px solid red;">Table Header</th>
</tr>
<tr>
<td style="border:1px solid red;">Table cell 1</td><td style="border:1px solid red;">Table cell 2</td>
</tr>
<tr>
<td style="border:1px solid red;">Table cell 3</td><td style="border:1px solid red;">Table cell 4</td>
</tr>
</table>

 *
 * sendWelcomeEmail module for phiMail Server
 * 
 * @module sendWelcomeEmail
 */
const functions = require('firebase-functions');

const nodemailer = require('nodemailer');

// env vars
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;

// create node mailer transport
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

const units =  {
  "continuousGlucoseMonitor": { "Glucose": "mg/DL" },
  "bloodGlucoseMeter": { "Glucose": "mg/DL" },
  "peakFlowMeter": { "Peak Flow": "I/min" },
  "bloodPressureMonitor": {
    "Upper": "mm Hg (Systolic)",
    "Lower": "mm Hg (Diastolic)",
    "Pulse": "bpm (Pulse Rate)"
  },
  "fingertipPulseOximeter": {
    "SpO2": "% (Oxygen Saturation)",
    "PR": "bpm (Pulse Rate)",
    "PI": "% (Perfusion Index)"
  }
}
const effectiveTime = new Date(Date.now()).ymdt
const camel2title = (camelCase) => camelCase
  .replace(/([A-Z])/g, (match) => ` ${match}`)
  .replace(/^./, (match) => match.toUpperCase());

// const sendRecordAddedEmail = async function sendRecordAddedEmail(email, reading, patient) {
//   return null;
// }

const sendRecordAddedEmail = async function sendRecordAddedEmail(email, reading, patient, patientReadings) {
  //console.log("patientReadings:  ", patientReadings)
  //console.log("patient:  ", patient)
  const readingTableRow = patientReadings.map( (patientReading) => {
    //console.log(patientReading)

    const readingTableData = Object.keys(patientReading.devices).map(
      function(device){
        const readings = Object.entries(patientReading.devices[device].reading).map(
          function([label, value]){
            return `<div id="${label}">${label}: ${value} ${units[device][label]}</div>`
          }
        ).join('')
        const dateTime = [ patientReading.devices[device].date,patientReading.devices[device].time].join(' ')
        const doctor = patientReading.profile !== undefined ? patientReading.profile.doctor : ''
        return '<td>' + [ new Date(patientReading.created).toISOString(), camel2title(device), readings, dateTime, patientReading.devices[device].note, doctor].join("</td><td>") + '</td>'
      }) 
      //console.log(readingTableData)
      return readingTableData.join("</tr>\n\t\t   <tr>")
  }).join("</tr>\n\t\t   <tr>")
  // const readingTableData = Object.keys(reading.devices).map(
  //   function(device){
  //     const readings = Object.entries(reading.devices[device].reading).map(
  //       function([label, value]){
  //         return `${label}: ${value} ${units[device][label]}`
  //       }
  //     ).join(",")
  //     const dateTime = [ reading.devices[device].date,reading.devices[device].time].join(' ')
  //     return [ new Date(reading.created).toISOString(), camel2title(device), readings, dateTime, reading.devices[device].note, reading.profile.doctor ].join("<td></td>")
  //   })
  //const readingTableRow = `<tr><td>${readingTableData}</td></tr>`
  const 
      fileName=`${patient.name.stringValue.replace(" ","_").replace(/\W/g,'')}_${new Date().toISOString().replace(/([^0-9]|\d{2}\.\d{3}Z$)/g,'')}_CCDA.xml` //'Test_Patient_CDA.xml',
      component=`<component>
        <observation classCode="OBS" moodCode="EVN">
          <templateId root="2.16.840.1.113883.10.20.22.4.27"/>
          <templateId root="2.16.840.1.113883.10.20.22.4.27" extension="2014-06-09"/>
          <id root="2721acc5-0d05-4402-9e62-79943ea3901c"/>
          <code code="8480-6" codeSystem="2.16.840.1.113883.6.1" codeSystemName="LOINC"
            displayName="SYSTOLIC BLOOD PRESSURE"/>
          <text>
            <!-- This reference identifies content in human readable formatted text-->
            <reference value="#SystolicBP_2"/>
          </text>
          <statusCode code="completed"/>
          <effectiveTime value="${effectiveTime}-0500"/>
          <!-- Example of Value with UCUM unit. Note that mixed metric and imperial units used in this example-->
          <value xsi:type="PQ" value="120" unit="mm[Hg]"/>
          <!-- Additional information of interpretation and/or reference range may be included but are optional-->
        </observation>
      </component>`,
      entry=`<entry typeCode="DRIV">
      <!-- When a set of vital signs are recorded together, include them in single clustered organizer-->
      <organizer classCode="CLUSTER" moodCode="EVN">
        <templateId root="2.16.840.1.113883.10.20.22.4.26"/>
        <templateId root="2.16.840.1.113883.10.20.22.4.26" extension="2015-08-01"/>
        <id root="e421f5c8-29c2-4798-9cb5-7988c236e49d"/>
        <code code="46680005" displayName="Vital Signs" codeSystem="2.16.840.1.113883.6.96"
          codeSystemName="SNOMED CT">
          <translation code="74728-7"
            displayName="Vital signs, weight, height, head circumference, oximetry, BMI, and BSA panel "
            codeSystem="2.16.840.1.113883.6.1" codeSystemName="LOINC"/>
        </code>
        <statusCode code="completed"/>
        <effectiveTime value="20140520193605-0500"/>
        <!-- Each vital sign should be its own component. Note that systolic and diastolic BP must be separate components-->
      ${component}
      </organizer>
    </entry>`

    const mailOptions = {
      from: 'SmartViewMD Notifier <notifier@SmartViewMD.com>',
      to: email,
      subject: 'Welcome to SmartViewMD ... record added!',
      text: `Hi ${email}!\n\nRecord just added to SmartViewMD.com.\n${JSON.stringify(reading)}\n${JSON.stringify(patient)}`,
      attachments: [
        {
          filename: `${fileName}`,
          content:`<ClinicalDocument xmlns="urn:hl7-org:v3" xmlns:sdtc="urn:hl7-org:sdtc" xmlns:voc="urn:hl7-org:v3/voc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:hl7-org:v3 CDA.xsd">
  <realmCode code="US" />
  <typeId root="2.16.840.1.113883.1.3" extension="POCD_HD000040" />
  <templateId root="2.16.840.1.113883.10.20.22.1.1" assigningAuthorityName="US Realm Clinical Document Header" extension="2015-08-01" />
  <templateId root="2.16.840.1.113883.10.20.22.1.1" assigningAuthorityName="US Realm Clinical Document Header" />
  <templateId root="2.16.840.1.113883.3.3251.1.1" assigningAuthorityName="HL7 Security" />
  <templateId root="2.16.840.1.113883.10.20.22.1.2" assigningAuthorityName="Consolidated CDA - CCD Document" extension="2015-08-01" />
  <templateId root="2.16.840.1.113883.10.20.22.1.2" assigningAuthorityName="Consolidated CDA - CCD Document" />
  <id root="2.16.840.1.113883.3.140.1.7102526.5.1.20120892.30086495" />
  <code code="34133-9" displayName="Summarization of Episode Note" codeSystem="2.16.840.1.113883.6.1" codeSystemName="LOINC" />
  <title>SmartViewMD.com + BelleIT.net -- Belle IT Inc.</title>
  <effectiveTime value="20201208131446-0500" />
  <confidentialityCode code="N" displayName="Normal" codeSystem="2.16.840.1.113883.5.25" codeSystemName="Confidentiality" />
  <languageCode code="en-US" />
  <recordTarget>
    <patientRole>
      <addr>
        <streetAddressLine>${patient.address.stringValue}</streetAddressLine>
        <city>${patient.city.stringValue}</city>
        <state>${patient.state.stringValue}</state>
        <country>US</country>
        <postalCode>${patient.zip.stringValue}</postalCode>
      </addr>
      <telecom value="tel:+1 ${patient.phone.stringValue}" use="HP" />
      <telecom value="mailto:${patient.email.stringValue}" />
      <patient>
        <name>${patient.name.stringValue}</name>
        <administrativeGenderCode code="${patient.gender.stringValue.charAt(0)}" displayName="${patient.gender.stringValue}" codeSystem="2.16.840.1.113883.5.1" codeSystemName="AdministrativeGender" />
        <birthTime value="${patient.dob.stringValue}" />
      </patient>
    </patientRole>
  </recordTarget>
  <author>
    <templateId root="2.16.840.1.113883.3.3251.1.2" assigningAuthorityName="HL7 Security" />
    <time value="20201208131446-0500" />
    <assignedAuthor>
      <templateId root="2.16.840.1.113883.3.3251.1.3" assigningAuthorityName="HL7 Security" />
      <id root="2.16.840.1.113883.3.140.1.7102526.5.2" extension="2235" />
      <addr>
        <city>Coral Springs</city>
        <state>FL</state>
        <country>US</country>
        <postalCode>33076</postalCode>
      </addr>
      <telecom use="WP" value="tel:+1 754 300 9470" />
      <assignedPerson>
        <name>SmartViewMD.com BelleIT.net</name>
      </assignedPerson>
    </assignedAuthor>
  </author>
  <component>
    <structuredBody>
      <component>
        <section>
          <templateId root="2.16.840.1.113883.10.20.22.2.4.1"/>
          <templateId root="2.16.840.1.113883.10.20.22.2.4.1" extension="2015-08-01"/>
          <code code="8716-3" codeSystem="2.16.840.1.113883.6.1" codeSystemName="LOINC"
            displayName="Vital Signs (Home Readings)"/>
          <title>SmartViewMD.com Medical Device Readings</title>
          <text>
            <table border="1">
              <thead>
                <tr>
                  <th>Submitted</th>
                  <th>Device</th>
                  <th>Reading</th>
                  <th>Date Time</th>
                  <th>Note</th>
                  <th>Doctor</th>
                </tr>
              </thead>
              <tbody>
                <tr>${readingTableRow}</tr>
              </tbody>
            </table>
          </text>
        </section>
      </component>
     </structuredBody>
  </component>
</ClinicalDocument>`

        }
      ]

    };
  
    //await mailTransport.sendMail(mailOptions);
    //console.log('provider update email sent for:', email);

    //console.log('mailOptions: ' , mailOptions.attachments[0].content)
    console.log('mailOptions: ' , mailOptions.attachments[0].filename)
    return mailOptions.attachments;
  }
  


module.exports = sendRecordAddedEmail;

