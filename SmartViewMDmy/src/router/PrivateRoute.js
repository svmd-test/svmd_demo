import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSession } from '../firebase/UserProvider';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { user, isAdmin, isDoctor } = useSession();

  return (
    <Route
      {...rest}
      render={(props) => {
        const id = props.match.params.id;

        if (user && (user.uid === id || !!isAdmin || !!isDoctor )) {
          return <Component {...props} />;
        } else {
          //return <Component {...props} />;
          return <Redirect to="/login" />;
        }
      }}
    />
  );
};

export default PrivateRoute;
// || 