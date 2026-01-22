// const { act } = require("react");

const fillColorInput = document.getElementById("fill-color");
const fillOpacityInput = document.getElementById("fill-opacity");

function applyFill() {
  if (!activeElement) return;

  const color = fillColorInput.value;
  const opacity = fillOpacityInput.value / 100;

  // TEXT ELEMENT
  if (activeElement.classList.contains("text")) {
    activeElement.style.color = color;
  } else {
    activeElement.style.backgroundColor = color;
  }
  // RECTANGLE OR SHAPE
  activeElement.style.opacity = opacity;
}

fillColorInput.addEventListener("input", applyFill);
fillOpacityInput.addEventListener("input", applyFill);

function syncFillPanel(el) {
  const opacity = parseFloat(getComputedStyle(el).opacity) || 1;
  fillOpacityInput.value = Math.round(opacity * 100);

  if (el.classList.contains("text")) {
    fillColorInput.value = rgbToHex(getComputedStyle(el).color);
  } else {
    fillColorInput.value = rgbToHex(getComputedStyle(el).backgroundColor);
  }
}

function selectElement(el) {
  if (!el) return;

  // remove previous selection
  document
    .querySelectorAll(".element.selected")
    .forEach((e) => e.classList.remove("selected"));

  el.classList.add("selected");
  activeElement = el;

  // sync panels
  syncFillPanel(el);
  syncAppearancePanel?.(el);
  updatePanel?.(el);
}

function rgbToHex(rgb) {
  const res = rgb.match(/\d+/g);
  if (!res) return "#ffffff";

  return (
    "#" +
    res
      .slice(0, 3)
      .map((x) => (+x).toString(16).padStart(2, "0"))
      .join("")
  );
}
