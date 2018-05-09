import { VirtualDOM } from './virtualDOM';

const f = (
  <div>

  <header>
    <div className="brand">
      <h1>BRAND</h1>
    </div>
    <nav>
      <ul>
        <li>Home</li>
        <li>About</li>
        <li>Services</li>
        <li>Contact</li>
      </ul>
    </nav>
  </header>

  <section id="home">
    <h1>WELCOME</h1>
    <br/>
    <br/>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi animi qui nam, optio vero! Sunt perferendis voluptate tenetur tempore enim consequatur, quas praesentium, obcaecati minus porro non adipisci doloremque beatae.</p>
    <br/>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rem, facere architecto laudantium, vero asperiores animi tempora. Totam fuga, quas officiis?</p>
  </section>
  <section id="About">
    <h1>About us</h1>
    <br/>
    <br/>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi molestias vel omnis perspiciatis quod praesentium ipsum, eos odit dicta fuga beatae dolore asperiores adipisci laborum suscipit laudantium, iusto ad non possimus qui odio nobis! Vitae a, harum odit excepturi nesciunt quae. Dolorem nobis debitis inventore consequatur totam temporibus veniam officiis!</p>
    <br/>
    <h2>The Team</h2>
    <br/>
    <div className="team" style="float: left">
      <img src="http://via.placeholder.com/150x150" alt=""/>
      <img src="http://via.placeholder.com/150x150" alt=""/>
      <img src="http://via.placeholder.com/150x150" alt=""/>
      <img src="http://via.placeholder.com/150x150" alt=""/>
      <img src="http://via.placeholder.com/150x150" alt=""/>
    </div>
  </section>
  <section id="Services">
    <h1>Our Services</h1>
    <br/>
    <br/>
    <div className="grid-container" style="display: grid; grid-template-columns: auto auto auto">
    <div className="grid-item"><img src="http://via.placeholder.com/150x150" alt=""/></div>
    <div className="grid-item"><img src="http://via.placeholder.com/150x150" alt=""/></div>
    <div className="grid-item"><img src="http://via.placeholder.com/150x150" alt=""/></div>
    <div className="grid-item"><img src="http://via.placeholder.com/150x150" alt=""/></div>
    <div className="grid-item"><img src="http://via.placeholder.com/150x150" alt=""/></div>
    <div className="grid-item"><img src="http://via.placeholder.com/150x150" alt=""/></div>
    <div className="grid-item"><img src="http://via.placeholder.com/150x150" alt=""/></div>
    <div className="grid-item"><img src="http://via.placeholder.com/150x150" alt=""/></div>
    <div className="grid-item"><img src="http://via.placeholder.com/150x150" alt=""/></div>
  </div>
  </section>
  <section id="contact">
    <h1>Contact us</h1>
    <br/>
    <form>
    <fieldset>
      <legend>Personal information:</legend>
      First name:<br/>
      <input type="text" name="firstname" value="Mickey"/><br/>
      Last name:<br/>
      <input type="text" name="lastname" value="Mouse"/><br/><br/>
      <input type="submit" value="Submit"/>
    </fieldset>
  </form>
  </section>
  </div>

);

const g = (
    <ul style="list-style: none;">
      <li>item 1 </li>
    </ul>
);

const $root = document.getElementById('root');
const $reload = document.getElementById('reload');

VirtualDOM.updateElement($root, f);
$reload.addEventListener('click', () => {
  VirtualDOM.updateElement($root, g, f);
});
