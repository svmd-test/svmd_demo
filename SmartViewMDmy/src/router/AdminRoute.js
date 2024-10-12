import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSession } from '../firebase/UserProvider';

const AdminRoute = ({ component: Component, ...rest }) => {
  const { user, isAdmin } = useSession();

  return (
    <Route
      {...rest}
      render={(props) => {
        console.log("USER ",user?.uid);
        if (!!user && ( isAdmin )) { // user.uid === "nSCsRzbt9qfzMYecj0anxq7jzft1" 
          return <Component {...props} />;
        } else {
          return <Redirect to="/login" />;
        }
      }}
    />
  );
};

export default AdminRoute;
