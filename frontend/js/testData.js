// ============================================
// CULTIFY — TEST DATA (Backend Simulation)
// ============================================
// This file simulates a backend. All data is persisted in localStorage.
// When backend is ready, replace these functions with API calls.

const STORAGE_KEYS = {
    USERS: 'cultify_test_users',
    COMMENTS: 'cultify_test_comments',
    RATINGS: 'cultify_test_ratings',
    LISTS: 'cultify_test_lists',
    CONTENT: 'cultify_test_content',
    CURRENT_USER: 'cultify_current_user_id'
};

// ============================================
// SEED DATA
// ============================================

const seedContent = {
    "item_1": {
        "title": "The Dark Knight",
        "img": "../images/Movies/The Dark Knight.png",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of The Dark Knight."
    },
    "item_2": {
        "title": "Cars",
        "img": "../images/Movies/Cars.jpg",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Cars."
    },
    "item_3": {
        "title": "Toy Story",
        "img": "../images/Movies/Toy Story.jpg",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Toy Story."
    },
    "item_4": {
        "title": "Thor: Dark World",
        "img": "../images/Movies/Thor Dark World.jpg",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Thor: Dark World."
    },
    "item_5": {
        "title": "Avatar",
        "img": "../images/Movies/Avatar.jpg",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Avatar."
    },
    "item_6": {
        "title": "Inception",
        "img": "../images/Movies/Inception.jpg",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Inception."
    },
    "item_7": {
        "title": "The Martian",
        "img": "../images/Movies/The Martian.jpg",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of The Martian."
    },
    "item_8": {
        "title": "The Karete Kid",
        "img": "../images/Movies/The Karete Kid.jpg",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of The Karete Kid."
    },
    "item_9": {
        "title": "John Wick 2",
        "img": "../images/Movies/John Wick 2.jpg",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of John Wick 2."
    },
    "item_10": {
        "title": "The Amazing Spider-Man",
        "img": "../images/Movies/The Amazing Spider-Man.jpg",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of The Amazing Spider-Man."
    },
    "item_11": {
        "title": "John Wick: Chapter 3 - Parabellum",
        "img": "../images/Movies/John Wick Chapter 3 - Parabellum.jpg",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of John Wick: Chapter 3 - Parabellum."
    },
    "item_12": {
        "title": "Sherlock Holmes",
        "img": "../images/Movies/Sherlock Holmes.jpg",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Sherlock Holmes."
    },
    "item_13": {
        "title": "The Smurfs",
        "img": "../images/Movies/The Smurfs.jpg",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of The Smurfs."
    },
    "item_14": {
        "title": "The Lion King",
        "img": "../images/Movies/The Lion King.jpg",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of The Lion King."
    },
    "item_15": {
        "title": "How To Train Your Dragon",
        "img": "../images/Movies/How To Train Your Dragon.jpg",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of How To Train Your Dragon."
    },
    "item_16": {
        "title": "Gravity",
        "img": "../images/Movies/Gravity.jpg",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Gravity."
    },
    "item_17": {
        "title": "How To Train Your Dragon 2",
        "img": "../images/Movies/How To Train Your Dragon 2.jpg",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of How To Train Your Dragon 2."
    },
    "item_18": {
        "title": "Shrek",
        "img": "../images/Movies/Shrek.jpg",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Shrek."
    },
    "item_19": {
        "title": "Lucy",
        "img": "../images/Movies/Lucy.jpg",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Lucy."
    },
    "item_20": {
        "title": "Sherlock Holmes: A Game of Shadows",
        "img": "../images/Movies/Sherlock Holmes_ A Game of Shadows.jpg",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Sherlock Holmes: A Game of Shadows."
    },
    "item_21": {
        "title": "Captain America: Civil War",
        "img": "../images/Movies/Captain America_ Civil War.jpg",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Captain America: Civil War."
    },
    "item_22": {
        "title": "Toy Story 2",
        "img": "../images/Movies/Toy Story 2.jpg",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Toy Story 2."
    },
    "item_23": {
        "title": "The Godfather",
        "img": "../images/Movies/The Godfather.jpg",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of The Godfather."
    },
    "item_24": {
        "title": "The Godfather 2",
        "img": "../images/Movies/The Godfather 2.jpg",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of The Godfather 2."
    },
    "item_25": {
        "title": "Deadpool",
        "img": "../images/Movies/Deadpool.jpg",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Deadpool."
    },
    "item_26": {
        "title": "The Maze Runner",
        "img": "../images/Movies/The Maze Runner.jpg",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of The Maze Runner."
    },
    "item_27": {
        "title": "The Intouchables",
        "img": "../images/Movies/The Intouchables.jpg",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of The Intouchables."
    },
    "item_28": {
        "title": "The Last Kingdom: Seven Kings Must Die",
        "img": "../images/Movies/The Last Kingdom Seven Kings Must Die.jpg",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of The Last Kingdom: Seven Kings Must Die."
    },
    "item_29": {
        "title": "John Wick",
        "img": "../images/Movies/John Wick.jpg",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of John Wick."
    },
    "item_30": {
        "title": "Deadpool 2",
        "img": "../images/Movies/Deadpool 2.jpg",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Deadpool 2."
    },
    "item_31": {
        "title": "Ford v Ferrari",
        "img": "../images/Movies/Ford v Ferrari.jpg",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Ford v Ferrari."
    },
    "item_32": {
        "title": "Man of Steal",
        "img": "../images/Movies/Man of Steal.jpg",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Man of Steal."
    },
    "item_33": {
        "title": "Nobody",
        "img": "../images/Movies/Nobody.jpg",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Nobody."
    },
    "item_34": {
        "title": "Red Notice",
        "img": "../images/Movies/Red Notice.jpg",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Red Notice."
    },
    "item_35": {
        "title": "Bullet Train",
        "img": "../images/Movies/Bullet Train.jpg",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Bullet Train."
    },
    "item_36": {
        "title": "The King's Man",
        "img": "../images/Movies/The King's Man.jpg",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of The King's Man."
    },
    "item_37": {
        "title": "The Dark Knigt Rises",
        "img": "../images/Movies/The Dark Knigt Rises.jpg",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of The Dark Knigt Rises."
    },
    "item_38": {
        "title": "John Wick: Chapter 4",
        "img": "../images/Movies/John Wick_ Chapter 4.jpg",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of John Wick: Chapter 4."
    },
    "item_39": {
        "title": "Spider-Man: Far From Home",
        "img": "../images/Movies/Spider-Man_ Far From Home.png",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Spider-Man: Far From Home."
    },
    "item_40": {
        "title": "tick, tick...BOOM!",
        "img": "../images/Movies/tick, tick...BOOM!.png",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of tick, tick...BOOM!."
    },
    "item_41": {
        "title": "Sisu",
        "img": "../images/Movies/Sisu.png",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Sisu."
    },
    "item_42": {
        "title": "Shooter",
        "img": "../images/Movies/Shooter.png",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Shooter."
    },
    "item_43": {
        "title": "Oppenheimer",
        "img": "../images/Movies/Oppenheimer.png",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Oppenheimer."
    },
    "item_44": {
        "title": "The Godfather III",
        "img": "../images/Movies/The Godfather III.png",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of The Godfather III."
    },
    "item_45": {
        "title": "Scent of a Woman",
        "img": "../images/Movies/Scent of a Woman.png",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Scent of a Woman."
    },
    "item_46": {
        "title": "Tenet",
        "img": "../images/Movies/Tenet.png",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Tenet."
    },
    "item_47": {
        "title": "Kelebeğin Rüyası",
        "img": "../images/Movies/Kelebeğin Rüyası.png",
        "tags": [
            "Movie",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Kelebeğin Rüyası."
    },
    "item_48": {
        "title": "Lucifer",
        "img": "../images/Series/Lucifer.jpeg",
        "tags": [
            "Series",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Lucifer."
    },
    "item_49": {
        "title": "Breaking Bad",
        "img": "../images/Series/Breaking Bad.jpeg",
        "tags": [
            "Series",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Breaking Bad."
    },
    "item_50": {
        "title": "Dark",
        "img": "../images/Series/Dark.jpeg",
        "tags": [
            "Series",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Dark."
    },
    "item_51": {
        "title": "Lost",
        "img": "../images/Series/Lost.jpeg",
        "tags": [
            "Series",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Lost."
    },
    "item_52": {
        "title": "Vikings",
        "img": "../images/Series/Vikings.jpeg",
        "tags": [
            "Series",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Vikings."
    },
    "item_53": {
        "title": "Sherlock",
        "img": "../images/Series/Sherlock.jpeg",
        "tags": [
            "Series",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Sherlock."
    },
    "item_54": {
        "title": "The Last Kingdom",
        "img": "../images/Series/The Last Kingdom.jpeg",
        "tags": [
            "Series",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of The Last Kingdom."
    },
    "item_55": {
        "title": "The Walking Dead",
        "img": "../images/Series/The Walking Dead.jpeg",
        "tags": [
            "Series",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of The Walking Dead."
    },
    "item_56": {
        "title": "House",
        "img": "../images/Series/House.jpeg",
        "tags": [
            "Series",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of House."
    },
    "item_57": {
        "title": "Mr. Robot",
        "img": "../images/Series/Mr. Robot.jpeg",
        "tags": [
            "Series",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Mr. Robot."
    },
    "item_58": {
        "title": "The Mentalist",
        "img": "../images/Series/The Mentalist.jpeg",
        "tags": [
            "Series",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of The Mentalist."
    },
    "item_59": {
        "title": "Peaky Blinders",
        "img": "../images/Series/Peaky Blinders.jpeg",
        "tags": [
            "Series",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Peaky Blinders."
    },
    "item_60": {
        "title": "Marvel's Daredevil",
        "img": "../images/Series/Marvel's Daredevil.jpeg",
        "tags": [
            "Series",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Marvel's Daredevil."
    },
    "item_61": {
        "title": "The Last of Us",
        "img": "../images/Series/The Last of Us.jpeg",
        "tags": [
            "Series",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of The Last of Us."
    },
    "item_62": {
        "title": "Chernobyl",
        "img": "../images/Series/Chernobyl.jpeg",
        "tags": [
            "Series",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Chernobyl."
    },
    "item_63": {
        "title": "Dexter",
        "img": "../images/Series/Dexter.jpeg",
        "tags": [
            "Series",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Dexter."
    },
    "item_64": {
        "title": "The Gentlemen",
        "img": "../images/Series/The Gentlemen.jpeg",
        "tags": [
            "Series",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of The Gentlemen."
    },
    "item_65": {
        "title": "Wednesday",
        "img": "../images/Series/Wednesday.jpeg",
        "tags": [
            "Series",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Wednesday."
    },
    "item_66": {
        "title": "Money Heist",
        "img": "../images/Series/Money Heist.jpeg",
        "tags": [
            "Series",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Money Heist."
    },
    "item_67": {
        "title": "3 Body Problem",
        "img": "../images/Series/3 Body Problem.jpeg",
        "tags": [
            "Series",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of 3 Body Problem."
    },
    "item_68": {
        "title": "The Witcher",
        "img": "../images/Series/The Witcher.jpeg",
        "tags": [
            "Series",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of The Witcher."
    },
    "item_69": {
        "title": "Pluribus",
        "img": "../images/Series/Pluribus.jpeg",
        "tags": [
            "Series",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Pluribus."
    },
    "item_70": {
        "title": "Ragnarok",
        "img": "../images/Series/Ragnarok.jpeg",
        "tags": [
            "Series",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Ragnarok."
    },
    "item_71": {
        "title": "After Life",
        "img": "../images/Series/After Life.jpeg",
        "tags": [
            "Series",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of After Life."
    },
    "item_72": {
        "title": "Game of Thrones",
        "img": "../images/Series/Game of Thrones.jpeg",
        "tags": [
            "Series",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Game of Thrones."
    },
    "item_73": {
        "title": "1984",
        "img": "../images/Books/1984.jpeg",
        "tags": [
            "Book",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of 1984."
    },
    "item_74": {
        "title": "Altıncı Koğuş",
        "img": "../images/Books/Altıncı Koğuş.jpeg",
        "tags": [
            "Book",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Altıncı Koğuş."
    },
    "item_75": {
        "title": "Ana",
        "img": "../images/Books/Ana.jpeg",
        "tags": [
            "Book",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Ana."
    },
    "item_76": {
        "title": "Anna Karenina",
        "img": "../images/Books/Anna Karenina.jpeg",
        "tags": [
            "Book",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Anna Karenina."
    },
    "item_77": {
        "title": "Beyaz Zambaklar  Ülkesinde",
        "img": "../images/Books/Beyaz Zambaklar  Ülkesinde.jpeg",
        "tags": [
            "Book",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Beyaz Zambaklar  Ülkesinde."
    },
    "item_78": {
        "title": "Bir Kadının Yaşamından 24 Saat",
        "img": "../images/Books/Bir Kadının Yaşamından 24 Saat.jpeg",
        "tags": [
            "Book",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Bir Kadının Yaşamından 24 Saat."
    },
    "item_79": {
        "title": "Cesur Yeni Dünya",
        "img": "../images/Books/Cesur Yeni Dünya.jpeg",
        "tags": [
            "Book",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Cesur Yeni Dünya."
    },
    "item_80": {
        "title": "Don Kişot",
        "img": "../images/Books/Don Kişot.jpeg",
        "tags": [
            "Book",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Don Kişot."
    },
    "item_81": {
        "title": "Dönüşüm",
        "img": "../images/Books/Dönüşüm.jpeg",
        "tags": [
            "Book",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Dönüşüm."
    },
    "item_82": {
        "title": "Hayvan Çiftliği",
        "img": "../images/Books/Hayvan Çiftliği.jpeg",
        "tags": [
            "Book",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Hayvan Çiftliği."
    },
    "item_83": {
        "title": "Kara Keşiş",
        "img": "../images/Books/Kara Keşiş.jpeg",
        "tags": [
            "Book",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Kara Keşiş."
    },
    "item_84": {
        "title": "Kızıl Veba",
        "img": "../images/Books/Kızıl Veba.jpeg",
        "tags": [
            "Book",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Kızıl Veba."
    },
    "item_85": {
        "title": "Otomatik Portakal",
        "img": "../images/Books/Otomatik Portakal.jpeg",
        "tags": [
            "Book",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Otomatik Portakal."
    },
    "item_86": {
        "title": "Ringworld",
        "img": "../images/Books/Ringworld.jpeg",
        "tags": [
            "Book",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Ringworld."
    },
    "item_87": {
        "title": "Robinson Crusoe",
        "img": "../images/Books/Robinson Crusoe.jpeg",
        "tags": [
            "Book",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Robinson Crusoe."
    },
    "item_88": {
        "title": "Satranç",
        "img": "../images/Books/Satranç.jpeg",
        "tags": [
            "Book",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Satranç."
    },
    "item_89": {
        "title": "Savaş ve barış",
        "img": "../images/Books/Savaş ve barış.jpeg",
        "tags": [
            "Book",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Savaş ve barış."
    },
    "item_90": {
        "title": "Simyacı",
        "img": "../images/Books/Simyacı.jpeg",
        "tags": [
            "Book",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Simyacı."
    },
    "item_91": {
        "title": "Suç ve Ceza",
        "img": "../images/Books/Suç ve Ceza.jpeg",
        "tags": [
            "Book",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Suç ve Ceza."
    },
    "item_92": {
        "title": "Yüzbaşının Kızı",
        "img": "../images/Books/Yüzbaşının Kızı.jpeg",
        "tags": [
            "Book",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Yüzbaşının Kızı."
    },
    "item_93": {
        "title": "halka dünya mühendisleri",
        "img": "../images/Books/halka dünya mühendisleri.jpeg",
        "tags": [
            "Book",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of halka dünya mühendisleri."
    },
    "item_94": {
        "title": "halka dünya tahtı",
        "img": "../images/Books/halka dünya tahtı.jpeg",
        "tags": [
            "Book",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of halka dünya tahtı."
    },
    "item_95": {
        "title": "halka dünya çocukları",
        "img": "../images/Books/halka dünya çocukları.jpeg",
        "tags": [
            "Book",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of halka dünya çocukları."
    },
    "item_96": {
        "title": "İnsan Ne İle Yaşar",
        "img": "../images/Books/İnsan Ne İle Yaşar.jpeg",
        "tags": [
            "Book",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of İnsan Ne İle Yaşar."
    },
    "item_97": {
        "title": "İnsancıklar",
        "img": "../images/Books/İnsancıklar.jpeg",
        "tags": [
            "Book",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of İnsancıklar."
    },
    "item_98": {
        "title": "Apex Legends",
        "img": "../images/Games/Apex Legends.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Apex Legends."
    },
    "item_99": {
        "title": "Assassins Creed IV Black Flag",
        "img": "../images/Games/Assassins Creed IV Black Flag.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Assassins Creed IV Black Flag."
    },
    "item_100": {
        "title": "Assassins Creed Odyssey",
        "img": "../images/Games/Assassins Creed Odyssey.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Assassins Creed Odyssey."
    },
    "item_101": {
        "title": "Assassins Creed Origins",
        "img": "../images/Games/Assassins Creed Origins.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Assassins Creed Origins."
    },
    "item_102": {
        "title": "Assassins Creed Shadows",
        "img": "../images/Games/Assassins Creed Shadows.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Assassins Creed Shadows."
    },
    "item_103": {
        "title": "Baldurs Gate 3",
        "img": "../images/Games/Baldurs Gate 3.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Baldurs Gate 3."
    },
    "item_104": {
        "title": "Batman Arkham City",
        "img": "../images/Games/Batman Arkham City.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Batman Arkham City."
    },
    "item_105": {
        "title": "Bioshock",
        "img": "../images/Games/Bioshock.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Bioshock."
    },
    "item_106": {
        "title": "Bloodborne",
        "img": "../images/Games/Bloodborne.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Bloodborne."
    },
    "item_107": {
        "title": "Call of Duty 2 Box",
        "img": "../images/Games/Call of Duty 2 Box.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Call of Duty 2 Box."
    },
    "item_108": {
        "title": "Call of Duty Modern Warfare II",
        "img": "../images/Games/Call of Duty Modern Warfare II.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Call of Duty Modern Warfare II."
    },
    "item_109": {
        "title": "Counter Strike 2",
        "img": "../images/Games/Counter Strike 2.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Counter Strike 2."
    },
    "item_110": {
        "title": "Cyberpunk 2077",
        "img": "../images/Games/Cyberpunk 2077.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Cyberpunk 2077."
    },
    "item_111": {
        "title": "Dead Cells",
        "img": "../images/Games/Dead Cells.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Dead Cells."
    },
    "item_112": {
        "title": "Detroit Become Human",
        "img": "../images/Games/Detroit Become Human.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Detroit Become Human."
    },
    "item_113": {
        "title": "Disco Elysium",
        "img": "../images/Games/Disco Elysium.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Disco Elysium."
    },
    "item_114": {
        "title": "Doom",
        "img": "../images/Games/Doom.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Doom."
    },
    "item_115": {
        "title": "Dota 2",
        "img": "../images/Games/Dota 2.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Dota 2."
    },
    "item_116": {
        "title": "Elden Ring",
        "img": "../images/Games/Elden Ring.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Elden Ring."
    },
    "item_117": {
        "title": "Enter the Gungeon",
        "img": "../images/Games/Enter the Gungeon.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Enter the Gungeon."
    },
    "item_118": {
        "title": "Euro Truck Simulator 2",
        "img": "../images/Games/Euro Truck Simulator 2.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Euro Truck Simulator 2."
    },
    "item_119": {
        "title": "Farming Simulator 22",
        "img": "../images/Games/Farming Simulator 22.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Farming Simulator 22."
    },
    "item_120": {
        "title": "Fortnite",
        "img": "../images/Games/Fortnite.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Fortnite."
    },
    "item_121": {
        "title": "God of War",
        "img": "../images/Games/God of War.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of God of War."
    },
    "item_122": {
        "title": "God of War Ragnark",
        "img": "../images/Games/God of War Ragnark.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of God of War Ragnark."
    },
    "item_123": {
        "title": "Grand Theft Auto III",
        "img": "../images/Games/Grand Theft Auto III.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Grand Theft Auto III."
    },
    "item_124": {
        "title": "Grand Theft Auto IV",
        "img": "../images/Games/Grand Theft Auto IV.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Grand Theft Auto IV."
    },
    "item_125": {
        "title": "Grand Theft Auto San Andreas",
        "img": "../images/Games/Grand Theft Auto San Andreas.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Grand Theft Auto San Andreas."
    },
    "item_126": {
        "title": "Grand Theft Auto V",
        "img": "../images/Games/Grand Theft Auto V.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Grand Theft Auto V."
    },
    "item_127": {
        "title": "Hades",
        "img": "../images/Games/Hades.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Hades."
    },
    "item_128": {
        "title": "Half Life 2",
        "img": "../images/Games/Half Life 2.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Half Life 2."
    },
    "item_129": {
        "title": "League of Legends",
        "img": "../images/Games/League of Legends.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of League of Legends."
    },
    "item_130": {
        "title": "Mafia II",
        "img": "../images/Games/Mafia II.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Mafia II."
    },
    "item_131": {
        "title": "Mass Effect 2",
        "img": "../images/Games/Mass Effect 2.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Mass Effect 2."
    },
    "item_132": {
        "title": "Max Payne 3",
        "img": "../images/Games/Max Payne 3.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Max Payne 3."
    },
    "item_133": {
        "title": "Minecraft",
        "img": "../images/Games/Minecraft.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Minecraft."
    },
    "item_134": {
        "title": "Overwatch 2",
        "img": "../images/Games/Overwatch 2.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Overwatch 2."
    },
    "item_135": {
        "title": "Portal 2",
        "img": "../images/Games/Portal 2.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Portal 2."
    },
    "item_136": {
        "title": "Red Dead Redemption",
        "img": "../images/Games/Red Dead Redemption.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Red Dead Redemption."
    },
    "item_137": {
        "title": "Red Dead Redemption 2",
        "img": "../images/Games/Red Dead Redemption 2.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Red Dead Redemption 2."
    },
    "item_138": {
        "title": "Resident Evil 4",
        "img": "../images/Games/Resident Evil 4.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Resident Evil 4."
    },
    "item_139": {
        "title": "Silent Hill 2",
        "img": "../images/Games/Silent Hill 2.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Silent Hill 2."
    },
    "item_140": {
        "title": "The Forest",
        "img": "../images/Games/The Forest.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of The Forest."
    },
    "item_141": {
        "title": "The Last of Us Part I",
        "img": "../images/Games/The Last of Us Part I.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of The Last of Us Part I."
    },
    "item_142": {
        "title": "The Last of Us Part II Remastered",
        "img": "../images/Games/The Last of Us Part II Remastered.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of The Last of Us Part II Remastered."
    },
    "item_143": {
        "title": "The Long Dark",
        "img": "../images/Games/The Long Dark.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of The Long Dark."
    },
    "item_144": {
        "title": "The Witcher 2 Assassins of King",
        "img": "../images/Games/The Witcher 2 Assassins of King.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of The Witcher 2 Assassins of King."
    },
    "item_145": {
        "title": "The Witcher 3 Wild Hunt",
        "img": "../images/Games/The Witcher 3 Wild Hunt.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of The Witcher 3 Wild Hunt."
    },
    "item_146": {
        "title": "Uncharted 4",
        "img": "../images/Games/Uncharted 4.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Uncharted 4."
    },
    "item_147": {
        "title": "Valorant",
        "img": "../images/Games/Valorant.jpeg",
        "tags": [
            "Game",
            "Popular"
        ],
        "year": "2024",
        "length": "N/A",
        "creator": "Cultify",
        "age": "+13",
        "desc": "Explore the details of Valorant."
    }
}

const seedUsers = [
    {
        id: 'user_1',
        firstName: 'Elif',
        lastName: 'Çiçek',
        email: 'admin@cult.com',
        password: 'admin123',
        role: 'admin',
        avatar: 'fa-solid fa-user',
        aboutMe: 'I am an AI model developed by Google...',
        joinYear: 2024
    },
    {
        id: 'user_2',
        firstName: 'Arda',
        lastName: 'Yılmaz',
        email: 'arda@cult.com',
        password: 'arda123',
        role: 'user',
        avatar: 'fa-solid fa-user-ninja',
        aboutMe: 'Film ve dizi tutkunu. Aksiyon ve bilim kurgu hayranı.',
        joinYear: 2024
    },
    {
        id: 'user_3',
        firstName: 'Selin',
        lastName: 'Kaya',
        email: 'selin@cult.com',
        password: 'selin123',
        role: 'user',
        avatar: 'fa-solid fa-user-astronaut',
        aboutMe: 'Kitap kurdu ve oyun sever. Fantasy dünyasının delisi.',
        joinYear: 2025
    }
];

// Comments per content item (itemId -> array of comments)
const seedComments = {
    'item_1': [ // The Dark Knight
        { id: 'c1', userId: 'user_2', text: 'Bu içeriği herkese tavsiye ederim, gerçekten etkileyici!', date: '2025-03-15' },
        { id: 'c2', userId: 'user_3', text: 'Karakter derinliği çok iyi işlenmiş, bayıldım.', date: '2025-03-20' },
        { id: 'c3', userId: 'user_1', text: 'Heath Ledger performansı efsanevi. Joker rolü ile tarihe geçti.', date: '2025-04-01' }
    ],
    'item_6': [ // Inception
        { id: 'c4', userId: 'user_2', text: 'Rüyalar içinde rüyalar... Muazzam bir kurgu.', date: '2025-02-10' },
        { id: 'c5', userId: 'user_3', text: 'Christopher Nolan dehası. Beyin yakan bir film.', date: '2025-02-15' }
    ],
    'item_23': [ // The Godfather
        { id: 'c6', userId: 'user_1', text: 'Sinema tarihinin en büyük yapıtlarından biri.', date: '2025-01-05' },
        { id: 'c7', userId: 'user_2', text: 'Marlon Brando efsane. Her sahne ayrı bir şaheser.', date: '2025-01-10' },
        { id: 'c8', userId: 'user_3', text: 'Mafya filmlerinin babası. Tartışmasız en iyi.', date: '2025-01-20' }
    ],
    'item_49': [ // Breaking Bad
        { id: 'c9', userId: 'user_2', text: 'Walter White karakter dönüşümü televizyon tarihinin en iyisi.', date: '2025-04-05' },
        { id: 'c10', userId: 'user_1', text: 'Her bölüm nefes kesiyor. Dizi bitince boşluğa düştüm.', date: '2025-04-10' }
    ],
    'item_50': [ // Dark
        { id: 'c11', userId: 'user_3', text: 'Die beste deutsche Serie aller Zeiten!', date: '2025-03-01' },
        { id: 'c12', userId: 'user_2', text: 'Zaman yolculuğu konusunda en karmaşık ve en iyi dizi.', date: '2025-03-05' }
    ],
    'item_52': [ // Vikings
        { id: 'c13', userId: 'user_2', text: 'Ragnar Lothbrok karakteri efsane işlenmiş.', date: '2025-02-20' },
        { id: 'c14', userId: 'user_1', text: 'Viking mitolojisi harika anlatılmış. Müzikleri de çok iyi.', date: '2025-02-25' }
    ],
    'item_70': [ // Harry Potter and the Sorcerer's Stone
        { id: 'c15', userId: 'user_3', text: 'Always brings back magical childhood memories.', date: '2025-01-15' },
        { id: 'c16', userId: 'user_1', text: 'Hogwarts her zaman evim olacak. Büyülü bir dünya.', date: '2025-01-20' }
    ],
    'item_74': [ // 1984
        { id: 'c17', userId: 'user_3', text: 'Herkesin kütüphanesinde bulunması gereken bir eser.', date: '2025-03-10' },
        { id: 'c18', userId: 'user_2', text: 'Distopya edebiyatının zirvesi. Günümüzle korkunç benzerlikler.', date: '2025-03-15' }
    ],
    'item_100': [ // GTA V
        { id: 'c19', userId: 'user_2', text: 'Açık dünya oyunlarının kralı. Yıllar geçse de hala oynanıyor.', date: '2025-04-01' },
        { id: 'c20', userId: 'user_1', text: 'Online modu ile bitmek bilmiyor. Efsane oyun.', date: '2025-04-05' }
    ],
    'item_145': [ // The Witcher 3
        { id: 'c21', userId: 'user_3', text: 'RPG oyunlarının tartışmasız en iyisi. Yan görevler bile muazzam.', date: '2025-02-01' },
        { id: 'c22', userId: 'user_2', text: 'Geralt of Rivia efsane karakter. Hikaye muhteşem.', date: '2025-02-05' }
    ]
};

// Community Reviews for Discover page (18+ for 6-per-page pagination)
const seedReviews = [
    { userId: 'user_1', itemId: 'item_23', stars: 5, text: 'Sinema tarihinin en büyük yapıtlarından biri.' },
    { userId: 'user_2', itemId: 'item_52', stars: 5, text: 'Ragnar Lothbrok karakteri efsane işlenmiş.' },
    { userId: 'user_3', itemId: 'item_70', stars: 5, text: 'Always brings back magical childhood memories.' },
    { userId: 'user_3', itemId: 'item_50', stars: 5, text: 'Die beste deutsche Serie aller Zeiten!' },
    { userId: 'user_3', itemId: 'item_74', stars: 5, text: 'Herkesin kütüphanesinde bulunması gereken bir eser.' },
    { userId: 'user_2', itemId: 'item_6', stars: 5, text: 'Rüyalar içinde rüyalar... Muazzam bir kurgu.' },
    // Page 2
    { userId: 'user_1', itemId: 'item_1', stars: 5, text: 'Heath Ledger Joker performansı ile tarihe geçti.' },
    { userId: 'user_2', itemId: 'item_49', stars: 5, text: 'Walter White dönüşümü televizyon tarihinin en iyisi.' },
    { userId: 'user_3', itemId: 'item_145', stars: 5, text: 'RPG oyunlarının tartışmasız en iyisi.' },
    { userId: 'user_1', itemId: 'item_52', stars: 4, text: 'Viking mitolojisi harika anlatılmış.' },
    { userId: 'user_2', itemId: 'item_100', stars: 5, text: 'Açık dünya oyunlarının kralı.' },
    { userId: 'user_3', itemId: 'item_6', stars: 4, text: 'Christopher Nolan dehası. Beyin yakan bir film.' },
    // Page 3
    { userId: 'user_1', itemId: 'item_49', stars: 5, text: 'Her bölüm nefes kesiyor.' },
    { userId: 'user_2', itemId: 'item_23', stars: 5, text: 'Marlon Brando efsane. Her sahne ayrı bir şaheser.' },
    { userId: 'user_3', itemId: 'item_1', stars: 5, text: 'Süper kahraman filmlerinin zirvesi.' },
    { userId: 'user_1', itemId: 'item_100', stars: 4, text: 'Online modu ile bitmek bilmiyor.' },
    { userId: 'user_2', itemId: 'item_145', stars: 5, text: 'Geralt of Rivia efsane karakter.' },
    { userId: 'user_3', itemId: 'item_49', stars: 5, text: 'Dizi bitince büyük bir boşluk hissettim.' },
    // Extra
    { userId: 'user_2', itemId: 'item_1', stars: 5, text: 'Bu içeriği herkese tavsiye ederim!' },
    { userId: 'user_1', itemId: 'item_145', stars: 5, text: 'Yan görevler bile ana hikaye kalitesinde.' }
];

// Seed ratings (userId -> { itemId: rating })
const seedRatings = {
    'user_1': {
        'item_1': 5, 'item_23': 5, 'item_49': 5, 'item_52': 4, 'item_100': 4, 'item_145': 5
    },
    'user_2': {
        'item_1': 5, 'item_6': 5, 'item_23': 5, 'item_49': 5, 'item_52': 5, 'item_100': 5, 'item_145': 5
    },
    'user_3': {
        'item_1': 5, 'item_6': 4, 'item_49': 5, 'item_50': 5, 'item_70': 5, 'item_74': 5, 'item_145': 5
    }
};

// Seed lists (userId -> [itemIds])
const seedLists = {
    'user_1': ['item_1', 'item_23', 'item_49'],
    'user_2': ['item_6', 'item_52', 'item_100', 'item_145'],
    'user_3': ['item_50', 'item_70', 'item_74']
};

// ============================================
// INITIALIZATION — Seed data to localStorage
// ============================================
function initTestData() {
    // Only seed if not already initialized
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(seedUsers));
    }
    if (!localStorage.getItem(STORAGE_KEYS.COMMENTS)) {
        localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(seedComments));
    }
    if (!localStorage.getItem(STORAGE_KEYS.RATINGS)) {
        localStorage.setItem(STORAGE_KEYS.RATINGS, JSON.stringify(seedRatings));
    }
    if (!localStorage.getItem(STORAGE_KEYS.LISTS)) {
        localStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify(seedLists));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CONTENT)) {
        // Create a copy of seedContent to store
        localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(seedContent));
    }
}

// Run on load
initTestData();

// ============================================
// HELPER FUNCTIONS (API Simulation)
// ============================================

// --- CONTENT DB ---
function getContentDB() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTENT) || '{}');
}

function saveContentDB(data) {
    localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(data));
}

// --- USER AUTH ---
function getUser(email, password) {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    return users.find(u => u.email === email && u.password === password) || null;
}

function getUserById(userId) {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    return users.find(u => u.id === userId) || null;
}

function getUserByHandle(handle) {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    return users.find(u => {
        const userHandle = (u.firstName + u.lastName).toLowerCase().replace(/\s/g, '');
        return userHandle === handle;
    }) || null;
}

function getAllUsers() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
}

function registerUser(userData) {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    
    // Check if email already exists
    if (users.find(u => u.email === userData.email)) {
        return { success: false, message: 'Bu email zaten kayıtlı!' };
    }
    
    const newUser = {
        id: 'user_' + (users.length + 1) + '_' + Date.now(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        role: 'user',
        avatar: userData.avatar || 'fa-solid fa-user',
        aboutMe: '',
        joinYear: new Date().getFullYear()
    };
    
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    // Init empty ratings and list for new user
    const ratings = JSON.parse(localStorage.getItem(STORAGE_KEYS.RATINGS) || '{}');
    ratings[newUser.id] = {};
    localStorage.setItem(STORAGE_KEYS.RATINGS, JSON.stringify(ratings));
    
    const lists = JSON.parse(localStorage.getItem(STORAGE_KEYS.LISTS) || '{}');
    lists[newUser.id] = [];
    localStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify(lists));
    
    return { success: true, user: newUser };
}

function updateUser(userId, updates) {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) return false;
    
    Object.assign(users[idx], updates);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return true;
}

function deleteUser(userId) {
    let users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    users = users.filter(u => u.id !== userId);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    // Clean up ratings and lists
    const ratings = JSON.parse(localStorage.getItem(STORAGE_KEYS.RATINGS) || '{}');
    delete ratings[userId];
    localStorage.setItem(STORAGE_KEYS.RATINGS, JSON.stringify(ratings));
    
    const lists = JSON.parse(localStorage.getItem(STORAGE_KEYS.LISTS) || '{}');
    delete lists[userId];
    localStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify(lists));
    
    return true;
}

// --- CURRENT USER SESSION ---
function setCurrentUser(userId) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, userId);
}

function getCurrentUserId() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
}

function getCurrentUser() {
    const userId = getCurrentUserId();
    if (!userId) return null;
    return getUserById(userId);
}

function clearCurrentUser() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

// --- COMMENTS ---
function getCommentsForItem(itemId, includePending = false) {
    const comments = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMENTS) || '{}');
    const itemComments = comments[itemId] || [];
    if (includePending) return itemComments;
    // For normal display, only show approved, or if they lack a status (seeded legacy data)
    return itemComments.filter(c => !c.status || c.status === 'approved');
}

function getAllCommentsForAdmin() {
    const comments = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMENTS) || '{}');
    let reviewList = [];
    for (const [itemId, itemComments] of Object.entries(comments)) {
        itemComments.forEach(c => {
            reviewList.push({ itemId, ...c });
        });
    }
    return reviewList.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function addComment(itemId, userId, text) {
    const comments = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMENTS) || '{}');
    if (!comments[itemId]) comments[itemId] = [];
    
    const newComment = {
        id: 'c_' + Date.now(),
        userId: userId,
        text: text,
        date: new Date().toISOString().split('T')[0],
        status: 'pending' // New comments wait for approval
    };
    
    comments[itemId].push(newComment);
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
    return newComment;
}

function approveComment(itemId, commentId) {
    const comments = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMENTS) || '{}');
    if (comments[itemId]) {
        const idx = comments[itemId].findIndex(c => c.id === commentId);
        if (idx !== -1) {
            comments[itemId][idx].status = 'approved';
            localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
            return true;
        }
    }
    return false;
}

function getAllCommentsByUser(userId) {
    const comments = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMENTS) || '{}');
    const userComments = [];
    for (const [itemId, itemComments] of Object.entries(comments)) {
        itemComments.forEach(c => {
            if (c.userId === userId && (!c.status || c.status === 'approved')) {
                userComments.push({ ...c, itemId });
            }
        });
    }
    return userComments;
}

// --- RATINGS ---
function getUserRatings(userId) {
    const ratings = JSON.parse(localStorage.getItem(STORAGE_KEYS.RATINGS) || '{}');
    return ratings[userId] || {};
}

function getRating(userId, itemId) {
    const ratings = getUserRatings(userId);
    return ratings[itemId] || 0;
}

function setRating(userId, itemId, rating) {
    const ratings = JSON.parse(localStorage.getItem(STORAGE_KEYS.RATINGS) || '{}');
    if (!ratings[userId]) ratings[userId] = {};
    if (rating === 0) {
        delete ratings[userId][itemId];
    } else {
        ratings[userId][itemId] = rating;
    }
    localStorage.setItem(STORAGE_KEYS.RATINGS, JSON.stringify(ratings));
}

function getItemAverageRating(itemId) {
    const ratings = JSON.parse(localStorage.getItem(STORAGE_KEYS.RATINGS) || '{}');
    let total = 0;
    let count = 0;
    for (const [userId, userRatings] of Object.entries(ratings)) {
        if (userRatings[itemId]) {
            total += userRatings[itemId];
            count++;
        }
    }
    return count === 0 ? 0 : (total / count).toFixed(1);
}

function deleteComment(itemId, commentId) {
    const comments = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMENTS) || '{}');
    if (comments[itemId]) {
        comments[itemId] = comments[itemId].filter(c => c.id !== commentId);
        localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
    }
}

function editComment(itemId, commentId, newText) {
    const comments = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMENTS) || '{}');
    if (comments[itemId]) {
        const idx = comments[itemId].findIndex(c => c.id === commentId);
        if (idx !== -1) {
            comments[itemId][idx].text = newText;
            comments[itemId][idx].status = 'pending'; // Re-approval required
            comments[itemId][idx].date = new Date().toISOString().split('T')[0];
            localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
        }
    }
}

// --- USER LISTS ---
function getUserList(userId) {
    const lists = JSON.parse(localStorage.getItem(STORAGE_KEYS.LISTS) || '{}');
    return lists[userId] || [];
}

function addToUserList(userId, itemId) {
    const lists = JSON.parse(localStorage.getItem(STORAGE_KEYS.LISTS) || '{}');
    if (!lists[userId]) lists[userId] = [];
    if (!lists[userId].includes(itemId)) {
        lists[userId].push(itemId);
        localStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify(lists));
    }
}

function removeFromUserList(userId, itemId) {
    const lists = JSON.parse(localStorage.getItem(STORAGE_KEYS.LISTS) || '{}');
    if (!lists[userId]) return;
    lists[userId] = lists[userId].filter(id => id !== itemId);
    localStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify(lists));
}

// --- COMMUNITY REVIEWS (Discover Page) ---
function getCommunityReviews() {
    // Dynamically generate from approved comments and real user ratings
    const allApprovedComments = getAllCommentsForAdmin().filter(c => !c.status || c.status === 'approved');
    
    return allApprovedComments.map(rev => {
        const user = getUserById(rev.userId);
        const rating = getRating(rev.userId, rev.itemId) || 5; // Fallback to 5 if rated without explicit comment linkage
        return {
            ...rev,
            stars: rating,
            userName: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
            userHandle: user ? (user.firstName + user.lastName).toLowerCase().replace(/\s/g, '') : 'unknown',
            userAvatar: user ? user.avatar : 'fa-solid fa-user'
        };
    });
}

// --- RESET (for testing) ---
function resetTestData() {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.COMMENTS);
    localStorage.removeItem(STORAGE_KEYS.RATINGS);
    localStorage.removeItem(STORAGE_KEYS.LISTS);
    localStorage.removeItem(STORAGE_KEYS.CONTENT);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem('cultify_logged_in');
    localStorage.removeItem('cultify_user_name');
    localStorage.removeItem('cultify_user_role');
    localStorage.removeItem('cultify_user_avatar');
    localStorage.removeItem('cultify_mylist');
    localStorage.removeItem('cultify_user_reviews');
    initTestData();
    console.log('Test data reset complete!');
}

// Expose reset for console usage
window.resetTestData = resetTestData;

