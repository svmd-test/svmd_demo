name=`NAME`
address=`ADDR`
cityName='cityName'
stateCode='SC'
zip='ZZZZZ'
phone=`PHONE`
dob='YMD'
email='eMAIL'
template=`<ClinicalDocument xmlns="urn:hl7-org:v3" xmlns:sdtc="urn:hl7-org:sdtc" xmlns:voc="urn:hl7-org:v3/voc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:hl7-org:v3 CDA.xsd">
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
        <streetAddressLine>${address}</streetAddressLine>
        <city>${cityName}</city>
        <state>${stateCode}</state>
        <country>US</country>
        <postalCode>${zip}</postalCode>
      </addr>
      <telecom value="tel:+1 ${phone}" use="HP" />
      <telecom value="mailto:${email}" />
      <patient>
        <name>${name}</name>
        <administrativeGenderCode code="M" displayName="Male" codeSystem="2.16.840.1.113883.5.1" codeSystemName="AdministrativeGender" />
        <birthTime value="${dob}" />
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
            displayName="Vital Signs"/>
          <title>Vital Signs (Last Filed)</title>
          <text>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Blood Pressure</th>
                  <th>Pulse</th>
                  <th>Temperature</th>
                  <th>Respiratory Rate</th>
                  <th>Height</th>
                  <th>Weight</th>
                  <th>BMI</th>
                  <th>SpO2</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>05/20/2014 7:36pm</td>
                  <!-- You can consolidate Systolic and Diastolic in human view if desired but should retain separate references-->
                  <td>
                    <content ID="SystolicBP_2">120</content>/<content ID="DiastolicBP_2"
                      >80</content>mm[Hg] </td>
                  <td ID="Pulse_2">80 /min</td>
                  <td ID="Temp_2">99.0 F</td>
                  <td ID="RespRate_2">18 /min</td>
                  <td ID="Height_2">5'7 (67 inches)</td>
                  <td ID="Weight_2">210.9 lbs</td>
                  <td ID="BMI_2">37.58 kg/m2</td>
                  <td ID="SPO2_2">98%</td>
                </tr>
                <tr>
                  <td>05/21/2014 7:36pm</td>
                  <!-- You can consolidate Systolic and Diastolic in human view if desired but should retain separate references-->
                  <td>
                    <content ID="SystolicBP_2">121</content>/<content ID="DiastolicBP_2"
                      >80</content>mm[Hg] </td>
                  <td ID="Pulse_2">81 /min</td>
                  <td ID="Temp_2">98.0 F</td>
                  <td ID="RespRate_2">19 /min</td>
                  <td ID="Height_2">5'7 (67 inches)</td>
                  <td ID="Weight_2">211.9 lbs</td>
                  <td ID="BMI_2">37.68 kg/m2</td>
                  <td ID="SPO2_2">99%</td>
                </tr>
              </tbody>
            </table>
          </text>
          <entry typeCode="DRIV">
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
              <component>
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
                  <effectiveTime value="20140520193605-0500"/>
                  <!-- Example of Value with UCUM unit. Note that mixed metric and imperial units used in this example-->
                  <value xsi:type="PQ" value="120" unit="mm[Hg]"/>
                  <!-- Additional information of interpretation and/or reference range may be included but are optional-->
                </observation>
              </component>
              <component>
                <observation classCode="OBS" moodCode="EVN">
                  <templateId root="2.16.840.1.113883.10.20.22.4.27"/>
                  <templateId root="2.16.840.1.113883.10.20.22.4.27" extension="2014-06-09"/>
                  <id root="88a01c83-a096-4705-a992-b5f59eca8c8c"/>
                  <code code="8462-4" codeSystem="2.16.840.1.113883.6.1" codeSystemName="LOINC"
                    displayName="DIASTOLIC BLOOD PRESSURE"/>
                  <text>
                    <reference value="#DiastolicBP_2"/>
                  </text>
                  <statusCode code="completed"/>
                  <effectiveTime value="20140520193605-0500"/>
                  <value xsi:type="PQ" value="80" unit="mm[Hg]"/>
                </observation>
              </component>
              <component>
                <observation classCode="OBS" moodCode="EVN">
                  <templateId root="2.16.840.1.113883.10.20.22.4.27"/>
                  <templateId root="2.16.840.1.113883.10.20.22.4.27" extension="2014-06-09"/>
                  <id root="83bbffe1-54e5-4984-a32d-ad8f8d6896d8"/>
                  <code code="8867-4" codeSystem="2.16.840.1.113883.6.1" codeSystemName="LOINC"
                    displayName="HEART RATE"/>
                  <text>
                    <reference value="#Pulse_2"/>
                  </text>
                  <statusCode code="completed"/>
                  <effectiveTime value="20140520193605-0500"/>
                  <value xsi:type="PQ" value="80" unit="/min"/>
                </observation>
              </component>
              <component>
                <observation classCode="OBS" moodCode="EVN">
                  <templateId root="2.16.840.1.113883.10.20.22.4.27"/>
                  <templateId root="2.16.840.1.113883.10.20.22.4.27" extension="2014-06-09"/>
                  <id root="85f5784f-2958-4321-b7b6-3030d1577dc0"/>
                  <code code="8310-5" codeSystem="2.16.840.1.113883.6.1" codeSystemName="LOINC"
                    displayName="BODY TEMPERATURE"/>
                  <text>
                    <reference value="#Temp_2"/>
                  </text>
                  <statusCode code="completed"/>
                  <effectiveTime value="20140520193605-0500"/>
                  <!-- Note the UCUM conformant way to specify degrees Farenheit-->
                  <value xsi:type="PQ" value="99.0" unit="[degF]"/>
                </observation>
              </component>
              <component>
                <observation classCode="OBS" moodCode="EVN">
                  <templateId root="2.16.840.1.113883.10.20.22.4.27"/>
                  <templateId root="2.16.840.1.113883.10.20.22.4.27" extension="2014-06-09"/>
                  <id root="b618fa98-6596-4e19-a9e7-6bdb48012fc8"/>
                  <code code="9279-1" codeSystem="2.16.840.1.113883.6.1" codeSystemName="LOINC"
                    displayName="RESPIRATORY RATE"/>
                  <text>
                    <reference value="#RespRate_2"/>
                  </text>
                  <statusCode code="completed"/>
                  <effectiveTime value="20140520193605-0500"/>
                  <value xsi:type="PQ" value="18" unit="/min"/>
                </observation>
              </component>
              <component>
                <observation classCode="OBS" moodCode="EVN">
                  <templateId root="2.16.840.1.113883.10.20.22.4.27"/>
                  <templateId root="2.16.840.1.113883.10.20.22.4.27" extension="2014-06-09"/>
                  <id root="1b1274a9-b45f-449a-8493-08eaeaeba7d6"/>
                  <code code="8302-2" codeSystem="2.16.840.1.113883.6.1" codeSystemName="LOINC"
                    displayName="HEIGHT"/>
                  <text>
                    <reference value="#Height_2"/>
                  </text>
                  <statusCode code="completed"/>
                  <effectiveTime value="20140520193605-0500"/>
                  <!-- Note the UCUM conformant way to specify inches-->
                  <value xsi:type="PQ" value="67" unit="[in_us]"/>
                </observation>
              </component>
              <component>
                <observation classCode="OBS" moodCode="EVN">
                  <templateId root="2.16.840.1.113883.10.20.22.4.27"/>
                  <templateId root="2.16.840.1.113883.10.20.22.4.27" extension="2014-06-09"/>
                  <id root="1c1f89f1-8e93-4a46-b37f-9434f99727b8"/>
                  <code code="29463-7" codeSystem="2.16.840.1.113883.6.1" codeSystemName="LOINC"
                    displayName="WEIGHT"/>
                  <text>
                    <reference value="#Weight_2"/>
                  </text>
                  <statusCode code="completed"/>
                  <effectiveTime value="20140520193605-0500"/>
                  <!-- Note the UCUM conformant way to specify pounds-->
                  <value xsi:type="PQ" value="239.9" unit="[lb_av]"/>
                </observation>
              </component>
              <component>
                <observation classCode="OBS" moodCode="EVN">
                  <templateId root="2.16.840.1.113883.10.20.22.4.27"/>
                  <templateId root="2.16.840.1.113883.10.20.22.4.27" extension="2014-06-09"/>
                  <id root="fd4ccd0b-c045-4587-8976-a17e2e064a1e"/>
                  <code code="39156-5" codeSystem="2.16.840.1.113883.6.1" codeSystemName="LOINC"
                    displayName="BODY MASS INDEX"/>
                  <text>
                    <reference value="#BMI_2"/>
                  </text>
                  <statusCode code="completed"/>
                  <effectiveTime value="20140520193605-0500"/>
                  <value xsi:type="PQ" value="37.58" unit="kg/m2"/>
                </observation>
              </component>
              <component>
                <observation classCode="OBS" moodCode="EVN">
                  <templateId root="2.16.840.1.113883.10.20.22.4.27"/>
                  <templateId root="2.16.840.1.113883.10.20.22.4.27" extension="2014-06-09"/>
                  <id root="0ef4afda-1638-4ad2-9978-7321bbceb0cb"/>
                  <code code="2710-2" codeSystem="2.16.840.1.113883.6.1" codeSystemName="LOINC"
                    displayName="OXYGEN SATURATION"/>
                  <text>
                    <reference value="#SPO2_2"/>
                  </text>
                  <statusCode code="completed"/>
                  <effectiveTime value="20140520193605-0500"/>
                  <value xsi:type="PQ" value="98" unit="%"/>
                  </observation>
              </component>
            </organizer>
          </entry>
        </section>
      </component>
     </structuredBody>
  </component>
</ClinicalDocument>`

console.log(template)