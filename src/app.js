import {
  h,
  createElement,
  changed,
  updateElement,
  isCustomProp,
  setProp,
  setProps,
  updateProp,
  updateProps,
  setBooleanProp,
  removeProp,
  removeBooleanProp
} from './virtualDom';

const f = (
  <ul style="list-style: none;">
    <li className="item">item 1</li>
    <li className="item">
      <input type="checkbox" checked={true} />
      <input type="text" disabled={false} />
    </li>
  </ul>
);

const g = (
  <ul style="list-style: none;">
    <li className="item item2">item 1</li>
    <li style="background: red;">
      <input type="checkbox" checked={false} />
      <input type="text" disabled={true} />
    </li>
  </ul>
);

const $root = document.getElementById('root');
const $reload = document.getElementById('reload');

updateElement($root, f);
$reload.addEventListener('click', () => {
  updateElement($root, g, f);
});
