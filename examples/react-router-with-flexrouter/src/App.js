import React, { useEffect, useState } from 'react';
import { createBrowserHistory } from 'history';
import logo from './logo.svg';
import './App.css';
import MatchPath from '../../../dist';

const history = createBrowserHistory();
const r  = new MatchPath();

const Dashboard = () => (
  <div>Dashboard</div>
)

const User = ({ params }) => (
  <div>User Name: {params.name}</div>
)

const Link = ({ path, children }) => {
  const pushState = (e) => {
    e.preventDefault();
    history.push(path)
  }
  return (
    <a onClick={pushState} href={path}>{children}</a>
  )
}

const routes = [
  { path: '/dashboard', component: Dashboard },
  { path: '/user/:name', component: User }
]

routes.forEach(route => {
  r.insert({
    path: route.path,
    data: route.component
  })
})

const App = () => {
  const [rc, setRC] = useState(null)

  useEffect(() => {
    setRC(r.lookup(window.location.pathname));

    const unlisten = history.listen((location, action) => {
      setRC(r.lookup(location.pathname));
    });

    return () => unlisten();
  })

  const RouteComponent = rc && rc.data ? rc.data : () => null;
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Link path="/dashboard">Dashboard</Link>
        <Link path="/user/vincent">User Vincent</Link>
        <RouteComponent params={rc && rc.params ? rc.params : null} />
      </header>
    </div>
  )
}

export default App;

