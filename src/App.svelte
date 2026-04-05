<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import Sidebar from './components/Sidebar.svelte';
    import Home from './views/Home.svelte';
    import Manager from './views/Manager.svelte';
    
    let activeRoute = 'home'; // 'home' | 'manager'
    
    // Theme Initialisation
    onMount(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        const savedAccent = localStorage.getItem('accentColor');
        if (savedAccent && ['light', 'dark'].includes(savedTheme)) {
            document.documentElement.style.setProperty('--accent', savedAccent);
        }
    });
</script>

<div class="flex h-screen overflow-hidden">
    <Sidebar bind:activeRoute />
    
    <main class="flex-1 overflow-x-hidden overflow-y-auto bg-bg transition-colors duration-300 relative">
        {#key activeRoute}
            <div in:fade="{{ duration: 300, delay: 100 }}" out:fade="{{ duration: 100 }}" class="absolute inset-0 w-full h-full">
                {#if activeRoute === 'home'}
                    <Home />
                {:else if activeRoute === 'manager'}
                    <Manager />
                {/if}
            </div>
        {/key}
    </main>
</div>
