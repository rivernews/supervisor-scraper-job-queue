
import React from 'react';
import { AuthCredentials } from "./auth.types";

export interface IAppContext {
    authCredentials: AuthCredentials;
    setAuthCredentials: React.Dispatch<React.SetStateAction<AuthCredentials>>;
}
