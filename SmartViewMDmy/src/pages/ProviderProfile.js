import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSession } from '../firebase/UserProvider';
import { firestore } from '../firebase/config'; 
import { updateUserDocument } from '../firebase/user';
import SideMenu from '../SideMenu';
import JoinForm from '../components/JoinForm';
import { siteCode,siteLogo } from '../components/Doctors'

function ProviderProfile(props){
  const { user } = useSession();
  const params = useParams();
  const { register, setValue, handleSubmit } = useForm();
  const [userDocument, setUserDocument] = useState(null);
  const [isLoading, setLoading] = useState(false);
    
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
      await updateUserDocument({ uid: params.id, ...data });

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
          <hr />
          <div className="equal width fields">
            <div className="field">
              <label>
                Phone
                <input type="text" name="phone" ref={register} placeHolder="Required" />
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
                <input type="text" name="name" disabled ref={register} />
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
      </div>
    </div>
  );
};

export default ProviderProfile;
