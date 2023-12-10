export type AuthData = {
  access_token: String;
  email: String;
};

export type AuthTokens = {
  access_token: String;
  refresh_token: String;
};

export type AuthContextData = {
  authTokensStateValues: AuthTokens;
  loading: boolean;
  updateAuthTokensInContext: (access_token, refresh_token) => void;
  resetAuthTokensInContext: () => void;
  logOut: () => Promise<void>;
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

export type GoalsQueryResult = {
  userGoals: Array<GoalType>;
};
