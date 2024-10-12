import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSession } from '../firebase/UserProvider';

const DoctorRoute = ({ component: Component, ...rest }) => {
  const { user, isDoctor } = useSession();

  return (
    <Route
      {...rest}
      render={(props) => {
        //console.log("USER ",user?.uid);
        if (!!user && ( isDoctor )) {
          return <Component {...props} />;
        } else {
          return <Redirect to="/login" />;
        }
      }}
    />
  );
};

export default DoctorRoute;
