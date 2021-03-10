document.addEventListener("DOMContentLoaded", init);
let elementToColor;

// The model of all features
const features = {
  avocado: false,
  sunglasses: false,
  unicornwhale: false,
};

function init() {
  loadSVG();

  document.querySelectorAll(".option").forEach((option) => option.addEventListener("click", toggleOption));
}

async function loadSVG() {
  let svg = "croc.svg";
  let response = await fetch(svg);
  SVGfile = await response.text();
  document.querySelector("#croc_preview").innerHTML = SVGfile;
  setStartColor();
}

function setStartColor() {
  document.querySelectorAll(".color_part").forEach((crocPart) => {
    crocPart.style.fill = "white";
  });
  editSvg();
}

function editSvg() {
  document.querySelectorAll(".color_part").forEach((crocPart) => {
    crocPart.addEventListener("mouseover", mouseoverEffect);
    crocPart.addEventListener("mouseout", mouseoutEffect);
    crocPart.addEventListener("click", getSelectedColor);
  });
}

function getSelectedColor() {
  console.log("works");
  elementToColor = this;
  elementToColor.style.fill = "#c4c4c4";
  document.querySelectorAll(".color_btn").forEach((eachBtn) => {
    eachBtn.addEventListener("click", applySelectedColor);
  });
}

function applySelectedColor() {
  console.log(elementToColor);
  console.log(this.getAttribute("fill"));

  if (elementToColor != undefined) {
    elementToColor.style.fill = this.getAttribute("fill");
  }
}

function mouseoverEffect() {
  this.style.stroke = "red";
}

function mouseoutEffect() {
  this.style.stroke = "none";
}

function toggleOption(event) {
  const target = event.currentTarget;
  const feature = target.dataset.feature;

  if (features[feature]) {
    // feature added
    const removeElement = document.querySelector(`ul [data-feature=${feature}]`);
    console.log(`Feature ${feature} is turned on!`);
    features[feature] = false;
    target.classList.remove("chosen");
    document.querySelector(`[data-feature=${feature}]`).classList.add("hide");

    // animation
    const start = document.querySelector(`[data-feature=${feature}] img`).getBoundingClientRect();
    console.log(start);
    const end = removeElement.getBoundingClientRect();

    const diffX = start.x - end.x;
    const diffY = start.y - end.y;

    removeElement.style.setProperty("--diffX", diffX);
    removeElement.style.setProperty("--diffY", diffY);

    removeElement.classList.add("animate-feature-out");

    removeElement.addEventListener("animationend", function () {
      document.querySelector(`ul [data-feature=${feature}]`).remove();
    });
  } else {
    // feature removed
    console.log(`Feature ${feature} is turned off!`);
    features[feature] = true;
    target.classList.add("chosen");
    document.querySelector(`[data-feature=${feature}]`).classList.remove("hide");
    const newFeatureElement = createFeatureElement(feature);
    document.querySelector("ul").append(newFeatureElement);

    // animation

    const start = document.querySelector(`[data-feature=${feature}] img`).getBoundingClientRect();
    console.log(start);
    const end = newFeatureElement.getBoundingClientRect();

    const diffX = start.x - end.x;
    const diffY = start.y - end.y;

    newFeatureElement.style.setProperty("--diffX", diffX);
    newFeatureElement.style.setProperty("--diffY", diffY);

    newFeatureElement.classList.add("animate-feature-in");
  }
}

// Create featureElement to be appended to #selected ul - could have used a <template> instead
function createFeatureElement(feature) {
  const li = document.createElement("li");
  li.dataset.feature = feature;

  const img = document.createElement("img");
  img.src = `${feature}-charm.png`;
  // img.alt = capitalize(feature);

  li.append(img);

  return li;
}

// function capitalize(text) {
//   return text.substring(0, 1).toUpperCase() + text.substring(1).toLowerCase();
// }
