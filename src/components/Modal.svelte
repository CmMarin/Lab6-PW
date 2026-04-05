<script>
    import { X, Clock, Camera } from 'lucide-svelte';
    import { userLibrary, toastMessage } from '../store.js';

    export let show = false;

    let newGame = {
        id: crypto.randomUUID(),
        name: '',
        imageUrl: '',
        minPlayers: 2,
        maxPlayers: 4,
        validPlayerCounts: [2, 3, 4],
        playtimeByPlayerCount: { 2: 60, 3: 60, 4: 90 },
        favorite: false,
        setupDifficulty: 'Easy',
        location: 'Home',
        vibe: 'Chill',
        genre: ''
    };

    const possiblePlayerCounts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    function togglePlayerCount(count) {
        if (newGame.validPlayerCounts.includes(count)) {
            newGame.validPlayerCounts = newGame.validPlayerCounts.filter(c => c !== count);
            delete newGame.playtimeByPlayerCount[count];
            newGame.playtimeByPlayerCount = { ...newGame.playtimeByPlayerCount };
        } else {
            newGame.validPlayerCounts = [...newGame.validPlayerCounts, count].sort((a, b) => a - b);
            newGame.playtimeByPlayerCount[count] = 60; // Default new time to 60 mins
            newGame.playtimeByPlayerCount = { ...newGame.playtimeByPlayerCount };
        }
    }

    function processCustomGame() {
        if (!newGame.name.trim()) {
            $toastMessage = "❌ Game name is required!";
            return;
        }

        if (newGame.validPlayerCounts.length === 0) {
            $toastMessage = "❌ Please select at least one supported player count.";
            return;
        }

        $userLibrary = [...$userLibrary, { ...newGame }];
        $toastMessage = `${newGame.name} saved to library!`;
        closeModal();
    }

    function closeModal() {
        show = false;
    }

    import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
    import { onMount, onDestroy, tick } from 'svelte';

    let scanning = false;
    let html5QrCode;

    async function startCamera() {
        scanning = true;
        await tick(); // ensure #reader element is mounted before initializing
        
        // Slight delay for camera warm up
        setTimeout(async () => {
            html5QrCode = new Html5Qrcode("reader");
            try {
                await html5QrCode.start(
                    { facingMode: "environment" }, 
                    { 
                        fps: 15, 
                        qrbox: { width: 300, height: 150 },
                        formatsToSupport: [
                            Html5QrcodeSupportedFormats.UPC_A,
                            Html5QrcodeSupportedFormats.UPC_E,
                            Html5QrcodeSupportedFormats.EAN_13,
                            Html5QrcodeSupportedFormats.EAN_8,
                            Html5QrcodeSupportedFormats.CODE_128,
                            Html5QrcodeSupportedFormats.CODE_39,
                            Html5QrcodeSupportedFormats.QR_CODE
                        ]
                    },
                    onScanSuccess,
                    onScanFailure
                );
            } catch (err) {
                console.error(err);
                $toastMessage = "❌ Camera access denied or failed.";
                stopCamera();
            }
        }, 150);
    }

    function stopCamera() {
        if (html5QrCode) {
            html5QrCode.stop().then(() => {
                html5QrCode.clear();
                scanning = false;
            }).catch(err => {
                scanning = false;
            });
        } else {
            scanning = false;
        }
    }

    async function onScanSuccess(decodedText, decodedResult) {
        stopCamera();
        $toastMessage = `Barcode found: ${decodedText}... Fetching data!`;
        
        // Mock Fetch mapping to open barcode API / BoardGameGeek XMLAPI2
        try {
            // let res = await fetch(`https://api.example.com/v1/barcode/${decodedText}`);
            // let data = await res.json();
            
            // Mock data fallback
            setTimeout(() => {
                newGame.name = "Terraforming Mars (Scanned)";
                newGame.minPlayers = 1;
                newGame.maxPlayers = 5;
                newGame.validPlayerCounts = [1, 2, 3, 4, 5];
                newGame.playtimeByPlayerCount = {1: 90, 2: 120, 3: 120, 4: 120, 5: 150};
                newGame.genre = 'Strategy';
                newGame.vibe = 'Intensive';
                newGame.setupDifficulty = 'Hard';
                $toastMessage = "✅ Auto-filled game details from Box Barcode!";
            }, 1000);
        } catch(e) {
            $toastMessage = "❌ API Fetch Failed";
        }
    }

    function onScanFailure(error) {
        // Ignored, continuous scan
    }
    
    onDestroy(() => {
        if (scanning) stopCamera();
    });
</script>

<div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="bg-card w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div class="flex justify-between items-center bg-bg/50 p-6 border-b border-border/20 rounded-t-2xl">
            <h2 class="text-2xl font-bold">Add Custom Game</h2>
            <button class="p-2 hover:bg-card hover:text-red-500 rounded-full transition-colors text-text/60" on:click={closeModal}>
                <X size=24 />
            </button>
        </div>
        
        
            <!-- SCANNER UI MODAL -->
            {#if scanning}
                <div class="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div class="w-full max-w-md bg-[var(--theme-white)] border-[6px] border-[var(--theme-black)] p-4 relative shadow-[8px_8px_0_0_var(--theme-black)]">
                        <button class="absolute -top-4 -right-4 w-12 h-12 bg-red-500 border-[4px] border-[var(--theme-black)] flex items-center justify-center text-white hover:bg-black z-50 cursor-pointer shadow-[4px_4px_0_0_var(--theme-black)]" on:click={stopCamera}>
                            <X size=28 strokeWidth=3 />
                        </button>
                        <h3 class="font-display text-2xl mb-4 text-center uppercase tracking-widest text-[var(--theme-black)]">Scan Box Barcode</h3>
                        <div id="reader" class="w-full bg-[var(--theme-black)] min-h-[300px] border-[4px] border-[var(--theme-black)] shadow-[4px_4px_0_0_var(--theme-black)]"></div>
                    </div>
                </div>
            {/if}

            <div class="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
                <button class="w-full bg-[var(--accent)] text-white hover:bg-[var(--theme-black)] hover:text-white font-display text-2xl tracking-widest uppercase py-4 flex items-center justify-center gap-4 border-[4px] border-[var(--theme-black)] shadow-[4px_4px_0_0_var(--theme-black)] transition-all active:translate-y-1 active:translate-x-1 active:shadow-[0px_0px_0_0_var(--theme-black)] mb-2 group" on:click={startCamera}>
                    <Camera size=32 strokeWidth=3 class="group-hover:scale-110 transition-transform text-[var(--theme-black)] group-hover:text-white" /> SCAN BARCODE
                </button>

            <div class="flex flex-col gap-1">
                <label class="font-bold text-sm text-text/80">Game Name</label>
                <input class="p-3 rounded-lg border border-border/20 bg-bg text-text focus:outline-none focus:border-[var(--accent)] transition-colors" bind:value={newGame.name} placeholder="Epic RPG Adventure" />
            </div>

            <div class="flex gap-4">
                <div class="flex flex-col gap-1 flex-1">
                    <label class="font-bold text-sm text-text/80">Min Players</label>
                    <input type="number" class="p-3 rounded-lg border border-border/20 bg-bg text-text" bind:value={newGame.minPlayers} />
                </div>
                <div class="flex flex-col gap-1 flex-1">
                    <label class="font-bold text-sm text-text/80">Max Players</label>
                    <input type="number" class="p-3 rounded-lg border border-border/20 bg-bg text-text" bind:value={newGame.maxPlayers} />
                </div>
            </div>

            <!-- Dynamic Array Toggle for validPlayerCounts -->
            <div class="flex flex-col gap-2 mt-2">
                <label class="font-bold text-sm text-text/80">Supported Player Counts</label>
                <div class="flex flex-wrap gap-2">
                    {#each possiblePlayerCounts as count}
                        <button 
                            class="w-10 h-10 rounded-lg font-bold border transition-all {newGame.validPlayerCounts.includes(count) ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-md' : 'bg-transparent text-text border-border/20 hover:border-text/30'}"
                            on:click={() => togglePlayerCount(count)}
                        >
                            {count}
                        </button>
                    {/each}
                </div>
            </div>

            <!-- Dynamic Input Mapping for playtimeByPlayerCount -->
            <div class="flex flex-col gap-2 mt-2 bg-text/5 p-4 rounded-xl border border-border/10">
                <label class="font-bold text-sm text-text/80 flex items-center gap-2">
                    <Clock size=16 /> Playtime by Player Count (Mins)
                </label>
                {#if newGame.validPlayerCounts.length === 0}
                    <p class="text-xs opacity-50 italic">Select player counts above to estimate times.</p>
                {:else}
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                        {#each newGame.validPlayerCounts as pCount}
                            <div class="flex items-center gap-2 bg-card p-2 rounded-lg border border-border/10 shadow-sm">
                                <span class="font-bold w-12 text-center text-sm">{pCount} 🧍</span>
                                <input type="number" min="5" step="5" class="w-full bg-bg border-none focus:outline-none focus:ring-1 focus:ring-[var(--accent)] rounded p-1 font-mono text-center" bind:value={newGame.playtimeByPlayerCount[pCount]} />
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>

            <div class="flex gap-4 mt-2">
                <div class="flex flex-col gap-1 flex-1">
                    <label class="font-bold text-sm text-text/80">Location</label>
                    <select class="p-3 rounded-lg border border-border/20 bg-bg text-text" bind:value={newGame.location}>
                        <option value="Home">Home</option>
                        <option value="Outside">Outside</option>
                        <option value="Both">Both</option>
                    </select>
                </div>
                <div class="flex flex-col gap-1 flex-1">
                    <label class="font-bold text-sm text-text/80">Vibe</label>
                    <select class="p-3 rounded-lg border border-border/20 bg-bg text-text" bind:value={newGame.vibe}>
                        <option value="Chill">Chill</option>
                        <option value="Intensive">Intensive</option>
                        <option value="Party">Party</option>
                    </select>
                </div>
            </div>

            <div class="flex flex-col gap-1">
                <label class="font-bold text-sm text-text/80 cursor-pointer flex items-center gap-2">
                    <input type="checkbox" bind:checked={newGame.favorite} class="w-5 h-5 accent-[var(--accent)]" /> 
                    Mark as Favorite
                </label>
            </div>
        </div>

        <div class="p-6 border-t border-border/20 bg-bg/50 rounded-b-2xl flex justify-end gap-4">
            <button class="btn hover:bg-card text-text border border-border/20" on:click={closeModal}>Cancel</button>
            <button class="btn btn-accent px-8" on:click={processCustomGame}>Save Game</button>
        </div>
    </div>
</div>
