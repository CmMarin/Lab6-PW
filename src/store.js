import { writable } from 'svelte/store';

export const masterGameList = [
    {
        id: '1',
        name: 'Settlers of Catan',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a3/Catan-2015-boxart.jpg',
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
        imageUrl: 'https://c8.alamy.com/comp/BF9PYM/monopoly-board-game-BF9PYM.jpg',
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
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/9/92/Ticket_to_Ride_Board_Game_Box_EN.jpg',
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
        imageUrl: 'https://www.gamesworldsa.com.au/cdn/shop/products/pic2337577_1_1200x1697.jpg?v=1598336772',
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
        imageUrl: 'https://images.unsplash.com/photo-1608889476561-6242cb816fb2?auto=format&fit=crop&w=800&q=80',
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
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/7/7b/Dixitgame.jpg',
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
        imageUrl: 'https://images.unsplash.com/photo-1632501641765-e568d28b0015?auto=format&fit=crop&w=600&q=80',
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
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Codenames_board_game.jpg/1280px-Codenames_board_game.jpg',
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
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Amsterdam_-_Risk_players_-_1136_%28cropped%29.jpg/1280px-Amsterdam_-_Risk_players_-_1136_%28cropped%29.jpg',
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
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/UNO_Logo.svg/1280px-UNO_Logo.svg.png',
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
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0b/7_Wonders_-_New_Edition_boxart.png',
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
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Alias_zaidimo_lenta.JPG/1280px-Alias_zaidimo_lenta.JPG',
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
