import React, { useEffect, useState, useContext } from 'react';
import firebase from 'firebase/app';

export const UserContext = React.createContext();

export const UserProvider = (props) => {
  const [session, setSession] = useState({
    user: null,
    loading: true,
    isAdmin: false,
    isDoctor: false,
  });

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      let isAdmin = false;
      let isDoctor = false;

      if (user) {
        const token = await user.getIdTokenResult();
        isAdmin = token.claims.admin;
        isDoctor = token.claims.doctor;
      }

      setSession({ loading: false, user, isAdmin, isDoctor });
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={session}>
      {!session.loading && props.children}
    </UserContext.Provider>
  );
};

export const useSession = () => {
  const session = useContext(UserContext);
  return session;
};
