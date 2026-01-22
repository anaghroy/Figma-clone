window.canvas = document.querySelector(".canvas");
const elements = document.querySelectorAll(".element");
const layers = document.querySelectorAll(".layers li");
const title = document.querySelector(".panel-header .title");
//Zoom and Pen
let scale = 1;
let panX = 0;
let panY = 0;

const viewport = document.querySelector(".canvas-viewport");

// Rotation
const posX = document.getElementById("pos-x");
const posY = document.getElementById("pos-y");
const widthInput = document.getElementById("width");
const heightInput = document.getElementById("height");

//Mouse down variables
let isDragging = false;
let startX = 0;
let startY = 0;
let startLeft = 0;
let startTop = 0;

//Resizing variables
let isResizing = false;
let resizeHandle = null;
let activeElement = null;

let startWidth, startHeight;
//Zoom Canvas UI
const zoomUI = document.querySelector(".zoom-ui");
//Rotation
const rotationInput = document.getElementById("rotation");

let isRotating = false;
let startAngle = 0;
let startRotation = 0;
let centerX = 0;
let centerY = 0;


// Toggle clip
const clipCheckbox = document.getElementById("clip-content");

// Override selectById to track active element
function selectById(id) {
  document
    .querySelectorAll(".element")
    .forEach((el) => el.classList.remove("selected"));

  document
    .querySelectorAll(".layers li")
    .forEach((li) => li.classList.remove("active"));

  const element = document.querySelector(`.element[data-id="${id}"]`);
  if (!element) return;

  element.classList.add("selected");
  activeElement = element;
  updatePanel(element);
}

[posX, posY, widthInput, heightInput].forEach((input) => {
  input.addEventListener("input", () => {
    if (!activeElement) return;

    activeElement.style.left = posX.value + "px";
    activeElement.style.top = posY.value + "px";
    activeElement.style.width = widthInput.value + "px";
    activeElement.style.height = heightInput.value + "px";
  });
});

// Mouse down - start drag
canvas.addEventListener("mousedown", (e) => {
  // resize / rotation handle
  if (
    e.target.classList.contains("resize-handle") ||
    e.target.classList.contains("rotation-handle")
  ) {
    return;
  }

  const target = e.target.closest(".element");
  if (!target) return;

  selectById(target.dataset.id);

  isDragging = true;
  activeElement = target;

  const rect = target.getBoundingClientRect();
  const canvasRect = canvas.getBoundingClientRect();

  startX = e.clientX;
  startY = e.clientY;
  startLeft = rect.left - canvasRect.left;
  startTop = rect.top - canvasRect.top;

  target.classList.add("dragging");
});

window.addEventListener("mousemove", (e) => {
  if (!isDragging || !activeElement) return;

  const canvasRect = canvas.getBoundingClientRect();

  let dx = (e.clientX - startX) / scale;
  let dy = (e.clientY - startY) / scale;

  let newLeft = startLeft + dx;
  let newTop = startTop + dy;

  // Boundary constraints
  newLeft = Math.max(
    0,
    Math.min(newLeft, canvas.clientWidth - activeElement.offsetWidth),
  );
  newTop = Math.max(
    0,
    Math.min(newTop, canvas.clientHeight - activeElement.offsetHeight),
  );

  activeElement.style.left = newLeft + "px";
  activeElement.style.top = newTop + "px";

  // Live update panel
  posX.value = Math.round(newLeft);
  posY.value = Math.round(newTop);
});

window.addEventListener("mouseup", () => {
  if (!activeElement) return;

  isDragging = false;
  activeElement.classList.remove("dragging");
});
document.addEventListener("keydown", (e) => {
  if (!activeElement) return;

  const step = e.shiftKey ? 10 : 1;
  let moved = false;

  let left = parseInt(activeElement.style.left) || 0;
  let top = parseInt(activeElement.style.top) || 0;

  switch (e.key) {
    case "ArrowLeft":
      left -= step;
      moved = true;
      break;
    case "ArrowRight":
      left += step;
      moved = true;
      break;
    case "ArrowUp":
      top -= step;
      moved = true;
      break;
    case "ArrowDown":
      top += step;
      moved = true;
      break;
  }

  if (!moved) return;

  e.preventDefault();

  // Canvas boundaries
  left = Math.max(
    0,
    Math.min(left, canvas.clientWidth - activeElement.offsetWidth),
  );
  top = Math.max(
    0,
    Math.min(top, canvas.clientHeight - activeElement.offsetHeight),
  );

  activeElement.style.left = left + "px";
  activeElement.style.top = top + "px";

  // Sync panel
  posX.value = left;
  posY.value = top;
});


canvas.addEventListener("mousedown", (e) => {
  const handle = e.target.closest(".resize-handle");
  if (!handle) return;

  e.stopPropagation();

  const el = handle.closest(".element");
  if (!el) return;

  selectById(el.dataset.id);

  isResizing = true;
  resizeHandle = [...handle.classList].find((c) =>
    ["tl", "tr", "bl", "br"].includes(c),
  );
  activeElement = el;

  startX = e.clientX;
  startY = e.clientY;

  const rectBox = el.getBoundingClientRect();

  startWidth = rectBox.width;
  startHeight = rectBox.height;

  startLeft = parseFloat(el.style.left);
  startTop = parseFloat(el.style.top);

  document.addEventListener("mousemove", resizeMove);
  document.addEventListener("mouseup", stopResize);
});

//Rotation
canvas.addEventListener("mousedown", (e) => {
  const handle = e.target.closest(".rotation-handle");
  if (!handle) return;

  e.stopPropagation();

  isRotating = true;
  activeElement = handle.closest(".element");

  const rect = activeElement.getBoundingClientRect();
  centerX = rect.left + rect.width / 2;
  centerY = rect.top + rect.height / 2;

  startAngle = getAngle(e);
  startRotation = getRotation(activeElement);

  document.addEventListener("mousemove", rotateMove);
  document.addEventListener("mouseup", stopRotate);
});

function resizeMove(e) {
  if (!isResizing || !activeElement || !resizeHandle) return;

  const dx = (e.clientX - startX) / scale;
  const dy = (e.clientY - startY) / scale;
  const minSize = 40;

  let w = startWidth;
  let h = startHeight;
  let l = startLeft;
  let t = startTop;

  if (resizeHandle.includes("r")) w = startWidth + dx;
  if (resizeHandle.includes("l")) {
    w = startWidth - dx;
    l = startLeft + dx;
  }

  if (resizeHandle.includes("b")) h = startHeight + dy;
  if (resizeHandle.includes("t")) {
    h = startHeight - dy;
    t = startTop + dy;
  }

  if (w >= minSize) {
    activeElement.style.width = w + "px";
    activeElement.style.left = l + "px";
  }

  if (h >= minSize) {
    activeElement.style.height = h + "px";
    activeElement.style.top = t + "px";
  }

  widthInput.value = Math.round(w);
  heightInput.value = Math.round(h);
  posX.value = Math.round(l);
  posY.value = Math.round(t);
}

function stopResize() {
  isResizing = false;
  resizeHandle = null;

  document.removeEventListener("mousemove", resizeMove);
  document.removeEventListener("mouseup", stopResize);
}

function getRotation(el) {
  const transform = window.getComputedStyle(el).transform;
  if (transform === "none") return 0;

  const values = transform.split("(")[1].split(")")[0].split(",");
  const a = values[0];
  const b = values[1];

  return Math.round(Math.atan2(b, a) * (180 / Math.PI));
}

function getAngle(e) {
  return Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
}

function rotateMove(e) {
  if (!isRotating || !activeElement) return;

  const currentAngle = getAngle(e);
  const delta = currentAngle - startAngle;
  const rotation = startRotation + delta;

  activeElement.style.transform = `rotate(${rotation}deg)`;
  rotationInput.value = Math.round(rotation);
}
function stopRotate() {
  isRotating = false;

  document.removeEventListener("mousemove", rotateMove);
  document.removeEventListener("mouseup", stopRotate);
}
rotationInput.addEventListener("input", () => {
  if (!activeElement) return;
  activeElement.style.transform = `rotate(${rotationInput.value}deg)`;
});

function updatePanel(el) {
  const rect = el.getBoundingClientRect();
  const parentRect = el.offsetParent.getBoundingClientRect();

  posX.value = Math.round(rect.left - parentRect.left);
  posY.value = Math.round(rect.top - parentRect.top);
  widthInput.value = Math.round(rect.width);
  heightInput.value = Math.round(rect.height);
  rotationInput.value = getRotation(el);
}


document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "s") {
    e.preventDefault();
    saveCanvas();
  }
});


//Zoom out/In
viewport.addEventListener("wheel", (e) => {
  e.preventDefault();

  const zoomSpeed = 0.1;
  const prevScale = scale;

  scale += e.deltaY > 0 ? -zoomSpeed : zoomSpeed;
  scale = Math.min(Math.max(scale, 0.2), 4);

  const rect = viewport.getBoundingClientRect();

  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  panX -= mouseX / prevScale - mouseX / scale;
  panY -= mouseY / prevScale - mouseY / scale;

  applyTransform();
});

let isPanning = false;
let startPanX = 0;
let startPanY = 0;
let startMouseX = 0;
let startMouseY = 0;

window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    viewport.style.cursor = "grab";
  }
});

window.addEventListener("keyup", (e) => {
  if (e.code === "Space") {
    viewport.style.cursor = "default";
    isPanning = false;
  }
});

viewport.addEventListener("mousedown", (e) => {
  if (!isPanning) return;

  startPanX = panX;
  startPanY = panY;
  startMouseX = e.clientX;
  startMouseY = e.clientY;
});


function applyTransform() {
  canvas.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
  zoomUI.textContent = Math.round(scale * 100) + "%";
}

window.addEventListener("mousemove", (e) => {
  if (!isPanning) return;

  panX = startPanX + (e.clientX - startMouseX);
  panY = startPanY + (e.clientY - startMouseY);

  applyTransform();
});

window.addEventListener("mouseup", () => {
  isPanning = false;
});

// Create Rectangle
const rectBtn = document.getElementById("rect-btn");
const textBtn = document.getElementById("text-btn");

let idCounter = 0;

rectBtn.addEventListener("click", () => {
  const rect = document.createElement("div");

  rect.classList.add("element", "rectangle");
  rect.dataset.id = `el-${idCounter++}`;

  rect.style.left = "100px";
  rect.style.top = "100px";
  rect.style.width = "120px";
  rect.style.height = "80px";

  addHandles(rect);

  canvas.appendChild(rect);
  registerElement(rect, "rect");
  selectById(rect.dataset.id);
});
function addHandles(el) {
  ["tl", "tr", "bl", "br"].forEach((pos) => {
    const h = document.createElement("div");
    h.className = `resize-handle ${pos}`;
    el.appendChild(h);
  });

  const rotate = document.createElement("div");
  rotate.className = "rotation-handle";
  el.appendChild(rotate);
}

textBtn.addEventListener("click", () => {
  const text = document.createElement("div");

  text.classList.add("element", "text");
  text.dataset.id = `el-${idCounter++}`;
  text.contentEditable = true;
  text.innerText = "Type here";

  text.style.left = "150px";
  text.style.top = "150px";

  addHandles(text);
  canvas.appendChild(text);
  registerElement(text, "text");
  selectById(text.dataset.id);
  text.focus();
});

window.addEventListener("load", () => {
  document.querySelectorAll(".element").forEach((el) => {
    if (!el.querySelector(".resize-handle")) {
      addHandles(el);
    }
  });
});

// Toggle clip
clipCheckbox.addEventListener("change", () => {
  if (!activeElement) return;

  activeElement.style.overflow = clipCheckbox.checked
    ? "hidden"
    : "visible";

  saveCanvas();
});

