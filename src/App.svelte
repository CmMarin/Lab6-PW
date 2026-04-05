<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import Sidebar from './components/Sidebar.svelte';
    import Toast from './components/Toast.svelte';
    import GameDetailsModal from './components/GameDetailsModal.svelte';
    import Home from './views/Home.svelte';
    import Manager from './views/Manager.svelte';
    import Settings from './views/Settings.svelte';
    import { Menu } from 'lucide-svelte';
    
    // Core Application State
    let activeRoute = 'home'; // 'home' | 'manager' | 'settings'
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
        <header class="md:hidden flex items-center justify-between p-4 border-b border-border/10 bg-card shadow-sm z-30">
            <div class="font-bold text-xl flex items-center gap-2">
                <span class="text-[var(--accent)] font-black text-2xl">BG</span> Organizer
            </div>
            <button class="p-2 rounded-lg hover:bg-text/10 transition-colors" on:click={() => isMobileOpen = true}>
                <Menu size=24 />
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
                {/if}
            </div>
        {/key}
    </main>
    
    <Toast />
    <GameDetailsModal />
</div>
