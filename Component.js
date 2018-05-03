class Component {
  constructor (el, template) {
    this.el = el;
    this.template = template;

    document.querySelector(el).insertAdjacentHTML('beforeend', template);
  }
}

let companies = ['Facebook', 'Google', 'Amazon', 'Quantox'];
let template = '';

companies.forEach(company => template += `<li>${company}</li>`)

let comp = new Component ('#hey', template);
