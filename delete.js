//Delete Element
document.addEventListener("keydown", (e) => {
  if (!activeElement) return;

  if (e.key !== "Delete" && e.key !== "Backspace") return;

  const focused = document.activeElement;

  const isEditingText =
    focused &&
    (focused.isContentEditable ||
      focused.tagName === "INPUT" ||
      focused.tagName === "TEXTAREA");

  if (isEditingText) return;

  e.preventDefault();

  const id = activeElement.dataset.id;

  // Remove canvas element
  activeElement.remove();

  // Remove layer item
  const layerItem = document.querySelector(`.layers li[data-id="${id}"]`);
  if (layerItem) layerItem.remove();

  // Remove from data structure
  elementsData = elementsData.filter((item) => item.id !== id);

  // Clear selection & UI
  activeElement = null;
  clearSelection();

  syncZIndexFromLayers();
  const remaining = document.querySelector(".layers li");
  if (remaining) {
    const el = document.querySelector(
      `.element[data-id="${remaining.dataset.id}"]`,
    );
    if (el) selectElement(el);
  }

  // Clear panel UI
  posX.value = "";
  posY.value = "";
  widthInput.value = "";
  heightInput.value = "";
  rotationInput.value = "";
});
