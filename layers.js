const layersList = document.querySelector(".layers");

let elementsData = [];
let elementCounter = 0;
let draggedLayer = null;

function clearSelection() {
  document.querySelectorAll(".element").forEach((el) => {
    el.classList.remove("selected");
  });

  document.querySelectorAll(".layers li").forEach((li) => {
    li.classList.remove("active");
  });

  activeElement = null;
}

/* layer item */

function createLayerItem(el) {
  const li = document.createElement("li");
  li.dataset.id = el.dataset.id;
  li.draggable = true;

  const nameSpan = document.createElement("span");
  nameSpan.className = "layer-name";

  const baseName = el.classList.contains("text") ? "Text" : "Rectangle";
  nameSpan.textContent = `${baseName} ${elementsData.length + 1}`;

  const controls = document.createElement("span");
  controls.className = "layer-controls";

  const upBtn = document.createElement("button");
  upBtn.textContent = "▲";

  const downBtn = document.createElement("button");
  downBtn.textContent = "▼";

  const eyeBtn = document.createElement("button");
  eyeBtn.className = "eye-btn";
  eyeBtn.innerHTML = "👁";

  controls.appendChild(upBtn);
  controls.appendChild(downBtn);

  li.appendChild(eyeBtn);
  li.appendChild(nameSpan);
  li.appendChild(controls);
  layersList.appendChild(li);

  /* select from layer */
  li.addEventListener("click", () => selectElement(el));

  /* rename */
  nameSpan.addEventListener("dblclick", (e) => {
    e.stopPropagation();

    const input = document.createElement("input");
    input.className = "layer-rename";
    input.value = nameSpan.textContent;

    li.replaceChild(input, nameSpan);
    input.focus();
    input.select();

    function save() {
      nameSpan.textContent = input.value || nameSpan.textContent;
      li.replaceChild(nameSpan, input);

      const data = elementsData.find((d) => d.id === el.dataset.id);
      if (data) data.name = nameSpan.textContent;
    }

    input.addEventListener("blur", save);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") input.blur();
      if (e.key === "Escape") li.replaceChild(nameSpan, input);
    });
  });

  /* move */
  upBtn.onclick = (e) => {
    e.stopPropagation();
    moveLayer(el, 1);
  };

  downBtn.onclick = (e) => {
    e.stopPropagation();
    moveLayer(el, -1);
  };

  /* drag reorder */
  li.addEventListener("dragstart", () => {
    draggedLayer = li;
    li.classList.add("dragging");
  });

  li.addEventListener("dragend", () => {
    draggedLayer = null;
    li.classList.remove("dragging");
  });

  li.addEventListener("dragover", (e) => e.preventDefault());

  li.addEventListener("drop", () => {
    if (!draggedLayer || draggedLayer === li) return;
    layersList.insertBefore(draggedLayer, li);
    syncZIndexFromLayers();
  });

  eyeBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    const isHidden = el.style.display === "none";

    if (isHidden) {
      el.style.display = "";
      eyeBtn.innerHTML = "👁";
      li.classList.remove("hidden");
    } else {
      el.style.display = "none";
      eyeBtn.innerHTML = "🚫";
      li.classList.add("hidden");
    }
  });
}

/* select */

function selectElement(el) {
  if (!el) return;

  /* clear previous selection */
  document.querySelectorAll(".element").forEach((item) => {
    item.classList.remove("selected");
  });

  document.querySelectorAll(".layers li").forEach((li) => {
    li.classList.remove("active");
  });

  /* select canvas element */
  el.classList.add("selected");
  activeElement = el;

  /* select layer item */
  const layerItem = document.querySelector(
    `.layers li[data-id="${el.dataset.id}"]`,
  );

  if (layerItem) {
    layerItem.classList.add("active");
  }

  /* sync panels */
  updatePanel(el);
  syncFillPanel?.(el);
  syncStrokePanel?.(el);
  syncTextPanel?.(el);
  syncClipPanel?.(el);
  syncMaskPanel?.(el);
}

/* layer order */
function moveLayer(el, direction) {
  const index = elementsData.findIndex((i) => i.id === el.dataset.id);
  const newIndex = index + direction;

  if (newIndex < 0 || newIndex >= elementsData.length) return;

  /* swap data */
  [elementsData[index], elementsData[newIndex]] = [
    elementsData[newIndex],
    elementsData[index],
  ];

  /* apply z-index */
  elementsData.forEach((item, i) => {
    const domEl = document.querySelector(`.element[data-id="${item.id}"]`);
    domEl.style.zIndex = i + 1;
  });

  /* reorder UI */
  const li = layersList.querySelector(`[data-id="${el.dataset.id}"]`);
  const ref =
    direction === 1 ? li.nextElementSibling : li.previousElementSibling;

  if (ref) {
    direction === 1
      ? layersList.insertBefore(ref, li)
      : layersList.insertBefore(li, ref);
  }
}
function syncZIndexFromLayers() {
  const layerItems = [...document.querySelectorAll(".layers li")];

  layerItems.forEach((li, index) => {
    const el = document.querySelector(`.element[data-id="${li.dataset.id}"]`);

    if (el) {
      el.style.zIndex = index + 1;
    }

    const dataItem = elementsData.find((item) => item.id === li.dataset.id);

    if (dataItem) {
      dataItem.z = index + 1;
    }
  });
}

/* register element */
function registerElement(el, type) {
  const z = elementsData.length + 1;
  elementsData.push({
    id: el.dataset.id,
    name: type === "text" ? "Text" : "Rectangle",
    z,
  });

  el.style.zIndex = z;
  createLayerItem(el);
}

canvas.addEventListener("mousedown", (e) => {
  const el = e.target.closest(".element");
  if (!el) return;

  selectElement(el);
});

function createRectangle() {
  const el = document.createElement("div");

  el.className = "element rectangle";
  el.dataset.id = `rect-${++elementCounter}`;

  el.style.cssText = `
    width: 120px;
    height: 80px;
    background: #4f46e5;
    position: absolute;
    top: 100px;
    left: 100px;
  `;

  document.querySelector(".canvas").appendChild(el);

  registerElement(el, "rect");
  selectElement(el);
}
function createText() {
  const el = document.createElement("div");

  el.className = "element text";
  el.dataset.id = `text-${++elementCounter}`;
  el.contentEditable = true;
  el.textContent = "Text";

  el.style.cssText = `
    position: absolute;
    top: 150px;
    left: 150px;
  `;

  document.querySelector(".canvas").appendChild(el);

  registerElement(el, "text");
  selectElement(el);
}
