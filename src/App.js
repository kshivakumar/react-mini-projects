import React from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  useLocation,
} from "react-router-dom"
import "./App.css"


const PROJECTS = {
  calculator: "A basic calculator similar to MacOS calculator in functionality",
  "date-picker": "Date picker with lower and upper bound years",
  stopwatch: "Stopwatch with minimal button re-renders",
}

const PROJECT_IDS = Array.from(Object.keys(PROJECTS))

const PROJECT_COMPONENTS = PROJECT_IDS.reduce(
  (components, projId) =>
    Object.assign(components, {
      [projId]: React.lazy(() => import(`./${projId}/App`)),
    }),
  {}
)

function Navigation() {
  const navLinks = PROJECT_IDS.map(projId => (
    <NavLink
      className="navLink"
      activeClassName="activeNavLink"
      key={`/${projId}`}
      to={`/${projId}`}
    >
      {projId
        .split("-")
        .map(t => t[0].toUpperCase() + t.slice(1))
        .join(" ")}
    </NavLink>
  ))
  return <div className="navigation">{navLinks}</div>
}

const Routes = () =>
  PROJECT_IDS.map(projId => (
    <Route
      key={`/${projId}`}
      path={`/${projId}`}
      component={PROJECT_COMPONENTS[projId]}
    />
  ))

const Intro = () => (
  <div className="intro">
    <h2>React mini projects</h2>
    <h4>Select the desired project on the left</h4>
  </div>
)

const Info = () => {
  const [showDesc, setShowDesc] = React.useState(false)
  const location = useLocation()
  
  React.useEffect(() => setShowDesc(false), [location])
  
  if (location.pathname === '/') return null
  
  const styles = {
    position: "fixed",
    right: "20px",
    bottom: "20px",
    zIndex: "99",
  }
  
  let content = null
  if (showDesc) {
    const projId = location.pathname.replace("/", "")
    content = <span style={{border: "solid 1px gray", padding: "7px"}}>{PROJECTS[projId]}</span>
  } else {
    content = <span style={{fontSize: "xx-large", border: "solid 2px", color: "skyblue"}}>&#x2139;</span>
  }
  return <div style={styles} onClick={() => setShowDesc(state => !state)}>{content}</div>
}

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
              <Info />
            </div>
          </React.Suspense>
        </Switch>
      </div>
    </Router>
  )
}

export default App
