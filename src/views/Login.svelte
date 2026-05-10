<script>
    import { onMount } from 'svelte';
    import { tokenStore, roleStore, apiConnected, toastMessage } from '../store.js';
    import { getToken } from '../api.js';
    import { Dices, Pencil, Crown, AlertTriangle } from 'lucide-svelte';

    // We'll dispatch a CustomEvent on login success for App to pick up, or we can just bind to a prop.
    // Actually, App.svelte listens to currentView or stores. We can just update stores.
    // Wait, the task says: check if valid non-expired token exists on mount, else wait for login.
    export let proceed = () => {};

    let selectedRole = 'VISITOR';
    let isOffline = false;
    let loading = false;

    // A simple function to decode JWT client-side
    function decodeJWT(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            return null;
        }
    }

    onMount(() => {
        const storedToken = sessionStorage.getItem('token');
        if (storedToken) {
            const decoded = decodeJWT(storedToken);
            if (decoded && decoded.exp && decoded.exp > Date.now() / 1000) {
                // Token still valid, skip login
                $tokenStore = storedToken;
                if (decoded.role) {
                    $roleStore = decoded.role;
                }
                proceed();
            }
        }
    });

    async function handleLogin() {
        loading = true;
        try {
            const res = await getToken({ role: selectedRole });
            if (res && res.token) {
                $tokenStore = res.token;
                sessionStorage.setItem('token', res.token);
                
                const decoded = decodeJWT(res.token);
                if (decoded && decoded.role) {
                    $roleStore = decoded.role;
                    sessionStorage.setItem('role', decoded.role);
                }
                
                $apiConnected = true;
                proceed();
            }
        } catch(e) {
            isOffline = true;
            $apiConnected = false;
            setTimeout(() => {
                // Auto-proceed as VISITOR
                $roleStore = 'VISITOR';
                sessionStorage.setItem('role', 'VISITOR');
                proceed();
            }, 1500);
        } finally {
            loading = false;
        }
    }
</script>

<div class="min-h-screen bg-[var(--bg-color)] flex items-center justify-center p-4">
    <div class="bg-white brutal-border brutal-shadow-lg p-8 max-w-2xl w-full flex flex-col gap-6 relative overflow-hidden">
        <!-- Background texture -->
        <div class="absolute inset-0 bg-[url('/textures/cardboard.png')] opacity-[0.05] pointer-events-none"></div>

        <div class="relative z-10 text-center">
            <h1 class="font-display text-5xl md:text-6xl uppercase tracking-wider mb-2 drop-shadow-[2px_2px_0_var(--theme-black)]">
                <span class="text-black bg-white px-2 border-2 border-black inline-block -rotate-2 drop-shadow-[2px_2px_0_var(--theme-black)]">Board</span>
                <span class="text-[var(--accent)]">&</span>
                <span class="text-black">Order</span>
            </h1>
            <p class="font-mono text-sm uppercase tracking-widest font-bold text-gray-600">Enter the Tavern</p>
        </div>

        {#if isOffline}
            <div class="bg-red-200 brutal-border-sm p-4 text-center text-red-900 font-mono font-bold flex flex-col items-center gap-2">
                <AlertTriangle size=32 class="text-red-600"/>
                Server offline &mdash; entering Offline Mode...
            </div>
        {/if}

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10 mt-4">
            <!-- VISITOR -->
            <button class="brutal-border-sm p-4 text-center flex flex-col items-center gap-3 transition-all {selectedRole === 'VISITOR' ? 'bg-[var(--accent)] text-white shadow-[4px_4px_0_0_black] -translate-y-1' : 'bg-gray-100 text-black hover:bg-gray-200 shadow-[2px_2px_0_0_black]'}"
                on:click={() => selectedRole = 'VISITOR'}
            >
                <div class="p-3 bg-white text-black brutal-border-sm rounded-full {selectedRole === 'VISITOR' ? 'shadow-[2px_2px_0_0_black]' : ''}">
                    <Dices size=32 />
                </div>
                <div class="font-display text-2xl uppercase tracking-widest">Visitor</div>
                <div class="font-mono text-xs opacity-80">Browse games, read-only</div>
            </button>

            <!-- WRITER -->
            <button class="brutal-border-sm p-4 text-center flex flex-col items-center gap-3 transition-all {selectedRole === 'WRITER' ? 'bg-[var(--accent)] text-white shadow-[4px_4px_0_0_black] -translate-y-1' : 'bg-gray-100 text-black hover:bg-gray-200 shadow-[2px_2px_0_0_black]'}"
                on:click={() => selectedRole = 'WRITER'}
            >
                <div class="p-3 bg-white text-black brutal-border-sm rounded-full {selectedRole === 'WRITER' ? 'shadow-[2px_2px_0_0_black]' : ''}">
                    <Pencil size=32 />
                </div>
                <div class="font-display text-2xl uppercase tracking-widest">Writer</div>
                <div class="font-mono text-xs opacity-80">Manage your library</div>
            </button>

            <!-- ADMIN -->
            <button class="brutal-border-sm p-4 text-center flex flex-col items-center gap-3 transition-all {selectedRole === 'ADMIN' ? 'bg-[var(--accent)] text-white shadow-[4px_4px_0_0_black] -translate-y-1' : 'bg-gray-100 text-black hover:bg-gray-200 shadow-[2px_2px_0_0_black]'}"
                on:click={() => selectedRole = 'ADMIN'}
            >
                <div class="p-3 bg-white text-black brutal-border-sm rounded-full {selectedRole === 'ADMIN' ? 'shadow-[2px_2px_0_0_black]' : ''}">
                    <Crown size=32 />
                </div>
                <div class="font-display text-2xl uppercase tracking-widest">Admin</div>
                <div class="font-mono text-xs opacity-80">Full catalog control</div>
            </button>
        </div>

        <div class="relative z-10 mt-6 flex flex-col items-center gap-3">
            <button class="brutal-btn w-full bg-black text-white text-xl py-4 flex justify-center items-center gap-3 disabled:opacity-50"
                on:click={handleLogin} disabled={loading}
            >
                {loading ? 'Connecting...' : 'Enter the Table'}
                {#if !loading}<Dices size=24 />{/if}
            </button>
            <p class="font-mono text-xs font-bold text-gray-500 uppercase tracking-widest">Tokens expire in 60 seconds (demo mode)</p>
        </div>
    </div>
</div>
