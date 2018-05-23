import { Harmony } from '../Harmony';


export default class Header extends Harmony.Component {
  harmonize() {
    return (
      <header>
        <div className="container header-content">
          <div className="brand">
            <h1>Github Finder App</h1>
          </div>
        </div>
      </header>
    );
  }
}
