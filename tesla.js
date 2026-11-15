import * as THREE from 'three';

import { OrbitControls } from
'three/addons/controls/OrbitControls.js';

const container = document.getElementById('car-container');

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
);

camera.position.set(6, 4, 8);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

renderer.setSize(
    container.clientWidth,
    container.clientHeight
);

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.shadowMap.enabled = true;

renderer.shadowMap.type = THREE.PCFSoftShadowMap;

container.appendChild(renderer.domElement);


// CAMERA CONTROLS

const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2.05;


// LIGHTING

const ambientLight = new THREE.AmbientLight(
    0xffffff,
    1.5
);

scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(
    0xffffff,
    3
);

mainLight.position.set(5, 10, 7);

mainLight.castShadow = true;

scene.add(mainLight);


// FLOOR

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    new THREE.MeshStandardMaterial({
        color: 0x171717,
        roughness: 0.8
    })
);

floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.65;
floor.receiveShadow = true;

scene.add(floor);


// CAR GROUP

const car = new THREE.Group();

scene.add(car);


// MATERIALS

const carMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.7,
    roughness: 0.25
});

const glassMaterial = new THREE.MeshStandardMaterial({
    color: 0x111827,
    metalness: 0.5,
    roughness: 0.15
});

const tireMaterial = new THREE.MeshStandardMaterial({
    color: 0x101010,
    roughness: 0.9
});

const wheelMaterial = new THREE.MeshStandardMaterial({
    color: 0xaaaaaa,
    metalness: 0.9,
    roughness: 0.2
});


// CAR BODY

const body = new THREE.Mesh(
    new THREE.BoxGeometry(4, 0.65, 1.8),
    carMaterial
);

body.position.y = 0;

body.castShadow = true;

car.add(body);


// CAR TOP

const roof = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 0.65, 1.45),
    glassMaterial
);

roof.position.set(-0.15, 0.55, 0);

car.add(roof);


// HOOD

const hood = new THREE.Mesh(
    new THREE.BoxGeometry(1.1, 0.15, 1.75),
    carMaterial
);

hood.position.set(1.65, 0.15, 0);

car.add(hood);


// TRUNK

const trunk = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.15, 1.75),
    carMaterial
);

trunk.position.set(-1.55, 0.15, 0);

car.add(trunk);


// WHEELS

const wheels = [];

function createWheel(x, z) {

    const wheel = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.48,
            0.48,
            0.28,
            32
        ),
        tireMaterial
    );

    wheel.rotation.x = Math.PI / 2;

    wheel.position.set(x, -0.3, z);

    car.add(wheel);

    const rim = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.29,
            0.29,
            0.3,
            16
        ),
        wheelMaterial
    );

    rim.rotation.x = Math.PI / 2;

    rim.position.set(x, -0.3, z * 1.02);

    car.add(rim);

    wheels.push(rim);
}

createWheel(1.3, 0.9);
createWheel(1.3, -0.9);
createWheel(-1.3, 0.9);
createWheel(-1.3, -0.9);


// HEADLIGHTS

const lightMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff
});

function createHeadlight(z) {

    const light = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.12, 0.35),
        lightMaterial
    );

    light.position.set(2.02, 0.05, z);

    car.add(light);
}

createHeadlight(0.55);
createHeadlight(-0.55);


// CENTER CAR

car.position.y = 0;


// COLOUR CUSTOMIZATION

document.querySelectorAll('.color').forEach(button => {

    button.addEventListener('click', () => {

        const selectedColor = button.dataset.color;

        carMaterial.color.set(selectedColor);

        document.querySelectorAll('.color')
            .forEach(item => item.classList.remove('active'));

        button.classList.add('active');

    });

});


// WHEEL CUSTOMIZATION

document.getElementById('wheelStyle')
.addEventListener('change', (event) => {

    const style = event.target.value;

    if (style === 'sport') {
        wheelMaterial.color.set('#aaaaaa');
    }

    if (style === 'luxury') {
        wheelMaterial.color.set('#d4af37');
    }

    if (style === 'standard') {
        wheelMaterial.color.set('#555555');
    }

});


// DESIGN GENERATOR

document.getElementById('generateBtn')
.addEventListener('click', generateDesign);

document.getElementById('designPrompt')
.addEventListener('keydown', event => {

    if (event.key === 'Enter' && !event.shiftKey) {

        event.preventDefault();

        generateDesign();

    }

});


function generateDesign() {

    const prompt = document
        .getElementById('designPrompt')
        .value.toLowerCase();

    const status = document.getElementById('status');

    status.textContent = 'Creating your design...';

    setTimeout(() => {

        if (prompt.includes('black')) {
            carMaterial.color.set('#171717');
        }

        else if (prompt.includes('red')) {
            carMaterial.color.set('#b90000');
        }

        else if (prompt.includes('white')) {
            carMaterial.color.set('#ffffff');
        }

        else if (prompt.includes('blue')) {
            carMaterial.color.set('#243b63');
        }

        else if (prompt.includes('gold')) {
            carMaterial.color.set('#d5b78d');
        }

        if (prompt.includes('luxury')) {
            wheelMaterial.color.set('#d4af37');
        }

        else if (prompt.includes('sport')) {
            wheelMaterial.color.set('#aaaaaa');
        }

        status.textContent = 'Your design has been applied!';

    }, 1200);

}


// QUICK PRESETS

document.querySelectorAll('[data-preset]')
.forEach(button => {

    button.addEventListener('click', () => {

        const preset = button.dataset.preset;

        if (preset === 'black') {
            carMaterial.color.set('#171717');
        }

        if (preset === 'red') {
            carMaterial.color.set('#b90000');
        }

        if (preset === 'white') {
            carMaterial.color.set('#ffffff');
        }

    });

});


// RESET

document.getElementById('resetBtn')
.addEventListener('click', () => {

    carMaterial.color.set('#ffffff');

    wheelMaterial.color.set('#aaaaaa');

    document.getElementById('designPrompt').value = '';

    document.getElementById('wheelStyle').value = 'sport';

    document.getElementById('status').textContent = '';

});


// RESPONSIVE RESIZING

window.addEventListener('resize', () => {

    camera.aspect =
        container.clientWidth / container.clientHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        container.clientWidth,
        container.clientHeight
    );

});


// ANIMATION

function animate() {

    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);

}

animate();