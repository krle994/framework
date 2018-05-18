import { PropTypes } from 'prop-types';
import { Harmony } from './Harmony';
import history from './history'

class Link extends Harmony.Component {
  static propTypes = {
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    onClick: PropTypes.func
  };

  handleClick = e => {
    if (this.props.onClick) {
      this.props.onClick(e);
    }

    if (e.button !== 0) {
      return;
    }

    if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) {
      return;
    }

    if (e.defaultPrevented === true) {
      return;
    }

    e.preventDefault();

    if(this.props.to) {
      history.push(this.props.to);
    } else {
      history.push({
        pathname: e.currentTarget.pathname,
        search: e.currentTarget.search
      });
    }
  };

  harmonize() {
    const { to, ...props } = this.props;
    return <a href={history.createHref(to)} {...props} onClick={this.handleClick} />
  }
}

export default Link;
