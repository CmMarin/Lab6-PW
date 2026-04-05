<script context="module">
    // Global texture cache to prevent re-fetching and flickering when filtering/switching views
    const textureCache = new Map();
</script>

<script>
    import { onMount, onDestroy } from 'svelte';
    import * as THREE from 'three';
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

    export let imageUrl = ''; // The board game cover art
    export let title = ''; // Box spine title

    let container;
    let renderer, scene, camera, controls, animationId, resizeObserver;
    let box; // keep a reference to out box so we can update its materials

    onMount(() => {
        // Core Setup
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
        camera.position.set(0, 1.5, 8); // Pulled back slightly so the glowing aura doesn't clip at the canvas edges

        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // Lighting Setup
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.4); // Doubled brightness to fix dark boxes
        scene.add(ambientLight);
        
        const dirLight = new THREE.DirectionalLight(0xffffff, 1.0); // Boosted directional lighting
        dirLight.position.set(5, 5, 5);
        scene.add(dirLight);

        // Box Geometry representing a standard board game box (width: 3, height: 4, depth: 0.8)
        const geometry = new THREE.BoxGeometry(3, 4, 0.8);

        // Material Array: [Right, Left, Top, Bottom, Front, Back]
        const fallbackMaterial = new THREE.MeshStandardMaterial({ color: 0xeaeaea, roughness: 0.8 });
        let materials = [fallbackMaterial, fallbackMaterial, fallbackMaterial, fallbackMaterial, fallbackMaterial, fallbackMaterial];

        // We MUST add the fallback box to the scene BEFORE checking the cache.
        box = new THREE.Mesh(geometry, materials);
        scene.add(box);

        // Neo-Brutalist Outlines: 
        // Create an edges geometry and line segments, added as a child to the box so it rotates with it!
        const edges = new THREE.EdgesGeometry(geometry);
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 }));
        box.add(line);

        function applyTexture(texture) {
            if (!scene || !box) return; // Guard against applying texture to destroyed component
            texture.colorSpace = THREE.SRGBColorSpace;
                
            // 1. Dominant Color Extraction (Client-Side)
            let dominantColor = new THREE.Color(0xcccccc); // Default matte gray fallback
            let rgbValues = '204, 204, 204';
            if (texture.image) {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = 1;
                    canvas.height = 1;
                    const ctx = canvas.getContext('2d', { willReadFrequently: true });
                    ctx.drawImage(texture.image, 0, 0, 1, 1);
                    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
                    dominantColor = new THREE.Color(`rgb(${r}, ${g}, ${b})`);
                    rgbValues = `${r}, ${g}, ${b}`;
                } catch (err) {
                    console.warn("Could not extract dominant color, CORS issue or image not ready. Using fallback.", err);
                }
            }

            // Apply glowing aura using CSS drop-shadow on the transparent WebGL canvas
            if (renderer && renderer.domElement) {
                // Stacked drop-shadows make the aura much more vibrant and noticeable
                renderer.domElement.style.filter = `drop-shadow(0 0 15px rgba(${rgbValues}, 0.9)) drop-shadow(0 0 40px rgba(${rgbValues}, 0.6))`;
                renderer.domElement.style.transition = 'filter 0.5s ease';
            }

            // 2. Dynamic Spine generation (Sideways Title + extracted background)
            const spineCanvas = document.createElement('canvas');
            spineCanvas.width = 128;   // representing the depth roughly
            spineCanvas.height = 1024; // representing the height roughly
            const spineCtx = spineCanvas.getContext('2d');

            // Fill with Dominant Color
            spineCtx.fillStyle = dominantColor.getStyle();
            spineCtx.fillRect(0, 0, spineCanvas.width, spineCanvas.height);

            // Add text if title exists
            if (title) {
                spineCtx.fillStyle = '#ffffff'; // White text
                spineCtx.font = 'bold 80px monospace';
                spineCtx.textAlign = 'center';
                spineCtx.textBaseline = 'middle';
                
                // Move to center, rotate sideways
                spineCtx.translate(spineCanvas.width / 2, spineCanvas.height / 2);
                spineCtx.rotate(Math.PI / 2);
                
                // Neobrutalist thick black stroke around spine text
                spineCtx.lineWidth = 10;
                spineCtx.strokeStyle = '#000000';
                spineCtx.strokeText(title, 0, 0);
                spineCtx.fillText(title, 0, 0);
            }

            const spineTexture = new THREE.CanvasTexture(spineCanvas);
            spineTexture.colorSpace = THREE.SRGBColorSpace;

            // 3. Materials Assignment
            // Bright texture for the front cover
            const frontMat = new THREE.MeshStandardMaterial({ 
                map: texture,
                roughness: 0.2, // Smoother/more glossy box
                metalness: 0.05,
                color: 0xffffff
            });
            
            // Side Spines (Left / Right) with text
            const spineMat = new THREE.MeshStandardMaterial({ 
                map: spineTexture,
                roughness: 0.9,
                color: 0xffffff 
            });

            // Solid Stylized Sides for Top, Bottom, Back
            const solidMat = new THREE.MeshStandardMaterial({
                color: dominantColor,
                roughness: 0.9
            });
            
            // Material array maps to: [Right, Left, Top, Bottom, Front, Back]
            box.material = [spineMat, spineMat, solidMat, solidMat, frontMat, frontMat];
        }

        if (imageUrl) {
            if (textureCache.has(imageUrl)) {
                // Instantly apply cached texture, preventing networking/flickering
                applyTexture(textureCache.get(imageUrl));
            } else {
                const textureLoader = new THREE.TextureLoader();
                // Enable CORS so getImageData extraction works!
                textureLoader.setCrossOrigin('anonymous'); 
                textureLoader.load(imageUrl, (texture) => {
                    textureCache.set(imageUrl, texture);
                    applyTexture(texture);
                }, undefined, (error) => {
                    console.error("Texture Loading Error:", error);
                });
            }
        }

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
        
        if (scene) {
            scene.traverse((object) => {
                if (object.geometry) object.geometry.dispose();
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach(material => {
                            if (material.map) material.map.dispose();
                            material.dispose();
                        });
                    } else {
                        if (object.material.map) object.material.map.dispose();
                        object.material.dispose();
                    }
                }
            });
            scene = null;
        }

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
