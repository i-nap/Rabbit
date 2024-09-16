
export interface UserState {
    isLoggedIn: boolean;
    token: string | null;
    userInfo: UserInfo | null;
  }
  
  export interface UserInfo {
    name: string;
    email: string;
    profilePicture?: string;
  }
  