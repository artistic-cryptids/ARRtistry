import * as React from 'react'
import { BrowserRouter, Route, RouteProps } from 'react-router-dom'

const RouterContext = React.createContext<Partial<RouteProps>>({});

export const BrowserRouterProvider: React.FC = ({ children }) => (
  <BrowserRouter>
    <Route>
      {(routeProps: RouteProps) => (
        <RouterContext.Provider value={routeProps}>
          {children}
        </RouterContext.Provider>
      )}
    </Route>
  </BrowserRouter>
);

export const useBrowserRouterContext = () => React.useContext(RouterContext)
