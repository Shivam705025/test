// Create the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add orbit controls to the camera
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

// Create the road
const roadTexture = new THREE.TextureLoader().load('./textures/road.jpg');
const roadMaterial = new THREE.MeshBasicMaterial({ map: roadTexture });
const roadGeometry = new THREE.PlaneGeometry(20, 200);
const road = new THREE.Mesh(roadGeometry, roadMaterial);
road.rotation.x = -Math.PI / 2;
scene.add(road);

// Create the car
const carGeometry = new THREE.BoxGeometry(2, 1, 4);
const carMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const car = new THREE.Mesh(carGeometry, carMaterial);
car.position.y = 0.5;
scene.add(car);

// Create the trees
const treeGeometry = new THREE.BoxGeometry(1, 4, 1);
const treeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const tree1 = new THREE.Mesh(treeGeometry, treeMaterial);
tree1.position.set(-5, 2, -50);
const tree2 = new THREE.Mesh(treeGeometry, treeMaterial);
tree2.position.set(5, 2, -50);
scene.add(tree1);
scene.add(tree2);

// Create the buildings
const buildingGeometry = new THREE.BoxGeometry(10, 20, 10);
const buildingMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const building1 = new THREE.Mesh(buildingGeometry, buildingMaterial);
building1.position.set(-15, 10, -100);
const building2 = new THREE.Mesh(buildingGeometry, buildingMaterial);
building2.position.set(15, 10, -100);
scene.add(building1);
scene.add(building2);

// Position the camera and start the game loop
camera.position.set(0, 5, 10);
const gameLoop = () => {
  requestAnimationFrame(gameLoop);
  car.position.z -= 0.1;
  if (car.position.z < -100) {
    car.position.z = 0;
  }
  renderer.render(scene, camera);
};
gameLoop();
