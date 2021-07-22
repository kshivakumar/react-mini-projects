import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";
import "./App.css";

const PROJECTS_LIST = ["calculator", "app-2", "app-3"];

const PROJECTS = new Map();
PROJECTS_LIST.forEach(proj =>
  PROJECTS.set(
    proj,
    React.lazy(() => import(`./${proj}/App`))
  )
);

function Navigation() {
  const navLinks = Array.from(PROJECTS.keys()).map((projId) => (
    <NavLink
      className="navLink"
      activeClassName="activeNavLink"
      key={`/${projId}`}
      to={`/${projId}`}
    >
      {projId
        .split("-")
        .map((t) => t[0].toUpperCase() + t.slice(1))
        .join(" ")}
    </NavLink>
  ));
  return <div className="navigation">{navLinks}</div>;
}

const Routes = () =>
  Array.from(PROJECTS.keys()).map((projId) => (
    <Route
      key={`/${projId}`}
      path={`/${projId}`}
      component={PROJECTS.get(projId)}
    />
  ));

const Intro = () => (
  <div className="intro">
    <h2>React mini projects</h2>
    <h4>Select the desired project on the left</h4>
  </div>
);

function App() {
  return (
    <Router>
      <div style={{ display: "flex" }}>
        <Navigation />
        <Switch>
          <React.Suspense fallback={null}>
            <div className="project">
              <Routes />
              <Route exact path="/">
                <Intro />
              </Route>
            </div>
          </React.Suspense>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
