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
        <header>
          <div className="container">
            <h1 className="harmony">Harmony Quote Machine</h1>
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


class Quote extends Harmony.Component {
  constructor(props) {
    super(props);
  }

  harmonize() {
    const { quote, author } = this.props;
    return (
      <div className="quote-item">
        <h3 className="quote">"{quote}"</h3>
        <p className="author">- {author}</p>
      </div>
    );
  }
}

Harmony.harmonize(<App quotes={quotes} />, document.getElementById("root"));
