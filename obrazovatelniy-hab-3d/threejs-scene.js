// Профессиональная 3D сцена для Образовательного Хаба
class ThreeJSScene {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = [];
        this.geometries = [];
        this.mouse = { x: 0, y: 0 };
        this.init();
    }

    init() {
        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.createLights();
        this.createParticles();
        this.createGeometries();
        this.createEventListeners();
        this.animate();
    }

    createScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x0a0a2e, 0.0008);
    }

    createCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 50;
        this.camera.position.y = 10;
    }

    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('threejs-canvas'),
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    createLights() {
        // Основной свет
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);

        // Точечный свет
        const pointLight1 = new THREE.PointLight(0x00ff88, 1, 100);
        pointLight1.position.set(25, 25, 25);
        pointLight1.castShadow = true;
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0xff0088, 1, 100);
        pointLight2.position.set(-25, 25, -25);
        pointLight2.castShadow = true;
        this.scene.add(pointLight2);

        // Направленный свет
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0, 50, 50);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
    }

    createParticles() {
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 5000;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 200;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.5,
            color: 0x00ffff,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        this.scene.add(particlesMesh);
        this.particles.push(particlesMesh);
    }

    createGeometries() {
        // Вращающийся куб (образование)
        const cubeGeometry = new THREE.BoxGeometry(5, 5, 5);
        const cubeMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ff88,
            emissive: 0x002211,
            shininess: 100,
            transparent: true,
            opacity: 0.8
        });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(-20, 0, -20);
        cube.castShadow = true;
        this.scene.add(cube);
        this.geometries.push({ mesh: cube, rotationSpeed: { x: 0.01, y: 0.02, z: 0.01 } });

        // Сфера (знания)
        const sphereGeometry = new THREE.SphereGeometry(3, 32, 32);
        const sphereMaterial = new THREE.MeshPhongMaterial({
            color: 0xff0088,
            emissive: 0x220011,
            shininess: 100,
            transparent: true,
            opacity: 0.8
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(20, 0, -20);
        sphere.castShadow = true;
        this.scene.add(sphere);
        this.geometries.push({ mesh: sphere, rotationSpeed: { x: 0.02, y: 0.01, z: 0.01 } });

        // Тор (технологии)
        const torusGeometry = new THREE.TorusGeometry(4, 1.5, 16, 100);
        const torusMaterial = new THREE.MeshPhongMaterial({
            color: 0xffff00,
            emissive: 0x222200,
            shininess: 100,
            transparent: true,
            opacity: 0.8
        });
        const torus = new THREE.Mesh(torusGeometry, torusMaterial);
        torus.position.set(0, 10, -30);
        torus.castShadow = true;
        this.scene.add(torus);
        this.geometries.push({ mesh: torus, rotationSpeed: { x: 0.01, y: 0.03, z: 0.01 } });

        // Конус (достижения)
        const coneGeometry = new THREE.ConeGeometry(3, 6, 32);
        const coneMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ffff,
            emissive: 0x002222,
            shininess: 100,
            transparent: true,
            opacity: 0.8
        });
        const cone = new THREE.Mesh(coneGeometry, coneMaterial);
        cone.position.set(0, -10, -25);
        cone.castShadow = true;
        this.scene.add(cone);
        this.geometries.push({ mesh: cone, rotationSpeed: { x: 0.02, y: 0.02, z: 0.01 } });
    }

    createEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('mousemove', (event) => this.onMouseMove(event));
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Анимация частиц
        this.particles.forEach(particle => {
            particle.rotation.y += 0.0005;
            particle.rotation.x += 0.0002;
        });

        // Анимация геометрий
        this.geometries.forEach(geo => {
            geo.mesh.rotation.x += geo.rotationSpeed.x;
            geo.mesh.rotation.y += geo.rotationSpeed.y;
            geo.mesh.rotation.z += geo.rotationSpeed.z;

            // Плавающее движение
            geo.mesh.position.y += Math.sin(Date.now() * 0.001 + geo.mesh.position.x) * 0.01;
        });

        // Интерактивность с мышью
        this.camera.position.x += (this.mouse.x * 5 - this.camera.position.x) * 0.05;
        this.camera.position.y += (this.mouse.y * 5 - this.camera.position.y) * 0.05;
        this.camera.lookAt(this.scene.position);

        this.renderer.render(this.scene, this.camera);
    }
}

// Инициализация сцены при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new ThreeJSScene();
});
