import { useContext, useEffect, useState } from "react";
import { getAccessTokenFromStorage } from "../../utils/accessToken";
import AuthContext from "../../contexts/authContext";

function AuthProvider({ children }) {
  console.log("\n");
  console.log("\n");
  console.log("\n");
  console.log("------------------------------------------------------------");
  console.log("AuthProvider of context --> component rendered");
  const [accessTokenStateValue, setAccessTokenStateValue] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthProvider of context --> inside useEffect");
    const tryGetAccessToken = async () => {
      console.log(
        "AuthProvider of context --> inside useEffect --> tryGetAccessToken() called"
      );
      const access_token = await getAccessTokenFromStorage();
      console.log({
        msg: "retrieving access token",
        accessToken: {
          storage: access_token,
          state: accessTokenStateValue,
        },
      });
      if (access_token) {
        console.log(
          "AuthProvider of context --> inside useEffect --> updating access token state with token in storage"
        );
      }
      setAccessTokenStateValue(await getAccessTokenFromStorage());
    };

    try {
      console.log("tryGetAccessToken() executed");
      tryGetAccessToken();
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  }, [accessTokenStateValue, setAccessTokenStateValue, setLoading]);

  function updateAccessTokenInContext(access_token: string) {
    console.log("Auth provider: updating access token state");
    setAccessTokenStateValue(access_token);
  }

  async function logOut() {
    console.log("AuthProvider.tsx ---> logout after pressing singout button");
    setAccessTokenStateValue("");
  }

  return (
    <AuthContext.Provider
      value={{
        accessTokenStateValue,
        loading,
        updateAccessTokenInContext,
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
        state: context.accessTokenStateValue,
      },
    });

    return context;
  }
}

export { AuthProvider, useAuthContext };
