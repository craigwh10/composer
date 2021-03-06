import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Home } from "../screens/Home";

export const Routes = () => {
   return (
      <Router>
         <div>
            <nav>
               <ul>
                  <li>
                     <Link to="/">Home</Link>
                  </li>
                  <li>
                     <a href="https://github.com/craigwh10/composer/issues">
                        Report issue
                     </a>
                  </li>
               </ul>
            </nav>

            <Switch>
               <Route path="/">
                  <Home />
               </Route>
            </Switch>
         </div>
      </Router>
   );
};
