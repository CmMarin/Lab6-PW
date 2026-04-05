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

<div class="p-4 md:p-8 w-full max-w-4xl mx-auto flex flex-col min-h-full gap-8 sm:pb-24">

    <div class="flex items-center gap-4 border-b-[4px] border-black pb-4 mb-4 relative">
        <div class="bg-[var(--accent)] p-2 border-[3px] border-black shadow-[4px_4px_0_0_var(--theme-black)] rotate-3">
            <SettingsIcon size=40 class="text-white" strokeWidth=3 />
        </div>
        <div>
            <h1 class="text-5xl font-heading uppercase text-black drop-shadow-[2px_2px_0_var(--accent)] tracking-wide">Settings</h1>
            <p class="text-xl font-bold font-mono text-black bg-yellow-300 p-1 border-2 border-black inline-block shadow-[2px_2px_0_var(--theme-black)]">Manage your application preferences and cardboard.</p>
        </div>
    </div>

    <!-- UI Preferences -->
    <section class="brutal-card p-6 bg-white">
        <h2 class="text-3xl font-heading mb-6 uppercase text-black drop-shadow-[2px_2px_0_var(--accent)]">
            Preferences
        </h2>

        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                 <h3 class="font-bold font-mono text-xl uppercase bg-black text-white inline-block px-2 py-1 mb-2 shadow-[2px_2px_0_0_var(--accent)]">Favorite Indicator Icon</h3>
                 <p class="text-black font-bold">Choose which icon appears for games marked as favorites.</p>
            </div>

            <div class="flex items-center gap-2 bg-gray-200 p-2 border-[3px] border-black shadow-[4px_4px_0_0_var(--theme-black)]">
                <button
                    class="px-4 py-2 border-[3px] border-black flex items-center gap-2 transition-transform hover:-translate-y-1 {$settings.favoriteIcon === 'meeple' ? 'bg-[var(--accent)] text-white shadow-[2px_2px_0_0_var(--theme-black)]' : 'bg-white text-black'}"
                    on:click={() => handleIconChange('meeple')}
                >
                    <Meeple size=24 filled={$settings.favoriteIcon === 'meeple'} /> Meeple
                </button>
                <button
                     class="px-4 py-2 border-[3px] border-black flex items-center gap-2 transition-transform hover:-translate-y-1 {$settings.favoriteIcon === 'd20' ? 'bg-[var(--accent)] text-white shadow-[2px_2px_0_0_var(--theme-black)]' : 'bg-white text-black'}"
                     on:click={() => handleIconChange('d20')}
                >
                    <D20 size=24 className={$settings.favoriteIcon === 'd20' ? 'text-white' : 'text-black'} /> D20
                </button>
            </div>
        </div>
    </section>

    <!-- Data Management -->
    <section class="brutal-card p-6 bg-green-50">
        <h2 class="text-3xl font-heading mb-6 uppercase text-black drop-shadow-[2px_2px_0_var(--accent)]">Data Management</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Export -->
            <div class="bg-white border-[4px] border-black p-6 flex flex-col items-center text-center gap-4 hover:-translate-y-2 transition-transform shadow-[4px_4px_0_0_var(--theme-black)] cursor-pointer group" on:click={exportLibrary} role="button" tabindex="0">
                <div class="bg-[var(--accent)] p-4 border-[3px] border-black shadow-[4px_4px_0_0_var(--theme-black)] text-white">
                    <Download size=32 strokeWidth=3 />
                </div>
                <div>
                     <h3 class="font-heading text-2xl uppercase">Export Library</h3>
                     <p class="font-bold text-sm mt-2">Save your current collection to a JSON file as a backup.</p>
                </div>
            </div>

            <!-- Import -->
            <input type="file" accept=".json" bind:this={fileInput} on:change={importLibrary} class="hidden" />
            <div class="bg-white border-[4px] border-black p-6 flex flex-col items-center text-center gap-4 hover:-translate-y-2 transition-transform shadow-[4px_4px_0_0_var(--theme-black)] cursor-pointer group" on:click={() => fileInput.click()} role="button" tabindex="0">
                <div class="bg-blue-500 p-4 border-[3px] border-black shadow-[4px_4px_0_0_var(--theme-black)] text-white">
                    <Upload size=32 strokeWidth=3 />
                </div>
                <div>
                     <h3 class="font-heading text-2xl uppercase">Import Library</h3>
                     <p class="font-bold text-sm mt-2">Restore your collection from a previously exported JSON file.</p>
                </div>
            </div>
        </div>

        <div class="mt-8 pt-6 border-t-[4px] border-black flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
                 <h3 class="font-heading text-3xl text-red-600 uppercase drop-shadow-[2px_2px_0_var(--theme-black)]">Danger Zone</h3>
                 <p class="font-bold text-black bg-red-200 p-1 border-2 border-black inline-block mt-2">Permanently erase your collection from this browser.</p>
            </div>

            <button class="brutal-btn flex items-center gap-2 bg-red-500 text-white border-[4px] border-black shadow-[4px_4px_0_0_var(--theme-black)] hover:bg-black hover:text-red-500" on:click={clearLibrary}>
                <Trash2 size=24 strokeWidth=3 /> Clear Local Data
            </button>
        </div>

    </section>
</div>
