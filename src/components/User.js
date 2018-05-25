import { Harmony } from '../Harmony';


export default class User extends Harmony.Component {

  harmonize() {
    const {
      name,
      username,
      avatar,
      company,
      publicRepos,
      publicGists,
      followers,
      following,
      location,
      membership,
      urlLink
    } = this.props

    return (
      <div className="panel">
        <div className="panel-title">
          <h1 className="panel-name">{name || 'Github User'}</h1>
        </div>
        <div className="panel-content">
          <div className="panel-avatar">
            <img className="img" src={avatar} />
            <button className="btn"><a className="link" href={urlLink} target="blank">View Profile</a></button>
          </div>
          <div className="panel-info">
            <span className="panel-user-activity followers">Followers: {followers}</span>
            <span className="panel-user-activity following">Following: {following}</span>
            <span className="panel-user-activity gists">Gists: {publicGists}</span>
            <span className="panel-user-activity repos">Repos: {publicRepos}</span>
            <ul className="panel-user-info">
              <li className="panel-user-info-item"><b>Company: </b>{company || 'No info provided'}</li>
              <li className="panel-user-info-item"><b>Location: </b>{location || 'No info provided'}</li>
              <li className="panel-user-info-item"><b>Username: </b>{username}</li>
              <li className="panel-user-info-item"><b>Member since: </b>{membership.substring(0, 10)}</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

}
