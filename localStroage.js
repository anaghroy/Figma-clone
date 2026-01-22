function saveCanvas() {
  const data = [];

  document.querySelectorAll(".element").forEach((el) => {
    const rect = el.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();

    data.push({
      id: el.dataset.id,
      type: el.classList.contains("text") ? "text" : "rect",
      name: el.dataset.name || el.textContent || "Layer",
      left: el.style.left,
      top: el.style.top,
      width: el.style.width,
      height: el.style.height,
      rotation: getRotation(el),
      mask: el.dataset.maskShape || "rect",
      image: el.querySelector("img")
        ? {
            src: el.querySelector("img").src,
            fit: el.dataset.imageFit || "cover",
            position: el.dataset.imagePosition || "center",
            opacity: el.dataset.imageOpacity || 1,
            clip: el.dataset.imageClip === "true",
          }
        : null,
      z: parseInt(el.style.zIndex) || 1,
      styles: {
        fill: el.classList.contains("text")
          ? el.style.color
          : el.style.backgroundColor,
        opacity: el.style.opacity || 1,
        fontSize: el.style.fontSize,
        fontWeight: el.style.fontWeight,
        stroke: el.style.borderColor,
        strokeWidth: el.style.borderWidth,
      },
      text: el.classList.contains("text") ? el.textContent : null,
    });
  });

  localStorage.setItem("figma-canvas", JSON.stringify(data));
  console.log("Canvas saved");
}

function loadCanvas() {
  const data = JSON.parse(localStorage.getItem("figma-canvas"));

  // Clear everything
  canvas.innerHTML = "";
  document.querySelector(".layers").innerHTML = "";
  elementsData = [];
  activeElement = null;

  if (!data || data.length === 0) {
    console.log("No saved canvas data");
    return;
  }

  data
    .sort((a, b) => a.z - b.z)
    .forEach((item) => {
      const el = document.createElement("div");

      el.classList.add("element");
      el.classList.add(item.type === "text" ? "text" : "rectangle");

      el.dataset.id = item.id;
      el.dataset.name = item.name;

      el.style.left = item.left;
      el.style.top = item.top;
      el.style.width = item.width;
      el.style.height = item.height;
      el.style.transform = `rotate(${item.rotation}deg)`;
      el.style.zIndex = item.z;
      el.style.opacity = item.styles.opacity;

      if (item.type === "text") {
        el.contentEditable = true;
        el.textContent = item.text;
        el.style.color = item.styles.fill;
        el.style.fontSize = item.styles.fontSize;
        el.style.fontWeight = item.styles.fontWeight;
      } else {
        el.style.backgroundColor = item.styles.fill;
        el.style.borderColor = item.styles.stroke;
        el.style.borderWidth = item.styles.strokeWidth;
      }

      addHandles(el);
      canvas.appendChild(el);

      if (item.image) {
        applyImageToElement(el, item.image.src, {
          fit: item.image.fit,
          position: item.image.position,
          opacity: item.image.opacity,
        });
        if (item.image.clip) {
          el.classList.add("clip");
          el.dataset.imageClip = "true";
        } else {
          el.classList.remove("clip");
          el.dataset.imageClip = "false";
        }
      }
      if (item.mask) {
        applyMask(el, item.mask);
      }

      elementsData.push({
        id: item.id,
        name: item.name,
        type: item.type,
        z: item.z,
      });

      createLayerItem(el);
    });

  console.log("Canvas + Layers restored");
}
window.addEventListener("load", loadCanvas);
