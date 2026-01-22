const strokeColorInput = document.getElementById("stroke-color");
const strokeWidthInput = document.getElementById("stroke-width");

// Text variables
const fontFamilyInput = document.getElementById("font-family");
const fontSizeInput = document.getElementById("font-size");
const fontWeightInput = document.getElementById("font-weight");

function applyStroke() {
  if (!activeElement) return;

  if (activeElement.classList.contains("text")) return;

  const color = strokeColorInput.value;
  const width = strokeWidthInput.value;

  activeElement.style.border = `${width}px solid ${color}`;
}

strokeColorInput.addEventListener("input", applyStroke);
strokeWidthInput.addEventListener("input", applyStroke);

function syncStrokePanel(el) {
  if (el.classList.contains("text")) return;

  const styles = getComputedStyle(el);
  strokeWidthInput.value = parseInt(styles.borderWidth) || 0;
  strokeColorInput.value = rgbToHex(styles.borderColor);
}

function applyTextStyle() {
  if (!activeElement) return;
  if (!activeElement.classList.contains("text")) return;

  activeElement.style.fontFamily = fontFamilyInput.value;
  activeElement.style.fontSize = fontSizeInput.value + "px";
  activeElement.style.fontWeight = fontWeightInput.value;
}

fontFamilyInput.addEventListener("change", applyTextStyle);
fontSizeInput.addEventListener("input", applyTextStyle);
fontWeightInput.addEventListener("change", applyTextStyle);

function syncTextPanel(el) {
  if (!el.classList.contains("text")) return;

  const styles = getComputedStyle(el);

  fontFamilyInput.value = styles.fontFamily.split(",")[0];
  fontSizeInput.value = parseInt(styles.fontSize);
  fontWeightInput.value = styles.fontWeight;
}

// Call
function selectElement(el) {
  if (!el) return;

  clearSelection();

  activeElement = el;
  el.classList.add("selected");

  const layerItem = document.querySelector(
    `.layers li[data-id="${el.dataset.id}"]`,
  );
  if (layerItem) layerItem.classList.add("active");

  syncFillPanel(el);
  syncStrokePanel(el);
  syncTextPanel(el);
  syncClipPanel(el);
  syncMaskPanel(el);
}
