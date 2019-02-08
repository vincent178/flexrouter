import React, { useEffect } from 'react';
import { createBrowserHistory } from 'history';
import logo from './logo.svg';
import './App.css';
const MatchPath = require('../../../dist').default;

const history = createBrowserHistory();
const r  = new MatchPath();

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

  useEffect(() => {
    const unlisten = history.listen((location, action) => {
      // location is an object like window.location
      console.log(action, location.pathname, location.state);
    });

    return unlisten;
  })

  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>

      <Route path="/user/:name" component={User} />
    </div>
  )
}

export default App;


const Dashboard = () => (
  <div>Dashboard</div>
)

const Route = ({ path, component }) => {

  useEffect(() => {

  })

}

const User = ({ name }) => (
  <h1>User Name: {name}</h1>
)

