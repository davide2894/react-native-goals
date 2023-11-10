import { createContext } from "react";
import { AuthContextData } from "../types";

const AuthContext = createContext({} as AuthContextData);

export default AuthContext;
