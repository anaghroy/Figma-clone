const elements = document.querySelectorAll(".element");
const layers = document.querySelectorAll(".layers li");
const title = document.querySelector(".panel-header .title");

// Rotation 
const posX = document.getElementById("pos-x");
const posY = document.getElementById("pos-y");
const widthInput = document.getElementById("width");
const heightInput = document.getElementById("height");

function selectById(id) {
  // Clear previous selection
  elements.forEach((el) => el.classList.remove("selected"));
  layers.forEach((li) => li.classList.remove("active"));

  // Select current
  const element = document.querySelector(`.element[data-id="${id}"]`);
  const layer = document.querySelector(`.layers li[data-id="${id}"]`);

  if (!element || !layer) return;

  element.classList.add("selected");
  layer.classList.add("active");

  // Update right panel title
  title.textContent = layer.textContent;
}

// Canvas-> Layers
elements.forEach((el) => {
  el.addEventListener("click", () => {
    selectById(el.dataset.id);
  });
});
// Layers -> Canvas
layers.forEach((li) => {
  li.addEventListener("click", () => {
    selectById(li.dataset.id);
  });
});

let activeElement = null;

// Update panel inputs from element
function updatePanel(el) {
  const rect = el.getBoundingClientRect();
  const parentRect = el.offsetParent.getBoundingClientRect();

  posX.value = Math.round(rect.left - parentRect.left);
  posY.value = Math.round(rect.top - parentRect.top);
  widthInput.value = Math.round(rect.width);
  heightInput.value = Math.round(rect.height);
}

// Override selectById to track active element
function selectById(id) {
  elements.forEach(el => el.classList.remove("selected"));
  layers.forEach(li => li.classList.remove("active"));

  const element = document.querySelector(`.element[data-id="${id}"]`);
  const layer = document.querySelector(`.layers li[data-id="${id}"]`);

  if (!element || !layer) return;

  element.classList.add("selected");
  layer.classList.add("active");

  activeElement = element;
  title.textContent = layer.textContent;

  updatePanel(element);
}

[posX, posY, widthInput, heightInput].forEach(input => {
  input.addEventListener("input", () => {
    if (!activeElement) return;

    activeElement.style.left = posX.value + "px";
    activeElement.style.top = posY.value + "px";
    activeElement.style.width = widthInput.value + "px";
    activeElement.style.height = heightInput.value + "px";
  });
});
