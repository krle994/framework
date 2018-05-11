import { VirtualDOM } from './virtualDOM';

const MyComponent = ({quote, author}) => {
  return (
    <div className="quote-container">
      <h4 className="quote">"{quote}"</h4>
      <div className="author">- {author}</div>
    </div>
  );
};

const $root = document.getElementById('root');
const $reload = document.getElementById('reload');


VirtualDOM.updateElement($root,
  <MyComponent
  quote="-the only source of knowledge is experience."
  author="Albert Einstein"/>);
