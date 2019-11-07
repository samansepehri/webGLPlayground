import * as THREE from './three.module.js';

var scene = new THREE.Scene();
var sceneWidth = window.innerWidth / 2;
var sceneHeight = window.innerHeight / 2;

var camera = new THREE.PerspectiveCamera( 75, sceneWidth / sceneHeight, 0.1, 1000 );


var renderer = new THREE.WebGLRenderer();
renderer.setSize( sceneWidth, sceneHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

animate();

function animate() {
    requestAnimationFrame( animate );
    
    cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
    
    renderer.render( scene, camera );
}