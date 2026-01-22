const lineHeightInput = document.getElementById("line-height");
const alignButtons = document.querySelectorAll("[data-align]");

alignButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!activeElement || !activeElement.classList.contains("text")) return;

    const align = btn.dataset.align;
    activeElement.style.textAlign = align;
  });
});
lineHeightInput.addEventListener("input", () => {
  if (!activeElement || !activeElement.classList.contains("text")) return;

  activeElement.style.lineHeight = lineHeightInput.value;
});
// sync text panel
function syncTextPanel(el) {
  if (!el.classList.contains("text")) return;

  lineHeightInput.value =
    parseFloat(getComputedStyle(el).lineHeight) /
    parseFloat(getComputedStyle(el).fontSize) || 1.4;
}
