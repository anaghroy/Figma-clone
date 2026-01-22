const importBtn = document.getElementById("import-image");
const imageInput = document.getElementById("image-input");

importBtn.addEventListener("click", () => {
  if (!activeElement) {
    alert("Select a box first");
    return;
  }

  imageInput.click();
});

imageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file || !activeElement) return;

  const reader = new FileReader();

  reader.onload = () => {
    applyImageToElement(activeElement, reader.result);
    saveCanvas();
  };

  reader.readAsDataURL(file);
});
document.getElementById("imageFit").addEventListener("change", (e) => {
  if (!activeElement) return;

  const img = activeElement.querySelector("img");
  if (!img) return;

  img.style.objectFit = e.target.value;
  activeElement.dataset.imageFit = e.target.value;

  saveCanvas();
});

function applyImageToElement(el, src, options = {}) {
  let img = el.querySelector("img");

  if (!img) {
    img = document.createElement("img");
    img.draggable = false;
    el.appendChild(img);
  }

  img.src = src;

  img.style.width = "100%";
  img.style.height = "100%";
  img.style.objectFit = options.fit || "cover";
  img.style.objectPosition = options.position || "center";
  img.style.opacity = options.opacity ?? 1;

  el.style.overflow = options.clip ? "hidden" : "visible";

  // store settings on element
  el.dataset.imageFit = img.style.objectFit;
  el.dataset.imagePosition = img.style.objectPosition;
  el.dataset.imageOpacity = img.style.opacity;
  el.dataset.imageClip = options.clip ? "true" : "false";
}
function syncClipPanel(el) {
  const clipCheckbox = document.getElementById("clip-content");

  clipCheckbox.checked = el.dataset.imageClip === "true";
}

