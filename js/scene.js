import * as THREE from './three.module.js';

var scene;
var sceneWidth, sceneHeight;
var camera;
var renderer;
var geometry, bulbLight;
var material, floorMat, bulbMat;
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
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );

    geometry = new THREE.BoxGeometry( 1, 1, 1 );
    //material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    material = new THREE.MeshPhysicalMaterial( {
                                color: 0x4400ff,
                                metalness: 0.0,
                                roughness: 0.1,
                                clearcoat: 1.0
                            } );
    cube = new THREE.Mesh( geometry, material );
    cube.receiveShadow = true;
    cube.castShadow = true;
    //cube.position.set(0, 1, -1);
    scene.add( cube );


    // add floor to the scene
    floorMat = new THREE.MeshPhysicalMaterial( {
        roughness: 0.8,
        color: 0x00ffff,
        metalness: 1,
        //bumpScale: 0.0005
    } );
    var floorGeometry = new THREE.PlaneBufferGeometry( 10, 5 );
    var floorMesh = new THREE.Mesh( floorGeometry, floorMat );
    floorMesh.receiveShadow = true;
    floorMesh.rotation.x = - Math.PI / 4.0;
    floorMesh.position.z -= 1;
    scene.add( floorMesh );


    // add point light to the scene
    var bulbGeometry = new THREE.SphereBufferGeometry( 0.1, 16, 8 );
    bulbLight = new THREE.PointLight( 0xffee88, 1, 100, 2 );
    bulbMat = new THREE.MeshStandardMaterial( {
        emissive: 0xffffee,
        emissiveIntensity: 10,
        color: 0x000000
    } );
    bulbLight.add( new THREE.Mesh( bulbGeometry, bulbMat ) );
    bulbLight.position.set( 1, 2, 0 );
    bulbLight.castShadow = true;

    scene.add( bulbLight );

}
function animate() {
    requestAnimationFrame( animate );
    t += .01;
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    var s = Math.sin(t) * 2;
    //cube.scale.set ( s, s, s);
    floorMat.needsUpdate = true;

    var time = Date.now() * 0.0005;
    bulbLight.position.y = Math.cos( time ) * 0.75 + 1.25;
    bulbLight.position.x = Math.sin( time ) * 2 - 1.25;
    bulbLight.position.z = Math.cos( time ) * 0.25 + 1;

    renderer.render( scene, camera );
}


function onWindowResize() {
    sceneWidth = window.innerWidth / 2;
    sceneHeight = window.innerHeight / 2;
    camera.aspect = sceneWidth / sceneHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( sceneWidth, sceneHeight );
}