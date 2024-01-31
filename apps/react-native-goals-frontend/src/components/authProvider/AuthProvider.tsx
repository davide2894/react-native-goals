import { useContext, useEffect, useState } from "react";
import { getAccessTokenFromStorage } from "../../utils/accessToken";
import AuthContext from "../../contexts/authContext";
import { getRefreshTokenFromStorage } from "../../utils/refreshToken";
import { devModeLog } from "dev-mode-log";

function AuthProvider({ children }) {
  devModeLog("\n");
  devModeLog("\n");
  devModeLog("\n");
  devModeLog("------------------------------------------------------------");
  devModeLog("AuthProvider of context --> component rendered");
  const [authTokenStateValues, setAuthTokenStateValues] = useState({
    access_token: "",
    refresh_token: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    devModeLog("AuthProvider of context --> inside useEffect");
    const tryGetAccessToken = async () => {
      devModeLog(
        "AuthProvider of context --> inside useEffect --> tryGetAccessToken() called"
      );
      const accessTokenFromStorage = await getAccessTokenFromStorage();
      const refreshTokenFromStorage = await getRefreshTokenFromStorage();
      devModeLog({
        msg: "retrieving access token",
        authTokenValuesFromStorage: {
          accessTokenFromStorage,
          refreshTokenFromStorage,
          accessTokenStateValue: authTokenStateValues,
        },
      });
      if (accessTokenFromStorage) {
        devModeLog(
          "AuthProvider of context --> inside useEffect --> updating access token state with token in storage"
        );
      }

      setAuthTokenStateValues({
        access_token: accessTokenFromStorage,
        refresh_token: refreshTokenFromStorage,
      });
    };

    try {
      devModeLog("tryGetAccessToken() executed");
      tryGetAccessToken();
    } catch (error) {
      devModeLog({ error });
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
    devModeLog("Auth provider: updating access token state");
    setAuthTokenStateValues({
      ...authTokenStateValues,
      access_token: accessTokenNewValue,
    });
  }

  function resetAuthTokensInContext() {
    devModeLog(
      "AuthProvider ----> resetting both access and refresh token states"
    );

    setAuthTokenStateValues({
      access_token: "",
      refresh_token: "",
    });
  }

  async function logOut() {
    devModeLog("AuthProvider.tsx ---> logout after pressing singout button");
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
  devModeLog("useAutContext called");
  if (context) {
    devModeLog("useAuthContext ---> this is the retrieved auth context info");
    devModeLog({
      msg: "retrieving access token",
      accessToken: {
        state: context.authTokensStateValues,
      },
    });

    return context;
  }
}

export { AuthProvider, useAuthContext };
