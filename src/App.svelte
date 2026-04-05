<script>
    import { onMount } from 'svelte';
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
        {#if activeRoute === 'home'}
            <Home />
        {:else if activeRoute === 'manager'}
            <Manager />
        {/if}
    </main>
</div>
