import { Harmony } from './Harmony';
import Header from './components/Header';
import User from './components/User'

class App extends Harmony.Component {

  constructor() {
    super();
    this.state = {
      login: null,
      name: null,
      username: null,
      avatar: null,
      company: null,
      publicRepos: null,
      publicGists: null,
      followers: null,
      following: null,
      location: null,
      membership: null,
      urlLink: null
    }
  }

  async getUser(username) {
    const clientID = '1d0e4136b5c95bba3a6d';
    const clientSecret = '5875c88c0e2934998dc0f42b996f9614ee00d903';
    const apiCall = await fetch (`https://api.github.com/users/${username}?client_id=${clientID}&client_secret=${clientSecret}`);

    const data = await apiCall.json();
    console.log(data);
    return { data };
  }

  showUser() {
    this.getUser(this.state.login)
      .then(res => {
        this.setState({
          name: res.data.name,
          username: res.data.login,
          avatar: res.data.avatar_url,
          company: res.data.company,
          publicRepos: res.data.public_repos,
          publicGists: res.data.public_gists,
          followers: res.data.followers,
          following: res.data.following,
          location: res.data.location,
          membership: res.data.created_at,
          urlLink: res.data.html_url
        });
      });
  }

  inputValue(e) {
    e.preventDefault();
    this.setState({
      login: e.target.value
    });
    console.log(this.state.login);
  }

  harmonize() {
    return (
      <div>
        <Header />
        <div className="container main-content">
          <h1>Search Github Users</h1>
          <form onSubmit={e => e.preventDefault()}>
            <input type="text" value={this.state.login} onKeyUp={e => {
              this.inputValue(e);
              this.showUser();
            }} className="form-control" placeholder="Github Username..." />
          </form>
          <br/>
          {this.state.username ? <User
          name={this.state.name}
          username={this.state.username}
          avatar={this.state.avatar}
          company={this.state.company}
          publicRepos={this.state.publicRepos}
          publicGists={this.state.publicGists}
          followers={this.state.followers}
          following={this.state.following}
          location={this.state.location}
          membership={this.state.membership}
          urlLink={this.state.urlLink} />
          : ''}
        </div>
      </div>
    );
  }
}


let t0 = performance.now();

Harmony.harmonize(<App />, document.getElementById("root"));
let t1 = performance.now();
console.log(`${t1 - t0} milliseconds`);
