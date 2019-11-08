import React from "react"
import { SessionProvider } from "../providers/SessionProvider"
import Router from "./Router"

export const App = () => {
  return (
    <SessionProvider>
      <Router/>
    </SessionProvider>
  )
}
