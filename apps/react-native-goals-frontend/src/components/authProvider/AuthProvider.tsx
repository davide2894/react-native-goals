import React, { createContext, useContext, useEffect, useState } from "react";
import { getAccessToken } from "../../utils/accessToken";

const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    const tryGetAccessToken = async () => {
      const access_token = await getAccessToken();
      if (access_token) {
        setAccessToken(accessToken);
      }
    };

    try {
      tryGetAccessToken();
    } catch (error) {}
  }, []);

  function login() {}
  function register() {}

  return (
    <AuthContext.Provider value={{ accessToken, login, register }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuthContext() {
  const context = useContext(AuthContext);
  if (context) {
    return context;
  }
}

export {
  AuthProvider,
  useAuthContext,
  // useaccessToken,
  // login,
  // register
};
