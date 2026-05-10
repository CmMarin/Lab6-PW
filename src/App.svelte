<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import Sidebar from './components/Sidebar.svelte';
    import Toast from './components/Toast.svelte';
    import GameDetailsModal from './components/GameDetailsModal.svelte';
    import TableSetupAssistant from './components/TableSetupAssistant.svelte';
    import BoardBuddy from './components/BoardBuddy.svelte';
    import DecideGame from './views/DecideGame.svelte';
    import Home from './views/Home.svelte';
    import Manager from './views/Manager.svelte';
    import Settings from './views/Settings.svelte';
    import Login from './views/Login.svelte';
    import { Menu, LogOut } from 'lucide-svelte';
    import BackgroundScatter from './components/BackgroundScatter.svelte';
    import { tokenStore, roleStore, toastMessage } from './store.js';

    // Core Application State
    let activeRoute = 'login'; // 'login' | 'home' | 'manager' | 'settings' | 'decide'
    let isMobileOpen = false; // Controls off-canvas sidebar
    
    // Web Programming Lab Requirement: Local Storage Theming
    // Reads from localStorage on mount so themes persist without a DB
    onMount(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        const storedToken = sessionStorage.getItem('token');
        if (!storedToken) {
            activeRoute = 'login';
        } else {
            // Check token validity (basic check)
            try {
                const base64Url = storedToken.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                const decoded = JSON.parse(jsonPayload);
                if (decoded && decoded.exp && decoded.exp > Date.now() / 1000) {
                    activeRoute = 'home';
                } else {
                    activeRoute = 'login';
                }
            } catch(e) {
                activeRoute = 'login';
            }
        }
        
        window.addEventListener('token-expired', () => {
            $toastMessage = "Session expired — please log in again";
            setTimeout(() => {
                activeRoute = 'login';
            }, 1500);
        });
    });

    function logout() {
        $tokenStore = null;
        $roleStore = null;
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('role');
        activeRoute = 'login';
    }
</script>

<!-- Application Layout Routing -->
{#if activeRoute === 'login'}
    <!-- Login is rendered purely outside of any other styling -->
    <Login proceed={() => activeRoute = 'home'} />
{:else}
    <!-- Application Shell -->
    <div class="flex h-[100dvh] overflow-hidden bg-bg relative z-0">
        <BackgroundScatter />

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
        
        <main class="flex-1 flex flex-col transition-colors duration-300 relative z-10 w-full overflow-hidden">
            <!-- Mobile Header Navigation -->
            <header class="md:hidden flex items-center justify-between p-4 border-b-[4px] border-[var(--border-color)] bg-[var(--card-bg)] shadow-[0_4px_0_0_var(--theme-black)] z-50">
                <div class="font-display text-4xl flex flex-col leading-none uppercase tracking-wider drop-shadow-[2px_2px_0_var(--theme-black)] text-[var(--panel-text)]">
                    <span class="text-[var(--chip-text)] bg-[var(--accent)] px-2 border-2 border-[var(--border-color)] w-fit rotate-2 mb-1 drop-shadow-[2px_2px_0_var(--theme-black)]">Board</span> 
                    & Order
                </div>
                <button class="p-2 rounded-none bg-[var(--button-bg)] text-[var(--button-text)] hover:bg-[var(--accent)] hover:text-white border-2 border-[var(--border-color)] shadow-[2px_2px_0_var(--theme-black)] transition-colors" on:click={() => isMobileOpen = true}>
                    <Menu size=32 />
                </button>
            </header>

            <!-- Top right LOGOUT controls on desktop (hidden on mobile header logic) -->
            <div class="absolute top-4 right-4 z-50 flex items-center gap-2">
                <div class="hidden md:flex items-center gap-2 bg-white brutal-border-sm px-3 py-1 shadow-[2px_2px_0_var(--theme-black)]">
                    <span class="font-mono text-xs font-bold uppercase tracking-widest text-[var(--accent)]">
                        {#if $roleStore === 'ADMIN'}
                            👑 ADMIN
                        {:else if $roleStore === 'WRITER'}
                            ✏️ WRITER
                        {:else}
                            🎲 VISITOR
                        {/if}
                    </span>
                </div>
                <button 
                    on:click={logout}
                    class="bg-white text-black hover:bg-black hover:text-white brutal-border-sm p-2 shadow-[2px_2px_0_var(--theme-black)] transition-colors group relative"
                    title="Logout"
                >
                    <LogOut size=20 />
                </button>
            </div>

            <!-- Dynamic Route Area with Svelte Page Transitions -->
            <div class="flex-1 relative w-full h-full overflow-hidden">
                {#key activeRoute}
                    <div in:fade="{{ duration: 300, delay: 100 }}" out:fade="{{ duration: 100 }}" class="absolute inset-0 w-full h-full overflow-y-auto overflow-x-hidden brutal-scrollbar">
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
        <TableSetupAssistant />
        <BoardBuddy />
    </div>
{/if}
