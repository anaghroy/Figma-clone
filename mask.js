const maskSelect = document.getElementById("mask-shape");

maskSelect.addEventListener("change", (e) => {
  if (!activeElement) return;

  applyMask(activeElement, e.target.value);
  saveCanvas();
});

function applyMask(el, shape) {
  switch (shape) {
    case "circle":
      el.style.borderRadius = "50%";
      break;

    case "rounded":
      el.style.borderRadius = "16px";
      break;

    case "ellipse":
      el.style.borderRadius = "50% / 35%";
      break;

    default:
      el.style.borderRadius = "0";
  }

  el.dataset.maskShape = shape;
}
function syncMaskPanel(el) {
  const maskSelect = document.getElementById("mask-shape");
  maskSelect.value = el.dataset.maskShape || "rect";
}
