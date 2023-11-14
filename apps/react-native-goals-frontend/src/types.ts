export type AuthData = {
  access_token: String;
  email: String;
};

export type AuthContextData = {
  accessTokenStateValue: string;
  loading: boolean;
  login: (email, password) => Promise<any>;
  register: (email, password) => Promise<any>;
  updateAccessTokenInContext: (access_token) => void;
  logOut: () => void;
};

export type GoalType = {
  title: string;
  maxScore: number;
  minScore: number;
  actualScore: number;
  id: number;
  userIdRef: number;
  timestamp: number;
};

export type FormProps = {
  goalToEditId?: number;
  titleToEdit?: string;
  maxScoreToEdit?: string;
  mode?: string;
  onGoalFormSubmit?: any;
};

export type goalStorageKey = string;
