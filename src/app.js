import {
  h,
  createElement,
  changed,
  updateElement
} from './virtualDom';


const a = (
  <ul>
    <li>item 1</li>
    <li>item 2</li>
    <li>item 1</li>
    <li>item 1</li>
    <li>item 2</li>
    <li>item 1</li>
    <li>item 1</li>
    <li>item 2</li>
    <li>item 1</li>
    <li>item 1</li>
    <li>item 2</li>
    <li>item 1</li>
  </ul>
);


const b = (
  <ul>
    <li>item 1</li>
    <li>hello!</li>
  </ul>
);

const $root = document.getElementById('root');
const $reload = document.getElementById('reload');

updateElement($root, a);
$reload.addEventListener('click', () => {
  updateElement($root, b, a);
});
