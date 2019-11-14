import * as THREE from './three.module.js';
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
import { TeapotBufferGeometry } from '../node_modules/three/examples/jsm/geometries/TeapotBufferGeometry.js';

var scene, camera, controls, renderer;
var sceneWidth, sceneHeight;
var geometry, bulbLight;
var teapot, teaTess = 10, teapotSize = .7;
var material, floorMat, bulbMat;
var cube;
var t = 0;

init()

animate();


// Whenever the teapot changes, the scene is rebuilt from scratch (not much to it).
function createNewTeapot() {
    if ( teapot !== undefined ) {
        teapot.geometry.dispose();
        scene.remove( teapot );
    }
    var teapotGeometry = new TeapotBufferGeometry( teapotSize,
        teaTess );

    // cube mapping
    var path = '../textures/cube/Park2/';
    var format = '.jpg';
    var urls = [
        path + 'posx' + format, path + 'negx' + format,
        path + 'posy' + format, path + 'negy' + format,
        path + 'posz' + format, path + 'negz' + format
    ];
    var reflectionCube = new THREE.CubeTextureLoader().load( urls );
    reflectionCube.format = THREE.RGBFormat;

    scene.background = reflectionCube;


    var teaMat = new THREE.MeshPhysicalMaterial( {
        color: 0xff3300,
        metalness: .1,
        roughness: 0.5,
        clearcoat: 0,
        envMap: reflectionCube,
        combine: THREE.MixOperation,
        reflectivity: 0.9
    } );

    var cubeMaterial = new THREE.MeshLambertMaterial( { color: 0xff6600, envMap: reflectionCube, reflectivity: 0.9 } );
    
    teapot = new THREE.Mesh(
        teapotGeometry, cubeMaterial /*new THREE.MeshNormalMaterial()*/);
    teapot.rotation.x = Math.PI / 2.0;
    teapot.position.x -= 2;
    teapot.castShadow = true;
    scene.add( teapot );    
    
    




}

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

    // add mouse control
    controls = new OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;


    geometry = new THREE.BoxGeometry( 1, 1, 1 );
    //material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    material = new THREE.MeshPhysicalMaterial( {
                                color: 0x4400ff,
                                metalness: 0.0,
                                roughness: 0.1,
                                clearcoat: 1.0
                            } );
    cube = new THREE.Mesh( geometry, material );
    cube.position.x += 1;
    cube.receiveShadow = true;
    cube.castShadow = true;

    //cube.position.set(0, 1, -1);
    scene.add( cube );


    // add floor to the scene
    floorMat = new THREE.MeshPhysicalMaterial( {
        roughness: 0.6,
        color: 0x006655,
        metalness: .1,
        //bumpScale: 0.0005
    } );
    var floorGeometry = new THREE.PlaneBufferGeometry( 10, 5 );
    var floorMesh = new THREE.Mesh( floorGeometry, floorMat );
    floorMesh.receiveShadow = true;
    //floorMesh.rotation.x = - Math.PI / 4.0;
    floorMesh.position.z -= 0.7;
    scene.add( floorMesh );

    // add teapot to the scene

    createNewTeapot();

    // add point light to the scene
    var bulbGeometry = new THREE.SphereBufferGeometry( 0.1, 16, 8 );
    bulbLight = new THREE.PointLight( 0xffee88, 1, 100, 1 );
    bulbMat = new THREE.MeshStandardMaterial( {
        emissive: 0xffffee,
        emissiveIntensity: 10,
        color: 0x000000
    } );
    bulbLight.add( new THREE.Mesh( bulbGeometry, bulbMat ) );
    bulbLight.position.set( 1, 2, 0 );
    bulbLight.castShadow = true;
    bulbLight.penumbra = 0.8;
    scene.add( bulbLight );

    // add directional light
    var directionalLight = new THREE.DirectionalLight( 0xffbbbb, .4 );
    directionalLight.position.set(1, 0, 1);
    //scene.add( directionalLight );

    // add ambient light
    let ambientLight = new THREE.AmbientLight( 0x333333 );
    scene.add(ambientLight);

    // add spot light
    let spotLight = new THREE.SpotLight( 0xb4e7f2, 0.8 );
    spotLight.angle = -Math.PI / 4;
    spotLight.penumbra = 0.2;
    spotLight.position.set( -3, 0, 1 );
    spotLight.castShadow = true;

    spotLight.add( new THREE.Mesh( new THREE.SphereBufferGeometry(0.1, 10, 2), new THREE.MeshBasicMaterial({color: 0x0000FF}) ) );
    scene.add(spotLight);

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
    bulbLight.position.y = Math.cos( time ) * 2;
    bulbLight.position.x = Math.sin( time ) * 2 + .25;
    bulbLight.position.z = 2; //Math.cos( time ) * 0.25 + 2;

    renderer.render( scene, camera );

    controls.update(); // required because damping is enabled

}


function onWindowResize() {
    sceneWidth = window.innerWidth / 2;
    sceneHeight = window.innerHeight / 2;
    camera.aspect = sceneWidth / sceneHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( sceneWidth, sceneHeight );
}