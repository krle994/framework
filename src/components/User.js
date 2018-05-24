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
      <div>
        <h1>{name}</h1>
        <img src={avatar} />
        <h2>{company}</h2>
        <h2>{location}</h2>
        <h2>{username}</h2>
        <h2>{membership}</h2>
        <span>{followers} followers</span>
        <br/>
        <span>{following} following</span>
        <br/>
        <span>{publicGists} gists</span>
        <br/>
        <span>{publicRepos} repos</span>
      </div>
    );
  }

}
