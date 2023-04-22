// Set up the scene, camera, and renderer
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("gameCanvas") });
renderer.setSize( window.innerWidth, window.innerHeight );

// Create the city model and add it to the scene
var cityLoader = new THREE.GLTFLoader();
cityLoader.load( 'city.glb', function ( gltf ) {
  scene.add( gltf.scene );
});

// Create the frog character model and add it to the scene
var frogLoader = new THREE.GLTFLoader();
frogLoader.load( 'frog.glb', function ( gltf ) {
  var frog = gltf.scene.children[0];
  frog.position.set(0, 1, 0); // Set the frog's initial position
  scene.add( frog );
});

// Set up the controls for the frog character
var controls = new THREE.PlayerControls( camera, frog );

// Set up the game loop
function animate() {
  requestAnimationFrame( animate );
  controls.update(); // Update the controls
  renderer.render( scene, camera );
}
animate();
