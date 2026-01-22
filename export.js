//Variables
const exportBtn = document.getElementById("export-btn");
const exportMenu = document.getElementById("export-menu");

const exportJSONBtn = document.getElementById("export-json");
const exportHTMLBtn = document.getElementById("export-html");

// Data structure to hold canvas elements
function getCanvasData() {
  return [...document.querySelectorAll(".element")].map((el) => {
    const img = el.querySelector("img");
    const isText = el.classList.contains("text");

    return {
      id: el.dataset.id,
      type: isText ? "text" : "box",
      left: el.style.left,
      top: el.style.top,
      width: el.style.width,
      height: el.style.height,
      rotation: getRotation(el),
      opacity: el.style.opacity || 1,
      background: el.style.backgroundColor || "transparent",
      borderRadius: el.style.borderRadius || "0px",

      text: isText
        ? {
            content: el.innerHTML,
            fontSize: el.style.fontSize || "16px",
            fontFamily: el.style.fontFamily || "sans-serif",
            color: el.style.color || "#000",
            textAlign: el.style.textAlign || "left",
            lineHeight: el.style.lineHeight || "normal",
            fontWeight: el.style.fontWeight || "400",
          }
        : null,
      image: img
        ? {
            src: img.src,
            fit: el.dataset.imageFit || "cover",
            position: el.dataset.imagePosition || "center",
            opacity: el.dataset.imageOpacity || 1,
            clip: el.dataset.imageClip === "true",
          }
        : null,
    };
  });
}

function exportJSON() {
  const data = {
    version: "1.0",
    canvas: {
      width: canvas.clientWidth,
      height: canvas.clientHeight,
    },
    elements: getCanvasData(),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });

  download(blob, "design.json");
}
function exportHTML() {
  const data = getCanvasData();

  const elementsHTML = data
    .map((el) => {
      const imageHTML = el.image
        ? `
          <img 
            src="${el.image.src}"
            style="
              width:100%;
              height:100%;
              object-fit:${el.image.fit};
              object-position:${el.image.position};
              opacity:${el.image.opacity};
              pointer-events:none;
            "
          />
        `
        : "";
      const textHTML =
        el.type === "text"
          ? `
          <div style="
            font-size:${el.text.fontSize};
            font-family:${el.text.fontFamily};
            color:${el.text.color};
            text-align:${el.text.textAlign};
            line-height:${el.text.lineHeight};
            font-weight:${el.text.fontWeight};
            width:100%;
            height:100%;
            outline:none;
          ">
            ${el.text.content}
          </div>
        `
          : "";

      return `
        <div style="
          position:absolute;
          left:${el.left};
          top:${el.top};
          width:${el.width};
          height:${el.height};
          background:${el.background};
          border-radius:${el.borderRadius};
          opacity:${el.opacity};
          transform:rotate(${el.rotation}deg);
          overflow:${el.image?.clip ? "hidden" : "visible"};
        ">
          ${imageHTML}
          ${textHTML}
        </div>
      `;
    })
    .join("");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Exported Design</title>
  <style>
    body {
      margin: 0;
      background: #f5f5f5;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .canvas {
      position: relative;
      width: ${canvas.clientWidth}px;
      height: ${canvas.clientHeight}px;
      background: white;
    }
  </style>
</head>
<body>
  <div class="canvas">
    ${elementsHTML}
  </div>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  download(blob, "design.html");
}

function download(blob, filename) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "e") {
    e.preventDefault();
    exportJSON();
  }

  if ((e.ctrlKey || e.metaKey) && e.key === "h") {
    e.preventDefault();
    exportHTML();
  }
});

exportBtn.addEventListener("click", () => {
  exportMenu.classList.toggle("show");
});

exportJSONBtn.addEventListener("click", () => {
  exportJSON();
  exportMenu.classList.remove("show");
});

exportHTMLBtn.addEventListener("click", () => {
  exportHTML();
  exportMenu.classList.remove("show");
});

// Close menu on outside click
document.addEventListener("click", (e) => {
  if (!e.target.closest(".export-wrapper")) {
    exportMenu.classList.remove("show");
  }
});
