import { writable } from 'svelte/store';

export const masterGameList = [
    {
        id: '1',
        name: 'Settlers of Catan',
        modelUrl: '/models/catan.glb',
        minPlayers: 3,
        maxPlayers: 4,
        validPlayerCounts: [3, 4],
        playtimeByPlayerCount: { 3: 60, 4: 90 },
        favorite: false,
        setupDifficulty: 'Medium',
        location: 'Home',
        vibe: 'Chill',
        genre: 'Strategy'
    },
    {
        id: '2',
        name: 'Monopoly',
        modelUrl: '/models/monopoly.glb',
        minPlayers: 2,
        maxPlayers: 8,
        validPlayerCounts: [2, 3, 4, 5, 6, 7, 8],
        playtimeByPlayerCount: { 2: 60, 4: 120, 8: 180 },
        favorite: false,
        setupDifficulty: 'Easy',
        location: 'Home',
        vibe: 'Intensive',
        genre: 'Family'
    },
    {
        id: '3',
        name: 'Ticket to Ride',
        modelUrl: '/models/ticket.glb',
        minPlayers: 2,
        maxPlayers: 5,
        validPlayerCounts: [2, 3, 4, 5],
        playtimeByPlayerCount: { 2: 45, 4: 60, 5: 75 },
        favorite: true,
        setupDifficulty: 'Easy',
        location: 'Both',
        vibe: 'Chill',
        genre: 'Strategy'
    }
];

// Initialize from localStorage or empty array
const initialLibrary = JSON.parse(localStorage.getItem('userLibrary') || '[]');

export const userLibrary = writable(initialLibrary);

userLibrary.subscribe((value) => {
    localStorage.setItem('userLibrary', JSON.stringify(value));
});
