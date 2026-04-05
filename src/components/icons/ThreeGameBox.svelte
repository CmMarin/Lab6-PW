<script>
    import { onMount, onDestroy } from 'svelte';
    import * as THREE from 'three';
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

    export let imageUrl = ''; // The board game cover art

    let container;
    let renderer, scene, camera, controls, animationId, resizeObserver;

    onMount(() => {
        // Core Setup
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
        camera.position.set(0, 1.5, 6);

        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);
        
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
        dirLight.position.set(5, 5, 5);
        scene.add(dirLight);

        // Box Geometry representing a standard board game box (width: 3, height: 4, depth: 0.8)
        const geometry = new THREE.BoxGeometry(3, 4, 0.8);

        // Material Array: [Right, Left, Top, Bottom, Front, Back]
        const fallbackMaterial = new THREE.MeshStandardMaterial({ color: 0xeaeaea, roughness: 0.8 });
        
        let materials = [fallbackMaterial, fallbackMaterial, fallbackMaterial, fallbackMaterial, fallbackMaterial, fallbackMaterial];

        if (imageUrl) {
            const textureLoader = new THREE.TextureLoader();
            textureLoader.setCrossOrigin(''); // Some servers reject 'anonymous' explicitly, empty string allows best fallback
            textureLoader.load(imageUrl, (texture) => {
                texture.colorSpace = THREE.SRGBColorSpace;
                
                // Bright texture for the front cover
                const frontMat = new THREE.MeshStandardMaterial({ 
                    map: texture,
                    roughness: 0.3,
                    metalness: 0.1,
                    color: 0xffffff
                });
                
                // Dimmed texture mapped for sides to look like a true box
                const sideMat = new THREE.MeshStandardMaterial({ 
                    map: texture,
                    roughness: 0.8,
                    metalness: 0.05,
                    color: 0x888888 
                });
                
                // Material array maps to: [Right, Left, Top, Bottom, Front, Back]
                scene.children.forEach(child => {
                    if(child.isMesh) {
                        child.material = [sideMat, sideMat, sideMat, sideMat, frontMat, sideMat];
                    }
                });
            }, undefined, (error) => {
                console.error("Texture Loading Error:", error);
            });
        }

        const box = new THREE.Mesh(geometry, materials);
        scene.add(box);

        // Controls (OrbitControls automatically traps mouse events, preventing Swiper from swiping)
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = false; // Disable zooming to keep it framed
        controls.enablePan = false;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 2.0;
        // Limit vertical rotation so you don't stare at the bottom of the box
        controls.minPolarAngle = Math.PI / 4; 
        controls.maxPolarAngle = Math.PI / 2 + 0.2; 

        // Handle Resizing dynamically
        resizeObserver = new ResizeObserver(() => {
            if (!container || !renderer || !camera) return;
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
        resizeObserver.observe(container);

        // Animation Loop
        const animate = () => {
            animationId = requestAnimationFrame(animate);
            controls.update(); // Required for damping & autoRotate
            renderer.render(scene, camera);
        };
        animate();
    });

    onDestroy(() => {
        if (animationId) cancelAnimationFrame(animationId);
        if (resizeObserver) resizeObserver.disconnect();
        
        if (renderer) {
            renderer.dispose();
            if (container && container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        }
    });

</script>

<!-- The class `swiper-no-swiping` natively blocks Swiper JS from capturing touch events on this div -->
<div bind:this={container} class="w-full h-full swiper-no-swiping cursor-grab active:cursor-grabbing block"></div>
