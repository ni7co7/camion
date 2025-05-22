import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

// Mostrar texto "Cargando" al inicio y ocultarlo después de 5 segundos
setTimeout(() => {
    document.getElementById("loading").style.display = "none";
}, 5000);
setTimeout(() => {
    document.getElementById("titulo").style. filter="blur(10px)" ;
}, 2000);

setTimeout(() => {
    document.getElementById("subtitulo").style.display = "block";
}, 3000);

// Definir ciudades
const ciudad1 = "Río Tercero";
const ciudad2 = "Córdoba Capital";
// Mostrar en HTML
/* document.getElementById("texto").textContent = `${ciudad1} | ${ciudad2}`; */

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas,
        alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);
    // Habilitar las sombras en el renderer
    /* renderer.shadowMap.enabled = true; */
    /* renderer.shadowMap.type = THREE.PCFSoftShadowMap; */

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.5, 100);
    camera.position.set(0, 5, 0);


    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = .05;
    controls.enableZoom = true;
    controls.enableRotate = true;

    controls.enablePan = true;  // Permite mover la cámara en X e Y
    controls.minDistance = 10;   // Distancia mínima del zoom
    controls.maxDistance = 30;  // Distancia máxima del zoom
    /* controls.maxPolarAngle = Math.PI / 2; // Limita la rotación vertical */
    /* */

    const scene = new THREE.Scene();
    /* scene.fog = new THREE.FogExp2( 0xcccccc, 0.011 ); */
    /* scene.fog = new THREE.Fog( 0xcccccc, 25, 28 ); */


    // Reducir la luz ambiental para hacerlo más oscuro
    /* /* const ambientLight = new THREE.HemisphereLight( 0x000000, 1);  Luz ambiental tenue */
    const ambientLight = new THREE.HemisphereLight( 0xffffff, 100);  // Luz ambiental tenue
    ambientLight.position.set(0, 20, 0);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 100);
    pointLight.position.set(0, 20, 0);
    scene.add(pointLight);

    // Crear una luz direccional para iluminar el camión
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, -7); // Ajusta la posición de la luz
    directionalLight.castShadow = true; // Habilitar sombras
    scene.add(directionalLight);

    // Crear una luz direccional para iluminar ciudad2
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(-5, -10, 7); // Ajusta la posición de la luz
    directionalLight.castShadow = true; // Habilitar sombras
    scene.add(directionalLight2);


    // Crear el camión
    const loader = new GLTFLoader();
    let truck;

    loader.load('./van/scene.gltf', function (gltf) {
        truck = gltf.scene;
        truck.scale.set(1, 1, 1);
        truck.position.set(0, 0, 0);
        truck.rotation.y = 0;

        // Habilitar sombras en el camión
        truck.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;  // El camión proyecta sombras
                child.receiveShadow = true;  // El camión recibe sombras
            }

        });

        scene.add(truck);
    }, undefined, function (error) {
        console.error('Error al cargar el modelo:', error);
    });

    // Crear ciudad 2
    const loaderciudad2 = new GLTFLoader();
    let ciudad2;
    loader.load('./buildings_front/scene.gltf', function (gltf) {
        ciudad2 = gltf.scene;
        ciudad2.scale.set(.2, .2, .2);
        ciudad2.position.set(-19, 0, -20);
        ciudad2.rotation.y = -180;
        ciudad2.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
             });
        scene.add(ciudad2);
    }, undefined, function (error) {
        console.error('Error al cargar el modelo:', error);
    });

    // Cargar las texturas de carretera y pasto
    const textureLoader = new THREE.TextureLoader();
    const roadTexture = textureLoader.load('/paviment.png');
    const grassTexture = textureLoader.load('/grass.jpg');
    const rutaTexture = textureLoader.load('/ruta.jpg');

    roadTexture.wrapS = roadTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
    rutaTexture.wrapS =  rutaTexture.wrapT = THREE.RepeatWrapping;

    roadTexture.repeat.set(1, 1);
    grassTexture.repeat.set(1, 1);
    rutaTexture.repeat.set(1, 1);

    const planeGeometry = new THREE.PlaneGeometry(50, 50);
    const planeMaterial = new THREE.MeshStandardMaterial({
        map: grassTexture,
    });

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    scene.add(plane);

    const roadGeometry = new THREE.PlaneGeometry(10, 10);
    const roadMaterial = new THREE.MeshStandardMaterial({
        map: roadTexture
    });

    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.rotation.x = -Math.PI / 2;
    road.position.set(-19,0,-20);
    road.position.y = 0.01;
    scene.add(road);

    const rutaGeometry = new THREE.PlaneGeometry(1, 50);
    const rutaMaterial = new THREE.MeshStandardMaterial({
        map: rutaTexture
    });

    const ruta= new THREE.Mesh(rutaGeometry, rutaMaterial);
    ruta.rotation.x = -Math.PI / 2;
    ruta.position.set(10,0.01,0);
    ruta.position.y = 0.01;
    scene.add(ruta);

    const ruta2Geometry = new THREE.PlaneGeometry(12, 1);
    const ruta2Material = new THREE.MeshStandardMaterial({
        map: rutaTexture
    });

    const ruta2= new THREE.Mesh(rutaGeometry, rutaMaterial);
    ruta2.rotation.x = -Math.PI / 2;
    ruta2.rotation.z = Math.PI / 2.3;
    ruta2.position.set(0,0.01,-15);
    ruta2.position.y = 0.001;
    scene.add(ruta2);

    const keys = {};
    window.addEventListener('keydown', (event) => (keys[event.key.toLowerCase()] = true));
    window.addEventListener('keyup', (event) => (keys[event.key.toLowerCase()] = false));

    const truckSpeed = 0.3;
    const rotationSpeed = 0.05;
    let followTruck = false;

    // Variables para controles táctiles
    let touchStartX = null;
    let touchStartY = null;
    const swipeThreshold = 50; // Sensibilidad del deslizamiento

    canvas.addEventListener('touchstart', (event) => {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
    }, false);

    canvas.addEventListener('touchend', (event) => {
        touchStartX = null;
        touchStartY = null;
    }, false);

    canvas.addEventListener('touchmove', (event) => {
        if (!touchStartX || !touchStartY || !truck) return;

        const touchEndX = event.touches[0].clientX;
        const touchEndY = event.touches[0].clientY;

        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Deslizamiento horizontal (izquierda/derecha para girar)
            if (deltaX > swipeThreshold) {
                truck.rotation.y -= rotationSpeed; // Girar a la derecha
            } else if (deltaX < -swipeThreshold) {
                truck.rotation.y += rotationSpeed; // Girar a la izquierda
            }
        } else {
            // Deslizamiento vertical (arriba/abajo para avanzar/retroceder)
            if (deltaY < -swipeThreshold) {
                const forwardDirection = new THREE.Vector3(0, 0, 1).applyQuaternion(truck.quaternion);
                truck.position.add(forwardDirection.multiplyScalar(truckSpeed)); // Avanzar
            } else if (deltaY > swipeThreshold) {
                const backwardDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(truck.quaternion);
                truck.position.add(backwardDirection.multiplyScalar(truckSpeed)); // Retroceder
            }
        }

        touchStartX = touchEndX;
        touchStartY = touchEndY;
    }, false);


    function moveTruck() {
        if (truck) {
            const newPosition = truck.position.clone();

            if (keys['s'] || keys['arrowdown']) {
                newPosition.z -= Math.cos(truck.rotation.y) * truckSpeed;
                newPosition.x -= Math.sin(truck.rotation.y) * truckSpeed;
            }
            if (keys['w'] || keys['arrowup']) {
                newPosition.z += Math.cos(truck.rotation.y) * truckSpeed;
                newPosition.x += Math.sin(truck.rotation.y) * truckSpeed;
            }
            if (keys['a'] || keys['arrowleft']) {
                truck.rotation.y += rotationSpeed;
            }
            if (keys['d'] || keys['arrowright']) {
                truck.rotation.y -= rotationSpeed;
            }

            // Hacer que la cámara siga siempre al camion desde atrás */
            const cameraOffset = new THREE.Vector3(0, 2, -3); // Cámara detrás y arriba
            const rotatedOffset = cameraOffset.clone().applyMatrix4(new THREE.Matrix4().makeRotationY(truck.rotation.y));
            const newCameraPos = truck.position.clone().add(rotatedOffset);
            camera.position.lerp(newCameraPos, 0.1); // Movimiento suave
            camera.lookAt(truck.position);

            followTruck = true;
            truck.position.copy(newPosition);
        }
    }


    function createSmoke() {
        const smokeGeometry = new THREE.SphereGeometry(0.2, 8, 8);
        const smokeMaterial = new THREE.MeshBasicMaterial({
            color: 0x555555,
            transparent: true,
            opacity: 0.3
        });
        const smoke = new THREE.Mesh(smokeGeometry, smokeMaterial);
        if (truck) {
            smoke.position.set(
                truck.position.x - Math.sin(truck.rotation.y),
                truck.position.y + .2,
                truck.position.z - Math.cos(truck.rotation.y)
            );
            scene.add(smoke);

            const randomColor = Math.random() > 0.5 ? 0x888888 : 0x666666;
            smoke.material.color.set(randomColor);

            const smokeLifetime = 2000;
            const displacementSpeed = 0.02;

            function animateSmoke() {
                smoke.position.y += displacementSpeed;
                smoke.material.opacity -= 0.001;
                if (smoke.material.opacity <= 0) {
                    scene.remove(smoke);
                } else {
                    requestAnimationFrame(animateSmoke);
                }
            }
            animateSmoke();
        }
    }


    function animate() {
        moveTruck();
        if (truck && (keys['w'] || keys['s'] || keys['arrowup'] || keys['arrowdown'])) {
            createSmoke();
            if (followTruck) {
                camera.position.set(truck.position.x + 1, 2, truck.position.z +  6);
                camera.lookAt(truck.position);
                scene.fog = new THREE.FogExp2( 0xcccccc, 0.023 );
           }
        }
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    animate();
}

main();