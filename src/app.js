import { Harmony } from './Harmony';


const quotes = [
  { quote: "Don't cry because it's over, smile because it happened.", author: "Dr. Seuss" },
  { quote: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.", author: "Albert Einstein" },
  { quote: "Be who you are and say what you feel, because those who mind don't matter, and those who matter don't mind.", author: "Bernard M. Baruch" },
  { quote: "In three words I can sum up everything I've learned about life: it goes on.", author: "Robert Frost" },
  { quote: "If you tell the truth, you don't have to remember anything.", author: "Mark Twain" }
];

class App extends Harmony.Component {
  harmonize() {
    return (
      <div>
        <header className="top-header">
          <div className="container header-content">
            <h1 className="harmony">Harmony Quote Machine</h1>
            <Navbar />
          </div>
        </header>
        <div className="container quote-wrapper">
          {this.props.quotes.map(item => {
            return <Quote quote={item.quote} author={item.author} />;
          })}
        </div>
      </div>
    );
  }
}

class Navbar extends Harmony.Component {
  harmonize() {
    return (
      <nav>
        <ul>
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
      </nav>
    );
  }
}


class Quote extends Harmony.Component {
  constructor(props) {
    super(props);
    this.state = {name: 'Milan'}
  }

  gray(e) {
    e.target.style.backgroundColor = '#ccc';
  }
  normal(e) {
    e.target.style.backgroundColor = '#fff';
  }
  green(e) {
    e.target.style.color = 'yellow';
  }
  red(e) {
    e.target.style.color = 'red';
  }
  normaltext(e) {
    e.target.style.color = 'black';
  }
  change(e) {
    e.target.parentNode.style.display = 'none';
  }
  componentDidMount() {
    console.log('mounted');
  }
  changeinput(e) {
    this.setState({name: e.target.value})
  }



  harmonize() {
    const { quote, author } = this.props;
    return (
      <div className="quote-item" onMouseEnter={(e) => this.gray(e)} onMouseLeave={(e) => this.normal(e)}>
        <h3 className="quote" onMouseEnter={(e) => this.green(e)} onMouseLeave={(e) => this.normaltext(e)}>"{quote}"</h3>
        <p className="author" onMouseEnter={(e) => this.red(e)} onMouseLeave={(e) => this.normaltext(e)}>- {author}</p>
        <button id="btn" onClick={(e) => this.change(e)}>DELETE</button>
        <br/>
        <br/>
        <input value={this.state.name} onKeyUp={e => this.changeinput(e) } />
        <br/>
        <br/>
        {this.state.name}
      </div>
    );
  }
}


Harmony.harmonize(<App quotes={quotes} />, document.getElementById("root"));
