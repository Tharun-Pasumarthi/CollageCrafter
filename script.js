const canvas = new fabric.Canvas("collageCanvas", {
  backgroundColor: "#fff",
  preserveObjectStacking: true
});

const imageUpload = document.getElementById("imageUpload");
const templateSelect = document.getElementById("templateSelect");
const addTextBtn = document.getElementById("addText");
const downloadBtn = document.getElementById("downloadBtn");
const brightnessSlider = document.getElementById("brightness");
const contrastSlider = document.getElementById("contrast");
const borderColorInput = document.getElementById("borderColor");
const borderWidthInput = document.getElementById("borderWidth");
const exportFormat = document.getElementById("exportFormat");

let imageObjects = [];

imageUpload.addEventListener("change", (e) => {
  const files = Array.from(e.target.files);
  imageObjects = [];

  canvas.clear();
  canvas.setBackgroundColor("#fff", canvas.renderAll.bind(canvas));

  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = function(event) {
      fabric.Image.fromURL(event.target.result, function(img) {
        img.set({
          left: 50 + Math.random() * 400,
          top: 50 + Math.random() * 300,
          scaleX: 0.4,
          scaleY: 0.4,
          cornerStyle: 'circle',
          cornerColor: 'blue',
          transparentCorners: false
        });
        applyFilters(img);
        applyBorder(img);
        imageObjects.push(img);
        canvas.add(img);
        applyTemplate();
      });
    };
    reader.readAsDataURL(file);
  });
});

templateSelect.addEventListener("change", applyTemplate);

function applyTemplate() {
  const template = templateSelect.value;

  if (template === "2x2") {
    const positions = [
      [0, 0], [500, 0], [0, 400], [500, 400]
    ];
    imageObjects.forEach((img, i) => {
      if (positions[i]) {
        img.set({ left: positions[i][0], top: positions[i][1], scaleX: 0.5, scaleY: 0.5 });
      }
    });
  } else if (template === "3x3") {
    const size = 333;
    imageObjects.forEach((img, i) => {
      const row = Math.floor(i / 3);
      const col = i % 3;
      img.set({ left: col * size, top: row * size, scaleX: 0.33, scaleY: 0.33 });
    });
  } else if (template === "big-left") {
    if (imageObjects[0]) imageObjects[0].set({ left: 0, top: 0, scaleX: 0.7, scaleY: 0.7 });
    if (imageObjects[1]) imageObjects[1].set({ left: 700, top: 0, scaleX: 0.3, scaleY: 0.3 });
    if (imageObjects[2]) imageObjects[2].set({ left: 700, top: 400, scaleX: 0.3, scaleY: 0.3 });
  }

  canvas.renderAll();
}

function applyFilters(img) {
  const brightness = parseFloat(brightnessSlider.value);
  const contrast = parseFloat(contrastSlider.value);
  img.filters = [
    new fabric.Image.filters.Brightness({ brightness }),
    new fabric.Image.filters.Contrast({ contrast })
  ];
  img.applyFilters();
}

function applyBorder(img) {
  const width = parseInt(borderWidthInput.value);
  const color = borderColorInput.value;
  img.set({
    stroke: color,
    strokeWidth: width
  });
}

[brightnessSlider, contrastSlider, borderColorInput, borderWidthInput].forEach(input => {
  input.addEventListener("input", () => {
    imageObjects.forEach(img => {
      applyFilters(img);
      applyBorder(img);
    });
    canvas.renderAll();
  });
});

addTextBtn.addEventListener("click", () => {
  const text = new fabric.IText("Edit me", {
    left: 100,
    top: 100,
    fontSize: 28,
    fill: "#333",
    fontFamily: "Arial",
  });
  canvas.add(text);
  canvas.setActiveObject(text);
});

downloadBtn.addEventListener("click", () => {
  const format = exportFormat.value;
  const dataURL = canvas.toDataURL({ format: format === "jpeg" ? "jpeg" : format });
  const link = document.createElement("a");
  link.download = `collage.${format}`;
  link.href = dataURL;
  link.click();
});
