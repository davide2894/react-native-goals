import AppStack from "../appStack/AppStack";
import { useAuthContext } from "../authProvider/AuthProvider";
import AuthStack from "../authStack/AuthStack";

function Router() {
  const accessToken = useAuthContext();
  return accessToken ? <AppStack /> : <AuthStack />;
}

export default Router;
