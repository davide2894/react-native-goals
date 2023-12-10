import { useContext, useEffect, useState } from "react";
import { getAccessTokenFromStorage } from "../../utils/accessToken";
import AuthContext from "../../contexts/authContext";
import { getRefreshTokenFromStorage } from "../../utils/refreshToken";

function AuthProvider({ children }) {
  console.log("\n");
  console.log("\n");
  console.log("\n");
  console.log("------------------------------------------------------------");
  console.log("AuthProvider of context --> component rendered");
  const [authTokenStateValues, setAuthTokenStateValues] = useState({
    access_token: "",
    refresh_token: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthProvider of context --> inside useEffect");
    const tryGetAccessToken = async () => {
      console.log(
        "AuthProvider of context --> inside useEffect --> tryGetAccessToken() called"
      );
      const accessTokenFromStorage = await getAccessTokenFromStorage();
      const refreshTokenFromStorage = await getRefreshTokenFromStorage();
      console.log({
        msg: "retrieving access token",
        authTokenValuesFromStorage: {
          accessTokenFromStorage,
          refreshTokenFromStorage,
          accessTokenStateValue: authTokenStateValues,
        },
      });
      if (accessTokenFromStorage) {
        console.log(
          "AuthProvider of context --> inside useEffect --> updating access token state with token in storage"
        );
      }

      setAuthTokenStateValues({
        access_token: accessTokenFromStorage,
        refresh_token: refreshTokenFromStorage,
      });
    };

    try {
      console.log("tryGetAccessToken() executed");
      tryGetAccessToken();
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  }, [
    authTokenStateValues.access_token,
    authTokenStateValues.refresh_token,
    setAuthTokenStateValues,
    setLoading,
  ]);

  function updateAuthTokensInContext(accessTokenNewValue: string) {
    console.log("Auth provider: updating access token state");
    setAuthTokenStateValues({
      ...authTokenStateValues,
      access_token: accessTokenNewValue,
    });
  }

  function resetAuthTokensInContext() {
    console.log(
      "AuthProvider ----> resetting both access and refresh token states"
    );

    setAuthTokenStateValues({
      access_token: "",
      refresh_token: "",
    });
  }

  async function logOut() {
    console.log("AuthProvider.tsx ---> logout after pressing singout button");
    setAuthTokenStateValues({
      access_token: "",
      refresh_token: "",
    });
  }

  return (
    <AuthContext.Provider
      value={{
        authTokensStateValues: authTokenStateValues,
        loading,
        updateAuthTokensInContext,
        resetAuthTokensInContext,
        logOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuthContext() {
  const context = useContext(AuthContext);
  console.log("useAutContext called");
  if (context) {
    console.log("useAuthContext ---> this is the retrieved auth context info");
    console.log({
      msg: "retrieving access token",
      accessToken: {
        state: context.authTokensStateValues,
      },
    });

    return context;
  }
}

export { AuthProvider, useAuthContext };
