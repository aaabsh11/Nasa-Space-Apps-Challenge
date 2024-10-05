let scene, camera, renderer, model, controls;

function init() {
  const container = document.getElementById("canvas-container");

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 3);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0x404040, 2);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(10, 10, 10);
  scene.add(pointLight);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = false;

  // Загрузка .gltf модели вместо .obj
  const loader = new THREE.GLTFLoader();
  loader.load("Roblox.glb", function (gltf) {
    model = gltf.scene;
    scene.add(model);
  });

  animate();
}

document
  .getElementById("showTextButton")
  .addEventListener("click", function () {
    const textElement = document.getElementById("text");

    // Проверяем, есть ли класс hidden. Если есть, удаляем его и добавляем эффект появления
    if (textElement.classList.contains("hidden")) {
      textElement.classList.remove("hidden");
      setTimeout(() => {
        textElement.classList.add("visible");
      }, 10); // Задержка для плавного перехода
    } else {
      // При повторном клике скрываем текст с обратным эффектом
      textElement.classList.remove("visible");
      setTimeout(() => {
        textElement.classList.add("hidden");
      }, 600); // Подождем пока завершится анимация
    }
  });

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

function rotateModel(direction) {
  if (!model) return;
  const rotationAmount = 0.1;
  if (direction === "left") {
    model.rotation.y -= rotationAmount;
  } else if (direction === "right") {
    model.rotation.y += rotationAmount;
  }
}

function zoomModel(direction) {
  const zoomAmount = 1;
  if (direction === "in") {
    camera.position.z -= zoomAmount;
  } else if (direction === "out") {
    camera.position.z += zoomAmount;
  }
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

init();

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowLeft":
      rotateModel("left");
      break;
    case "ArrowRight":
      rotateModel("right");
      break;
    case "ArrowUp":
      zoomModel("in");
      break;
    case "ArrowDown":
      zoomModel("out");
      break;
  }
});
