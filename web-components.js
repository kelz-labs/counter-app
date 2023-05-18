const template = document.createElement("template");
template.innerHTML = `
  <style>
    label {
      color: red;
      display: block;
    }
  </style>

  <label>
    <input type="checkbox" />
    <slot></slot>
    <span classs="description">
      <slot name="description"></slot>
    </span>
  </label>
`;

class TodoItem extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.append(template.content.cloneNode(true));
  }

  static get observedAttribute() {
    return ["checked"];
  }

  attributeChangeCallback(name, oldValue, newValue) {
    console.log(name, oldValue, newValue);
  }

  updateChecked(value) {
    this.checkbox.checked = value !== null && value !== "false";
  }
}

customElements.define("todo-item", TodoItem);

const item = document.querySelector("todo-item");
let checked = true;

setInterval(() => {
  checked = !checked;
  item.setAttribute("checked", checked);
}, 500);
