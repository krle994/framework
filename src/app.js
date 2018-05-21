import { Harmony } from './Harmony';
import Link, { Route, Redirect } from './router';


class Home extends Harmony.Component {
  harmonize() {
    return (
      <h2>Home</h2>
    );
  }
}

class About extends Harmony.Component {
  harmonize() {
    return (
      <h2>About</h2>
    );
  }
}

class Topic extends Harmony.Component {
  harmonize() {
    return (
      <h2>Topic</h2>
    );
  }
}

class App extends Harmony.Component {

  harmonize() {
    console.log(About);
    return (
      <div>
        <ul>
          <li><Link to="/about">About</Link></li>
        </ul>

        <Route path="/about" component={About}/>
      </div>
    );
  }
}

Harmony.harmonize(<App />, document.getElementById("root"));
