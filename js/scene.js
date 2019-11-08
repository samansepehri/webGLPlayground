//import * as THREE from './three.module.js';

var scene;
var sceneWidth, sceneHeight;
var camera;
var renderer;
var geometry;
var material;
var cube;
var t = 0;

init()

animate();


function init() {
    scene = new THREE.Scene();
    sceneWidth = window.innerWidth / 2;
    sceneHeight = window.innerHeight / 2;

    camera = new THREE.PerspectiveCamera( 75, sceneWidth / sceneHeight, 0.1, 1000 );
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize( sceneWidth, sceneHeight );
    document.body.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );

    geometry = new THREE.BoxGeometry( 1, 1, 1 );
    //material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    material = new THREE.MeshPhysicalMaterial( {
                                metalness: 0.0,
                                roughness: 0.1,
                                clearcoat: 1.0
                            } );
    cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    // create a point light
    const pointLight =
    new THREE.PointLight(0xFFFFFF);

    // set its position
    pointLight.position.x = 10;
    pointLight.position.y = 50;
    pointLight.position.z = 130;

    // add to the scene
    scene.add(pointLight);

}
function animate() {
    requestAnimationFrame( animate );
    t += .01;
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    var s = Math.sin(t) * 2;
    cube.scale.set ( s, s, s);
    renderer.render( scene, camera );
}


function onWindowResize() {
    sceneWidth = window.innerWidth / 2;
    sceneHeight = window.innerHeight / 2;
    camera.aspect = sceneWidth / sceneHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( sceneWidth, sceneHeight );
}