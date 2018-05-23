import { Harmony } from './Harmony';
import Header from './components/Header';




class App extends Harmony.Component {
  constructor() {
    super();
    this.state = {
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

  getUser(username) {
    return fetch (`https://api.github.com/users/${username}`)
             .then(response => response.json())
             .then(response => response);
  }

  async handleSubmit(e) {
    e.preventDefault();
    let user = await this.getUser(this.username.value);
    this.setState({
      name: user.name,
      username: user.login,
      avatar: user.avatar_url,
      company: user.company,
      publicRepos: user.public_repos,
      publicGists: user.public_gists,
      followers: user.followers,
      following: user.following,
      location: user.location,
      membership: user.created_at,
      urlLink: user.html_url
    })
  }

  harmonize() {
    let user;
    if(this.state.username) {
      user =
      <div>
      <img src={this.state.avatar} width="200" height="200" />
      <br/>
      <p>{this.state.name}</p>
      <br/>
      <p>{this.state.company}</p>
      <br/>
      <p>{this.state.followers}</p>
      <br/>
      <p>{this.state.location}</p>
      </div>
    }
    return (
      <div>
        <Header />
        <div className="container main-content">
          <h1>Search Github Users</h1>
          <form onSubmit={e => this.handleSubmit(e)}>
            <input type="text" id="searchUser" className="form-control" placeholder="Github Username..." />
          </form>
          <br/>
          <p>{user}</p>
        </div>
      </div>
    );
  }
}


let t0 = performance.now();
Harmony.harmonize(<App />, document.getElementById("root"));
let t1 = performance.now();
console.log(`${t1 - t0} milliseconds`);
