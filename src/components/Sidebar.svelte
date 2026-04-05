<script>
    import { Settings, Home, LayoutList, Palette, ChevronLeft, ChevronRight } from 'lucide-svelte';
    import { toastMessage } from '../store.js';
    export let activeRoute = 'home';
    
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
</script>

<aside class="{isCollapsed ? 'w-20' : 'w-64'} bg-card text-text h-full shadow-lg transition-all duration-300 flex flex-col justify-between border-r border-[#e2e8f0]/20 z-10 relative left-0 top-0">
    <div>
        <div class="flex items-center justify-between p-4 border-b border-[#e2e8f0]/20">
            {#if !isCollapsed}
                <div class="font-bold text-xl flex items-center gap-2 truncate">
                    <span class="text-[var(--accent)] font-black text-2xl">BG</span> Organizer
                </div>
            {/if}
            <button class="text-text/70 hover:text-text mx-auto" on:click={() => isCollapsed = !isCollapsed}>
                {#if isCollapsed} <ChevronRight size=24 /> {:else} <ChevronLeft size=24 /> {/if}
            </button>
        </div>
        
        <nav class="p-2 flex flex-col gap-2 mt-4">
            <button class="w-full flex items-center gap-4 p-3 rounded-lg transition-colors hover:bg-[var(--accent)] hover:text-white group {activeRoute === 'home' ? 'bg-[var(--accent)] text-white' : ''}" on:click={() => activeRoute = 'home'}>
                <Home size=24 class="flex-shrink-0 mx-auto" />
                {#if !isCollapsed} <span class="font-medium">Home Feed</span> {/if}
            </button>
            <button class="w-full flex items-center gap-4 p-3 rounded-lg transition-colors hover:bg-[var(--accent)] hover:text-white group {activeRoute === 'manager' ? 'bg-[var(--accent)] text-white' : ''}" on:click={() => activeRoute = 'manager'}>
                <LayoutList size=24 class="flex-shrink-0 mx-auto" />
                {#if !isCollapsed} <span class="font-medium">Game Manager</span> {/if}
            </button>
        </nav>
    </div>
    
    <div class="p-4 border-t border-[#e2e8f0]/20 flex flex-col gap-4">
        <div class="flex items-center gap-3 mb-2 text-text/70">
            <Palette size=20 class={isCollapsed ? "mx-auto" : ""} />
            {#if !isCollapsed} <span class="text-sm font-semibold uppercase tracking-wider">Themes</span> {/if}
        </div>
        {#if !isCollapsed}
            <div class="flex flex-col gap-2">
                {#each themes as theme}
                    <button class="text-left text-sm p-2 rounded {currentTheme === theme.id ? 'bg-[var(--accent)] text-white font-bold' : 'hover:bg-text/10'}" on:click={() => setTheme(theme.id)}>
                        {theme.label}
                    </button>
                {/each}
                {#if currentTheme === 'light' || currentTheme === 'dark'}
                    <div class="flex items-center gap-2 mt-2 p-2 pt-4 border-t border-[#e2e8f0]/20">
                        <span class="text-xs">Accent (Custom):</span>
                        <input type="color" bind:value={customAccentColor} class="w-6 h-6 rounded cursor-pointer border-0 p-0" />
                    </div>
                {/if}
            </div>
        {/if}
    </div>
</aside>
