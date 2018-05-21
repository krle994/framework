import { Harmony } from './Harmony';
import { PropTypes } from 'prop-types';

let instances = [];

const register = (comp) => instances.push(comp);

const historyPush = (path) => {
  history.pushState({}, null, path);
  instances.forEach(instance => instance.forceUpdate());
}

const historyReplace = (path) => {
  history.replaceState({}, null, path);
  instances.forEach(instance => instance.forceUpdate());
}

const matchPath = (pathname, options) => {
  const { exact = false, path } = options;

  if (!path) {
    return {
      path: null,
      url: pathname,
      isExact: true
    };
  }

  const match = new RegExp(`^${path}`).exec(pathname);

  if (!match)
    return null;

  const url = match[0];
  const isExact = pathname === url;

  if (exact && !isExact)
    return null;

  return {
    path,
    url,
    isExact
  };
}

export class Route extends Harmony.Component {


  componentWillMount() {
    console.log('mounted');
    addEventListener("popstate", this.handlePop);
    register(this);
  }

  handlePop() {
    this.forceUpdate();
  }

  harmonize() {
    const {
      path,
      exact,
      component,
      harmonize
    } = this.props;

    const match = matchPath(location.pathname, { path, exact });

    if (component)
      return Harmony.createElement(component, { match });

    if (harmonize)
      return harmonize({ match });

  }
}

class Link extends Harmony.Component {

  handleClick(event) {
    const { replace, to } = this.props;

    event.preventDefault()
    replace ? historyReplace(to) : historyPush(to);
  }

  harmonize() {
    const { to, children} = this.props;

    return (
      <a href={to} onClick={this.handleClick}>
        {children}
      </a>
    )
  }
}

export class Redirect extends Harmony.Component {
  static defaultProps() {
    return {
      push: false
    }
  }


  componentDidMount() {
    const { to, push } = this.props;
    push ? historyPush(to) : historyReplace(to);
  }

  harmonize() {
    return null;
  }
}

export default Link;
