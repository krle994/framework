import {
h,
setBooleanProp,
removeBooleanProp,
ensureNullValue,
isEventProp,
isObject,
isNull,
extractEventName,
isCustomProp,
setProp,
removeProp,
setProps,
updateProp,
updateProps,
addEventListeners,
createElement,
changed,
updateElement
} from './virtualDom';

const f = (
  <ul style="list-style: none;">
    <li className="item">item 1</li>
    <li className="item">item 2</li>
    <li className="item">item 3</li>
    <li className="item">item 4</li>
    <li className="item">item 5</li>
    <li className="item">item 6</li>
    <li className="item">item 7</li>
    <li className="item">item 8</li>
    <li className="item">item 9</li>
    <li className="item">item 10</li>
    <li className="item">item 11</li>
  </ul>
);

const g = (
  <div>
    <input type="text" onKeyUp={(e) => {document.querySelectorAll('#h').forEach(li => li.innerText = e.target.value)}} />
    <ul style="list-style: none;">
      <li className="item" id="h">1231</li>
      <li className="item" id="h">52354</li>
      <li className="item" id="h">7534</li>
    </ul>
  </div>
);

const $root = document.getElementById('root');
const $reload = document.getElementById('reload');

updateElement($root, f);
$reload.addEventListener('click', () => {
  updateElement($root, g, f);
});
