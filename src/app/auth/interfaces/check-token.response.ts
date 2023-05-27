

import { User } from "./user.interface";


export interface CheckTokenResponse {
  accessToken: string;
  user:        User;
}


