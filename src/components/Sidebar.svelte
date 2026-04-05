<script>
    import { Settings, Home, LayoutList, Palette, ChevronLeft, ChevronRight, X } from 'lucide-svelte';
    import { toastMessage } from '../store.js';
    export let activeRoute = 'home';
    export let isMobileOpen = false;
    
    let isCollapsed = false;
    let currentTheme = localStorage.getItem('theme') || 'light';
    let customAccentColor = localStorage.getItem('accentColor') || '#3b82f6';
    
    const themes = [
        { id: 'light', label: 'Light' },
        { id: 'dark', label: 'Dark' },
        { id: 'tavern', label: 'Tavern' },
        { id: 'neon', label: 'Neon Arcade' }
    ];

    function setTheme(theme) {
        currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        if (theme === 'light' || theme === 'dark') {
            document.documentElement.style.setProperty('--accent', customAccentColor);
        } else {
            // Revert back to CSS governed accent for styled themes
            document.documentElement.style.setProperty('--accent', '');
        }
        
        $toastMessage = `Theme updated: ${theme}`;
    }

    $: if (customAccentColor && ['light', 'dark'].includes(currentTheme)) {
        document.documentElement.style.setProperty('--accent', customAccentColor);
        localStorage.setItem('accentColor', customAccentColor);
    }

    function navigate(route) {
        activeRoute = route;
        isMobileOpen = false; // Close sidebar on mobile after navigation
    }
</script>

<aside class="
    {isCollapsed ? 'md:w-20' : 'md:w-64'} 
    {isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    fixed md:relative left-0 top-0 w-[80vw] sm:w-[50vw]
    bg-card text-text h-full shadow-2xl md:shadow-lg transition-all duration-300 flex flex-col justify-between border-r border-[#e2e8f0]/20 z-50
">
    <div>
        <div class="flex items-center justify-between p-4 border-b border-[#e2e8f0]/20">
            {#if !isCollapsed}
                <div class="font-bold text-xl flex items-center gap-2 truncate">
                    <span class="text-[var(--accent)] font-black text-2xl">BG</span> Organizer
                </div>
            {/if}
            <div class="flex gap-2">
                <!-- Desktop Collapse Toggle -->
                <button class="text-text/70 hover:text-text hidden md:block" on:click={() => isCollapsed = !isCollapsed}>
                    {#if isCollapsed} <ChevronRight size=24 /> {:else} <ChevronLeft size=24 /> {/if}
                </button>
                <!-- Mobile Close Toggle -->
                <button class="md:hidden text-text/70 hover:text-red-500 transition-colors bg-text/10 p-1 rounded-full" on:click={() => isMobileOpen = false}>
                    <X size=20 />
                </button>
            </div>
        </div>
        
        <nav class="p-2 flex flex-col gap-2 mt-4">
            <button class="w-full flex items-center gap-4 p-3 rounded-lg transition-colors hover:bg-[var(--accent)] hover:text-white group {activeRoute === 'home' ? 'bg-[var(--accent)] text-white' : ''}" on:click={() => navigate('home')}>
                <Home size=24 class="flex-shrink-0 mx-auto md:mx-0 {isCollapsed ? 'md:mx-auto' : ''}" />
                <span class="font-medium {isCollapsed ? 'md:hidden' : ''}">Home Feed</span>
            </button>
            <button class="w-full flex items-center gap-4 p-3 rounded-lg transition-colors hover:bg-[var(--accent)] hover:text-white group {activeRoute === 'manager' ? 'bg-[var(--accent)] text-white' : ''}" on:click={() => navigate('manager')}>
                <LayoutList size=24 class="flex-shrink-0 mx-auto md:mx-0 {isCollapsed ? 'md:mx-auto' : ''}" />
                <span class="font-medium {isCollapsed ? 'md:hidden' : ''}">Game Manager</span>
            </button>
            <button class="w-full flex items-center gap-4 p-3 rounded-lg transition-colors hover:bg-[var(--accent)] hover:text-white group {activeRoute === 'settings' ? 'bg-[var(--accent)] text-white' : ''}" on:click={() => navigate('settings')}>
                <Settings size=24 class="flex-shrink-0 mx-auto md:mx-0 {isCollapsed ? 'md:mx-auto' : ''}" />
                <span class="font-medium {isCollapsed ? 'md:hidden' : ''}">Settings</span>
            </button>
        </nav>
    </div>
    
    <div class="p-4 border-t border-[#e2e8f0]/20 flex flex-col gap-4">
        <div class="flex items-center gap-3 mb-2 text-text/70 justify-center md:justify-start">
            <Palette size=20 class={isCollapsed ? "md:mx-auto" : ""} />
            <span class="text-sm font-semibold uppercase tracking-wider {isCollapsed ? 'md:hidden' : ''}">Themes</span>
        </div>
        <div class="flex flex-col gap-2 {isCollapsed ? 'md:hidden' : ''}">
            {#each themes as theme}
                <button class="text-left text-sm p-2 rounded {currentTheme === theme.id ? 'bg-[var(--accent)] text-white font-bold' : 'hover:bg-text/10'}" on:click={() => setTheme(theme.id)}>
                    {theme.label}
                </button>
            {/each}
            {#if currentTheme === 'light' || currentTheme === 'dark'}
                <div class="flex items-center gap-2 mt-2 p-2 pt-4 border-t border-[#e2e8f0]/20">
                    <span class="text-xs">Accent Color:</span>
                    <input type="color" bind:value={customAccentColor} class="w-6 h-6 rounded cursor-pointer border-0 p-0" />
                </div>
            {/if}
        </div>
    </div>
</aside>
