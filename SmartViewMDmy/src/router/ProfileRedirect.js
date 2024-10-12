import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSession } from '../firebase/UserProvider';

const ProfileRedirect = ({ component: Component, ...rest }) => {
  const { user, isAdmin , isDoctor } = useSession();

  return (
    <Route
      {...rest}
      render={(props) =>
        !user ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: isAdmin ? '/users' : isDoctor ? '/patients' : `/profile/${user.uid}`,
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

export default ProfileRedirect;
