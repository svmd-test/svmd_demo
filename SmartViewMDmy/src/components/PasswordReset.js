import React, { useState } from "react";
import { useForm } from 'react-hook-form';
//import { Link } from "@reach/router";
import { Link } from 'react-router-dom';
import { sendResetEmail } from '../firebase/auth';
import { continueUrl } from './Doctors'

const PasswordReset = (props) => {
  const { register, handleSubmit, reset } = useForm();
  //const [email, setEmail] = useState("");
  const [emailHasBeenSent, setEmailHasBeenSent] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    console.log(data)
    setLoading(true);
    let user;
    try {
        user = await sendResetEmail(data.userEmail, continueUrl)
        setEmailHasBeenSent(true)
        reset();
    } catch (error) {
        console.log(error);
        setError("Error resetting password");
    }

    if (user) {
      props.history.push(`/profile/${user.uid}`);
    } else {
      setLoading(false);
    }
  
  }

  const formClassName = `ui form ${isLoading ? 'loading' : ''}`;

  return (
    <div className="mt-8">
      <h1 className="text-xl text-center font-bold mb-3">
        Reset your Password
      </h1>
      <div className="border border-blue-300 mx-auto w-11/12 md:w-2/4 rounded py-8 px-4 md:px-8">
        <form className={formClassName} onSubmit={handleSubmit(onSubmit)}>
          {emailHasBeenSent && (
            <div className="py-3 bg-green-400 w-full text-center mb-3">
              An email has been sent to you!
            </div>
          )}
          {error !== null && (
            <div className="py-3 bg-red-600 w-full text-green text-center mb-3">
              {error}
            </div>
          )}
          <label htmlFor="userEmail" className="w-full block">
            Email:
          </label>
          <input
            type="email"
            name="userEmail"
            id="userEmail"
            ref={register}
            placeholder="Input your email"
            className="mb-3 w-full px-1 py-2"
          />
          <button
            className="ui primary button login" type="submit"
          >
            Send me a reset link
          </button>
        </form>
        <Link to ="/">
          &larr; Back to Login sign-in page
        </Link>
      </div>
    </div>
  );
};
export default PasswordReset;