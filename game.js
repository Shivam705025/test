// Set up the scene, camera, and renderer
var scene = new THREE.Scene();
var canvas = document.getElementById('gameCanvas');
var camera = new THREE.PerspectiveCamera( 75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize( canvas.clientWidth, canvas.clientHeight );

// Create the city model and add it to the scene

var cityLoader = new THREE.GLTFLoaderUtils();
cityLoader.load('city.glb', function (gltf) {
  scene.add(gltf.scene);
}, undefined, function (error) {
  console.error(error);
});

// Create the frog character model and add it to the scene
var frog;
var frogLoader = new THREE.GLTFLoaderUtils();
frogLoader.load( 'frog.glb', function ( gltf ) {
  frog = gltf.scene.children[0];
  frog.position.set(0, 1, 0); // Set the frog's initial position
  scene.add( frog );
});


// Set up the controls for the frog character
var playerSpeed = 0.2;
var playerRotationSpeed = 0.1;
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;

document.addEventListener( 'keydown', function ( event ) {
  switch ( event.code ) {
    case 'KeyW':
      moveForward = true;
      break;
    case 'KeyS':
      moveBackward = true;
      break;
    case 'KeyA':
      moveLeft = true;
      break;
    case 'KeyD':
      moveRight = true;
      break;
  }
} );

document.addEventListener( 'keyup', function ( event ) {
  switch ( event.code ) {
    case 'KeyW':
      moveForward = false;
      break;
    case 'KeyS':
      moveBackward = false;
      break;
    case 'KeyA':
      moveLeft = false;
      break;
    case 'KeyD':
      moveRight = false;
      break;
  }
} );

function animate() {
  requestAnimationFrame( animate );
  
  // Move the player character based on input
  if ( moveForward ) {
    frog.translateZ( -playerSpeed );
  }
  if ( moveBackward ) {
    frog.translateZ( playerSpeed );
  }
  if ( moveLeft ) {
    frog.rotateY( playerRotationSpeed );
  }
  if ( moveRight ) {
    frog.rotateY( -playerRotationSpeed );
  }
  
  renderer.render( scene, camera );
}
animate();
