// Context w/o default value

import { IAppContext } from "../types/app.types";

import { useContext, createContext } from "react";

// https://fettblog.eu/typescript-react/context/#context-without-default-values
export const AppContext = createContext<Partial<IAppContext>>({});

export function useAppContext() {
  return useContext(AppContext);
};
