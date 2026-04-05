import { writable } from 'svelte/store';

export const masterGameList = [
    {
        id: '1',
        name: 'Settlers of Catan',
        imageUrl: './images/catan.jpg',
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
        imageUrl: './images/monopoly.jpg',
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
        imageUrl: './images/ticket.jpg',
        minPlayers: 2,
        maxPlayers: 5,
        validPlayerCounts: [2, 3, 4, 5],
        playtimeByPlayerCount: { 2: 45, 4: 60, 5: 75 },
        favorite: true,
        setupDifficulty: 'Easy',
        location: 'Both',
        vibe: 'Chill',
        genre: 'Strategy'
    },
    {
        id: '4',
        name: 'Carcassonne',
        imageUrl: './images/carcassonne.jpg',
        minPlayers: 2,
        maxPlayers: 5,
        validPlayerCounts: [2, 3, 4, 5],
        playtimeByPlayerCount: { 2: 30, 4: 45, 5: 60 },
        favorite: false,
        setupDifficulty: 'Easy',
        location: 'Both',
        vibe: 'Chill',
        genre: 'Strategy'
    },
    {
        id: '5',
        name: 'Pandemic',
        imageUrl: './images/pandemic.jpg',
        minPlayers: 2,
        maxPlayers: 4,
        validPlayerCounts: [2, 3, 4],
        playtimeByPlayerCount: { 2: 45, 4: 60 },
        favorite: true,
        setupDifficulty: 'Medium',
        location: 'Home',
        vibe: 'Intensive',
        genre: 'Cooperative'
    },
    {
        id: '6',
        name: 'Dixit',
        imageUrl: './images/dixit.jpg',
        minPlayers: 3,
        maxPlayers: 6,
        validPlayerCounts: [3, 4, 5, 6],
        playtimeByPlayerCount: { 3: 30, 6: 45 },
        favorite: false,
        setupDifficulty: 'Easy',
        location: 'Both',
        vibe: 'Party',
        genre: 'Family'
    },
    {
        id: '7',
        name: 'Activity',
        imageUrl: './images/activity.jpg',
        minPlayers: 3,
        maxPlayers: 16,
        validPlayerCounts: [3, 4, 5, 6, 8, 10, 12, 14, 16],
        playtimeByPlayerCount: { 4: 60, 8: 90, 16: 120 },
        favorite: false,
        setupDifficulty: 'Easy',
        location: 'Both',
        vibe: 'Party',
        genre: 'Party'
    },
    {
        id: '8',
        name: 'Codenames',
        imageUrl: './images/codenames.jpg',
        minPlayers: 2,
        maxPlayers: 8,
        validPlayerCounts: [2, 4, 6, 8],
        playtimeByPlayerCount: { 4: 15, 6: 20, 8: 30 },
        favorite: true,
        setupDifficulty: 'Easy',
        location: 'Both',
        vibe: 'Party',
        genre: 'Party'
    },
    {
        id: '9',
        name: 'Risk',
        imageUrl: './images/risk.jpg',
        minPlayers: 2,
        maxPlayers: 6,
        validPlayerCounts: [2, 3, 4, 5, 6],
        playtimeByPlayerCount: { 3: 120, 6: 240 },
        favorite: false,
        setupDifficulty: 'Hard',
        location: 'Home',
        vibe: 'Intensive',
        genre: 'Strategy'
    },
    {
        id: '10',
        name: 'Uno',
        imageUrl: './images/uno.png',
        minPlayers: 2,
        maxPlayers: 10,
        validPlayerCounts: [2, 3, 4, 5, 6, 7, 8, 9, 10],
        playtimeByPlayerCount: { 2: 15, 4: 30, 8: 60 },
        favorite: false,
        setupDifficulty: 'Easy',
        location: 'Both',
        vibe: 'Chill',
        genre: 'Family'
    },
    {
        id: '11',
        name: '7 Wonders',
        imageUrl: './images/7wonders.png',
        minPlayers: 2,
        maxPlayers: 7,
        validPlayerCounts: [3, 4, 5, 6, 7],
        playtimeByPlayerCount: { 3: 30, 7: 45 },
        favorite: false,
        setupDifficulty: 'Medium',
        location: 'Home',
        vibe: 'Intensive',
        genre: 'Strategy'
    },
    {
        id: '12',
        name: 'Alias',
        imageUrl: './images/alias.jpg',
        minPlayers: 4,
        maxPlayers: 16,
        validPlayerCounts: [4, 6, 8, 10, 12, 14, 16],
        playtimeByPlayerCount: { 4: 45, 8: 60, 16: 90 },
        favorite: true,
        setupDifficulty: 'Easy',
        location: 'Both',
        vibe: 'Party',
        genre: 'Party'
    }
];

// Initialize from localStorage or empty array
const initialLibrary = JSON.parse(localStorage.getItem('userLibrary') || '[]');

export const userLibrary = writable(initialLibrary);

userLibrary.subscribe((value) => {
    localStorage.setItem('userLibrary', JSON.stringify(value));
});

export const toastMessage = writable('');

// Settings storage
const defaultSettings = {
    favoriteIcon: 'meeple' // 'meeple' or 'd20'
};
const initialSettings = JSON.parse(localStorage.getItem('appSettings') || JSON.stringify(defaultSettings));

export const settings = writable(initialSettings);

settings.subscribe((value) => {
    localStorage.setItem('appSettings', JSON.stringify(value));
});

// "Tonight's Game" rotation tracker
const initialTonightsRotation = JSON.parse(localStorage.getItem('tonightsRotation') || '[]');
export const tonightsRotation = writable(initialTonightsRotation); // The chosen games

tonightsRotation.subscribe((value) => {
    localStorage.setItem('tonightsRotation', JSON.stringify(value));
});

export const selectedGameDetail = writable(null);

export const activeTheme = writable(localStorage.getItem('theme') || 'light');

export const setupAssistantGame = writable(null);
export const boardBuddyGame = writable(null);
export const boardBuddyPlayers = writable([]);
export const hallOfFame = writable(JSON.parse(localStorage.getItem('hallOfFame') || '[]'));
hallOfFame.subscribe(value => localStorage.setItem('hallOfFame', JSON.stringify(value)));
