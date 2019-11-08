import React from "react"
import { SessionProvider } from "../providers/SessionProvider"
import Router from "./Router"

export const App: React.FC = () => {
  return (
    <SessionProvider>
      <Router/>
    </SessionProvider>
  );
}
