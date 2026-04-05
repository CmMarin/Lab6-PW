<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import Sidebar from './components/Sidebar.svelte';
    import Toast from './components/Toast.svelte';
    import GameDetailsModal from './components/GameDetailsModal.svelte';
    import DecideGame from './views/DecideGame.svelte';
    import Home from './views/Home.svelte';
    import Manager from './views/Manager.svelte';
    import Settings from './views/Settings.svelte';
    import { Menu } from 'lucide-svelte';
    
    // Core Application State
    let activeRoute = 'home'; // 'home' | 'manager' | 'settings' | 'decide'
    let isMobileOpen = false; // Controls off-canvas sidebar
    
    // Web Programming Lab Requirement: Local Storage Theming
    // Reads from localStorage on mount so themes persist without a DB
    onMount(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        const savedAccent = localStorage.getItem('accentColor');
        if (savedAccent && ['light', 'dark'].includes(savedTheme)) {
            document.documentElement.style.setProperty('--accent', savedAccent);
        }
    });
</script>

<!-- Application Shell -->
<div class="flex h-screen overflow-hidden bg-bg">
    <!-- Responsive Drawer overlay -->
    {#if isMobileOpen}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div 
            class="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity backdrop-blur-sm" 
            in:fade={{ duration: 200 }} 
            out:fade={{ duration: 200 }}
            on:click={() => isMobileOpen = false} 
        ></div>
    {/if}

    <Sidebar bind:activeRoute bind:isMobileOpen />
    
    <main class="flex-1 flex flex-col overflow-hidden bg-bg transition-colors duration-300 relative">
        <!-- Mobile Header Navigation -->
        <header class="md:hidden flex items-center justify-between p-4 border-b-[4px] border-black bg-white shadow-[0_4px_0_0_#000] z-30">
            <div class="font-display text-4xl flex flex-col leading-none uppercase tracking-wider drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
                <span class="text-black bg-[var(--accent)] px-2 border-2 border-black w-fit rotate-2 mb-1 drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">BG</span> 
                Night
            </div>
            <button class="p-2 rounded-none bg-black text-white hover:bg-[var(--accent)] border-2 border-black shadow-[2px_2px_0_#000] transition-colors" on:click={() => isMobileOpen = true}>
                <Menu size=32 />
            </button>
        </header>

        <!-- Dynamic Route Area with Svelte Page Transitions -->
        <div class="flex-1 overflow-x-hidden overflow-y-auto relative">
            {#key activeRoute}
                <div in:fade="{{ duration: 300, delay: 100 }}" out:fade="{{ duration: 100 }}" class="absolute inset-0 w-full h-full">
                    {#if activeRoute === 'home'}
                        <Home />
                {:else if activeRoute === 'manager'}
                    <Manager />
                {:else if activeRoute === 'settings'}
                    <Settings />
                {:else if activeRoute === 'decide'}
                    <DecideGame onComplete={() => activeRoute = 'home'} onCancel={() => activeRoute = 'home'} />
                {/if}
            </div>
        {/key}
    </main>
    
    <Toast />
    <GameDetailsModal />
</div>
