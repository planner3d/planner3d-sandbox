import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {
    BoxGeometry, ExtrudeGeometry,
    Line,
    Mesh,
    MeshBasicMaterial, Shape,
} from "three";

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Sets the color of the background
renderer.setClearColor(0xFEFEFE);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// Sets orbit control to move the camera around
const orbit = new OrbitControls(camera, renderer.domElement);

// Camera positioning
camera.position.set(0, 0, 14);
orbit.update();

// Sets the x, y, and z axes with each having a length of 4
const axesHelper = new THREE.AxesHelper(4);
scene.add(axesHelper);

// grid 2d
const grid = new THREE.GridHelper(10, 10, "black");
grid.rotation.x = -Math.PI / 2;
scene.add(grid);

// grid 3d
const grid3d = new THREE.GridHelper(10, 10, "gray");
scene.add(grid3d);

function drawLineAndTranslateTo3D (x1,y1,x2,y2, wallColor) {
    // line
    const path = new THREE.Path();
    path.moveTo(x1,y1);
    path.lineTo(x2,y2);
    const points = path.getPoints();
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    const material = new THREE.LineBasicMaterial( { color: 'red' } );
    const line = new Line(geometry, material);
    scene.add(line);

    // construct 3d from 2d
    const deltaX = x2-x1;
    const deltaY = y2-y1;
    const distance = Math.sqrt(deltaX**2+deltaY**2);
    const boxGeo = new BoxGeometry(3,distance,0.25);
    const wallMesh = new Mesh(boxGeo, new MeshBasicMaterial({color: wallColor}));
    const lineAngleToX = Math.atan((deltaY)/(deltaX));
    wallMesh.rotateY(lineAngleToX);
    wallMesh.rotateZ(Math.PI/2);
    wallMesh.position.set(x1 + (x2-x1)/2 ,3/2, -(y1 +(y2-y1)/2) );
    scene.add(wallMesh);
}

drawLineAndTranslateTo3D(1,2,1,4, 'red');
drawLineAndTranslateTo3D(1,2,4,2, 'blue');

function animate() {
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

