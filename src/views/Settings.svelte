<script>
    import { settings, userLibrary, toastMessage } from '../store.js';
    import { Settings as SettingsIcon, Download, Upload, Trash2 } from 'lucide-svelte';
    import Meeple from '../components/icons/Meeple.svelte';
    import D20 from '../components/icons/D20.svelte';

    let fileInput;

    function handleIconChange(icon) {
        $settings.favoriteIcon = icon;
    }

    function exportLibrary() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify($userLibrary));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", "board_game_library.json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        $toastMessage = "Library exported successfully!";
    }

    function importLibrary(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedLibrary = JSON.parse(e.target.result);
                    if (Array.isArray(importedLibrary)) {
                         $userLibrary = importedLibrary;
                         $toastMessage = "Library imported successfully!";
                    } else {
                         $toastMessage = "Invalid file format.";
                    }
                } catch (err) {
                     $toastMessage = "Error reading file.";
                }
            };
            reader.readAsText(file);
        }
    }

    function clearLibrary() {
        if (confirm("Are you SURE you want to clear your local library? This cannot be undone unless you have a backup export!")) {
            $userLibrary = [];
            $toastMessage = "Library cleared.";
        }
    }

</script>

<div class="p-4 md:p-8 max-w-4xl mx-auto flex flex-col h-full gap-8 overflow-y-auto">
    
    <div class="flex items-center gap-3 border-b border-border/20 pb-4 mb-4">
        <SettingsIcon size=32 class="text-[var(--accent)]" />
        <div>
            <h1 class="text-3xl font-bold">Settings</h1>
            <p class="text-sm text-text/60">Manage your application preferences and data.</p>
        </div>
    </div>

    <!-- UI Preferences -->
    <section class="card p-6 bg-card/40 border border-border/20">
        <h2 class="text-2xl font-bold mb-6 opacity-80 flex items-center gap-2">
            Preferences
        </h2>

        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                 <h3 class="font-bold text-lg">Favorite Indicator Icon</h3>
                 <p class="text-sm text-text/60">Choose which icon appears for games marked as favorites.</p>
            </div>
            
            <div class="flex items-center gap-2 bg-background p-1 rounded-xl border border-border/20">
                <button 
                    class="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors {$settings.favoriteIcon === 'meeple' ? 'bg-card text-[var(--accent)] font-bold shadow-sm' : 'hover:bg-card/50 opacity-60'}"
                    on:click={() => handleIconChange('meeple')}
                >
                    <Meeple size=20 filled={$settings.favoriteIcon === 'meeple'} /> Meeple
                </button>
                <button 
                     class="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors {$settings.favoriteIcon === 'd20' ? 'bg-card text-[var(--accent)] font-bold shadow-sm' : 'hover:bg-card/50 opacity-60'}"
                     on:click={() => handleIconChange('d20')}
                >
                    <D20 size=20 className={$settings.favoriteIcon === 'd20' ? 'text-[var(--accent)]' : ''} /> D20
                </button>
            </div>
        </div>
    </section>

    <!-- Data Management -->
    <section class="card p-6 bg-card/40 border border-border/20">
        <h2 class="text-2xl font-bold mb-6 opacity-80">Data Management</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Export -->
            <div class="bg-background border border-border/20 p-4 rounded-xl flex flex-col items-start gap-4 hover:border-[var(--accent)]/50 transition-colors cursor-pointer group" on:click={exportLibrary} role="button" tabindex="0">
                <div class="bg-[var(--accent)]/10 p-3 rounded-full text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-white transition-colors">
                    <Download size=24 />
                </div>
                <div>
                     <h3 class="font-bold text-lg">Export Library</h3>
                     <p class="text-sm text-text/60">Save your current collection to a JSON file as a backup.</p>
                </div>
            </div>

            <!-- Import -->
            <input type="file" accept=".json" bind:this={fileInput} on:change={importLibrary} class="hidden" />
            <div class="bg-background border border-border/20 p-4 rounded-xl flex flex-col items-start gap-4 hover:border-[var(--accent)]/50 transition-colors cursor-pointer group" on:click={() => fileInput.click()} role="button" tabindex="0">
                <div class="bg-[var(--accent)]/10 p-3 rounded-full text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-white transition-colors">
                    <Upload size=24 />
                </div>
                <div>
                     <h3 class="font-bold text-lg">Import Library</h3>
                     <p class="text-sm text-text/60">Restore your collection from a previously exported JSON file.</p>
                </div>
            </div>
        </div>

        <div class="mt-8 pt-6 border-t border-border/10 flex items-center justify-between">
            <div>
                 <h3 class="font-bold text-red-500">Danger Zone</h3>
                 <p class="text-sm text-text/60">Permanently erase your collection from this browser.</p>
            </div>
            
            <button class="flex items-center gap-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white font-bold px-4 py-2 rounded-lg transition-colors border border-red-500/20" on:click={clearLibrary}>
                <Trash2 size=18 /> Clear Local Data
            </button>
        </div>

    </section>
</div>