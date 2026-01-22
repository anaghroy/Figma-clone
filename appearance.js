const opacityInput = document.getElementById("opacity-input");
const radiusInput = document.getElementById("radius-input");

opacityInput.addEventListener("input", () => {
  if (!activeElement) return;

  const value = opacityInput.value;
  activeElement.style.opacity = value / 100;
});

radiusInput.addEventListener("input", () => {
  if (!activeElement) return;

  if (activeElement.classList.contains("text")) return;

  activeElement.style.borderRadius = radiusInput.value + "px";
});

//Opacity Function
radiusInput.addEventListener("input", () => {
  if (!activeElement) return;


  if (activeElement.classList.contains("text")) return;

  activeElement.style.borderRadius = radiusInput.value + "px";
});
function syncAppearancePanel(el) {
  if (!el) return;

  clipCheckbox.checked =
    getComputedStyle(el).overflow === "hidden";
}


clipCheckbox.addEventListener("change", () => {
  if (!activeElement) return;

  if (clipCheckbox.checked) {
    activeElement.classList.add("clip");
    activeElement.dataset.imageClip = "true";
  } else {
    activeElement.classList.remove("clip");
    activeElement.dataset.imageClip = "false";
  }
});

