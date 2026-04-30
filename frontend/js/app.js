// ============================================
// CULTIFY — APP.JS
// ============================================

// --- AUTH SYSTEM ---
function isLoggedIn() { return localStorage.getItem('cultify_logged_in') === 'true'; }
function setLoggedIn(val) { localStorage.setItem('cultify_logged_in', val ? 'true' : 'false'); }
function showLoginModal() {
    const m = document.getElementById('login-modal');
    if (m) m.classList.add('active');
}
function closeLoginModal() {
    const m = document.getElementById('login-modal');
    if (m) m.classList.remove('active');
}
window.closeLoginModal = closeLoginModal;
window.showLoginModal = showLoginModal;

function setLoggedIn(val, name = '', role = '') { 
    localStorage.setItem('cultify_logged_in', val ? 'true' : 'false'); 
    if (val) {
        localStorage.setItem('cultify_user_name', name);
        localStorage.setItem('cultify_user_role', role);
    } else {
        localStorage.removeItem('cultify_user_name');
        localStorage.removeItem('cultify_user_role');
    }
}

// Header login/logout toggle
const headerLoggedIn = document.getElementById('header-logged-in');
const headerLoggedOut = document.getElementById('header-logged-out');
if (headerLoggedIn && headerLoggedOut) {
    if (isLoggedIn()) { 
        headerLoggedIn.style.display = ''; 
        headerLoggedOut.style.display = 'none'; 
        // Update name in header
        const nameSpan = headerLoggedIn.querySelector('.username');
        if (nameSpan) nameSpan.textContent = localStorage.getItem('cultify_user_name') || 'User';
        
        // Hide Admin link if not admin
        const adminLink = headerLoggedIn.querySelector('a[href="admin.html"]')?.parentElement;
        if (adminLink) {
            adminLink.style.display = localStorage.getItem('cultify_user_role') === 'admin' ? '' : 'none';
        }
    }
    else { headerLoggedIn.style.display = 'none'; headerLoggedOut.style.display = ''; }
}
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault(); setLoggedIn(false); window.location.href = 'index.html';
    });
}

// --- CONTENT DATABASE ---
const contentDB = {
    // --- SERIES ---
    'breaking-bad': { title: 'Breaking Bad', img: 'https://placehold.co/600x900/131b2c/6366f1?text=Breaking+Bad', tags: ['Series', 'Crime', 'Drama'], year: '2008', length: '5 Seasons', creator: 'Vince Gilligan', age: '+18', desc: 'A high school chemistry teacher turns to manufacturing methamphetamine.' },
    'game-of-thrones': { title: 'Game of Thrones', img: 'https://placehold.co/600x900/131b2c/a855f7?text=Game+of+Thrones', tags: ['Series', 'Fantasy', 'Drama'], year: '2011', length: '8 Seasons', creator: 'David Benioff', age: '+18', desc: 'Nine noble families fight for control over the lands of Westeros.' },
    'dark': { title: 'Dark', img: 'https://placehold.co/600x900/131b2c/3b82f6?text=Dark', tags: ['Series', 'Sci-Fi', 'Mystery'], year: '2017', length: '3 Seasons', creator: 'Baran bo Odar', age: '+16', desc: 'A family saga with a supernatural twist set in a German town.' },
    'lost': { title: 'Lost', img: 'https://placehold.co/600x900/131b2c/10b981?text=Lost', tags: ['Series', 'Adventure', 'Mystery'], year: '2004', length: '6 Seasons', creator: 'J.J. Abrams', age: '+14', desc: 'Survivors of a plane crash are forced to work together on a deserted island.' },
    'vikings': { title: 'Vikings', img: 'https://placehold.co/600x900/131b2c/ef4444?text=Vikings', tags: ['Series', 'Action', 'History'], year: '2013', length: '6 Seasons', creator: 'Michael Hirst', age: '+18', desc: 'The brutal and mysterious world of Ragnar Lothbrok.' },
    'sherlock': { title: 'Sherlock', img: 'https://placehold.co/600x900/131b2c/f59e0b?text=Sherlock', tags: ['Series', 'Crime', 'Mystery'], year: '2010', length: '4 Seasons', creator: 'Steven Moffat', age: '+14', desc: 'A modern update of the famous sleuth in 21st century London.' },
    'last-of-us-series': { title: 'The Last of Us', img: 'https://placehold.co/600x900/131b2c/6366f1?text=The+Last+of+Us', tags: ['Series', 'Drama', 'Action'], year: '2023', length: '1 Season', creator: 'Neil Druckmann', age: '+18', desc: 'A hardened survivor takes charge of a 14-year-old girl after a pandemic.' },
    'mr-robot': { title: 'Mr. Robot', img: 'https://placehold.co/600x900/131b2c/3b82f6?text=Mr.+Robot', tags: ['Series', 'Drama', 'Thriller'], year: '2015', length: '4 Seasons', creator: 'Sam Esmail', age: '+16', desc: 'A young cyber-security engineer becomes a key figure in global dominance.' },
    'chernobyl': { title: 'Chernobyl', img: 'https://placehold.co/600x900/131b2c/10b981?text=Chernobyl', tags: ['Series', 'Drama', 'History'], year: '2019', length: '1 Season', creator: 'Craig Mazin', age: '+16', desc: 'The story of the 1986 nuclear accident in the USSR.' },
    'peaky-blinders': { title: 'Peaky Blinders', img: 'https://placehold.co/600x900/131b2c/ef4444?text=Peaky+Blinders', tags: ['Series', 'Crime', 'Drama'], year: '2013', length: '6 Seasons', creator: 'Steven Knight', age: '+18', desc: 'A gangster family epic set in 1900s England.' },

    // --- MOVIES ---
    'shawshank': { title: 'The Shawshank Redemption', img: 'https://placehold.co/600x900/131b2c/f59e0b?text=Shawshank', tags: ['Movie', 'Drama', 'Classic'], year: '1994', length: '142 Min.', creator: 'Frank Darabont', age: '+16', desc: 'Two imprisoned men bond over a number of years.' },
    'godfather': { title: 'The Godfather', img: 'https://placehold.co/600x900/131b2c/6366f1?text=Godfather', tags: ['Movie', 'Crime', 'Drama'], year: '1972', length: '175 Min.', creator: 'Francis Ford Coppola', age: '+18', desc: 'An aging patriarch transfers control to his son.' },
    'dark-knight': { title: 'The Dark Knight', img: 'https://placehold.co/600x900/131b2c/a855f7?text=The+Dark+Knight', tags: ['Movie', 'Action', 'Crime'], year: '2008', length: '152 Min.', creator: 'Christopher Nolan', age: '+16', desc: 'Batman must accept one of the greatest psychological tests.' },
    'pulp-fiction': { title: 'Pulp Fiction', img: 'https://placehold.co/600x900/131b2c/3b82f6?text=Pulp+Fiction', tags: ['Movie', 'Crime', 'Thriller'], year: '1994', length: '154 Min.', creator: 'Quentin Tarantino', age: '+18', desc: 'The lives of mob hitmen and a boxer intertwine.' },
    'inception': { title: 'Inception', img: 'https://placehold.co/600x900/131b2c/10b981?text=Inception', tags: ['Movie', 'Sci-Fi', 'Action'], year: '2010', length: '148 Min.', creator: 'Christopher Nolan', age: '+13', desc: 'A thief steals secrets through dream-sharing technology.' },
    'interstellar': { title: 'Interstellar', img: 'https://placehold.co/600x900/131b2c/ef4444?text=Interstellar', tags: ['Movie', 'Sci-Fi', 'Drama'], year: '2014', length: '169 Min.', creator: 'Christopher Nolan', age: '+13', desc: 'A team of explorers travel through a wormhole.' },
    'dune-2': { title: 'Dune: Part Two', img: 'https://placehold.co/600x900/131b2c/f59e0b?text=Dune+2', tags: ['Movie', 'Sci-Fi', 'Adventure'], year: '2024', length: '166 Min.', creator: 'Denis Villeneuve', age: '+13', desc: 'Paul Atreides unites with the Fremen for revenge.' },
    'oppenheimer': { title: 'Oppenheimer', img: 'https://placehold.co/600x900/131b2c/6366f1?text=Oppenheimer', tags: ['Movie', 'Drama', 'History'], year: '2023', length: '180 Min.', creator: 'Christopher Nolan', age: '+16', desc: 'The role of J. Robert Oppenheimer in the atomic bomb.' },

    // --- BOOKS ---
    '1984': { title: '1984', img: 'https://placehold.co/600x900/131b2c/a855f7?text=1984', tags: ['Book', 'Dystopia', 'Sci-Fi'], year: '1949', length: '328 Pages', creator: 'George Orwell', age: '+16', desc: 'Winston Smith rebels against a totalitarian society.' },
    'harry-potter': { title: 'Harry Potter', img: 'https://placehold.co/600x900/131b2c/3b82f6?text=Harry+Potter', tags: ['Book', 'Fantasy', 'Adventure'], year: '1997', length: '309 Pages', creator: 'J.K. Rowling', age: '+10', desc: 'A young boy discovers he is a wizard.' },
    'lotr-book': { title: 'The Lord of the Rings', img: 'https://placehold.co/600x900/131b2c/10b981?text=LOTR', tags: ['Book', 'Fantasy', 'Classic'], year: '1954', length: '1178 Pages', creator: 'J.R.R. Tolkien', age: '+12', desc: 'The epic saga of the war for the One Ring.' },
    'alchemist': { title: 'The Alchemist', img: 'https://placehold.co/600x900/131b2c/ef4444?text=The+Alchemist', tags: ['Book', 'Fiction', 'Philosophy'], year: '1988', length: '163 Pages', creator: 'Paulo Coelho', age: '+12', desc: 'A shepherd boy travels to search for treasure.' },

    // --- GAMES ---
    'witcher3': { title: 'The Witcher 3', img: 'https://placehold.co/600x900/131b2c/f59e0b?text=Witcher+3', tags: ['Game', 'RPG', 'Fantasy'], year: '2015', length: '100+ Hours', creator: 'CD Projekt RED', age: '+18', desc: 'Become a professional monster slayer.' },
    'elden-ring': { title: 'Elden Ring', img: 'https://placehold.co/600x900/131b2c/6366f1?text=Elden+Ring', tags: ['Game', 'Action RPG', 'Fantasy'], year: '2022', length: '100+ Hours', creator: 'FromSoftware', age: '+16', desc: 'Journey to become the Elden Lord.' },
    'rdr2': { title: 'Red Dead Redemption 2', img: 'https://placehold.co/600x900/131b2c/a855f7?text=RDR2', tags: ['Game', 'Open World', 'Western'], year: '2018', length: '60+ Hours', creator: 'Rockstar Games', age: '+18', desc: 'Arthur Morgan and his gang on the run.' },
    'baldurs-gate-3': { title: 'Baldur\'s Gate 3', img: 'https://placehold.co/600x900/131b2c/3b82f6?text=Baldurs+Gate+3', tags: ['Game', 'RPG', 'Adventure'], year: '2023', length: '100+ Hours', creator: 'Larian Studios', age: '+18', desc: 'Abducted, infected, lost. You are turning into a monster.' },
    
    // --- BATCH 2 ---
    'lost': { title: 'Lost', img: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/r9ca9pZ669S97zYn76S999iB2S7.jpg', tags: ['Series', 'Adventure', 'Drama'], year: '2004', length: '6 Seasons', creator: 'J.J. Abrams', age: '+14', desc: 'The survivors of a plane crash are forced to work together in order to survive on a seemingly deserted tropical island.' },
    'vikings': { title: 'Vikings', img: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/b5ra7SWSZpSnaC9ecT5C60RiS7U.jpg', tags: ['Series', 'Action', 'Drama'], year: '2013', length: '6 Seasons', creator: 'Michael Hirst', age: '+18', desc: 'Ragnar Lothbrok, a Viking warrior and farmer, yearns to explore and raid the distant shores across the ocean.' },
    'last-kingdom': { title: 'The Last Kingdom', img: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/8eJf0hCym6Yny21YnsCk2bsu57T.jpg', tags: ['Series', 'Action', 'History'], year: '2015', length: '5 Seasons', creator: 'Stephen Butchard', age: '+18', desc: 'As Alfred the Great defends his kingdom from Norse invaders, Uhtred—born a Saxon but raised by Vikings—seeks to claim his ancestral birthright.' },
    'walking-dead': { title: 'The Walking Dead', img: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/xf9m7sS4SOUmBicU7nBpkUfjQoW.jpg', tags: ['Series', 'Horror', 'Drama'], year: '2010', length: '11 Seasons', creator: 'Frank Darabont', age: '+18', desc: 'Sheriff Deputy Rick Grimes leads a group of survivors in a world overrun by the walking dead.' },
    'house-md': { title: 'House M.D.', img: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/3698v097Y9pZ9YpUnS987pt0Uv8.jpg', tags: ['Series', 'Drama', 'Mystery'], year: '2004', length: '8 Seasons', creator: 'David Shore', age: '+14', desc: 'An antisocial maverick doctor who specializes in diagnostic medicine does whatever it takes to solve puzzling cases.' },
    'lucifer': { title: 'Lucifer', img: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/ekZobS8isE6SqcNBbq3Pqj7Gv6z.jpg', tags: ['Series', 'Crime', 'Fantasy'], year: '2016', length: '6 Seasons', creator: 'Tom Kapinos', age: '+16', desc: 'Lucifer Morningstar has decided he\'s had enough of being the dutiful servant in Hell and decides to spend some time on Earth to better understand humanity.' },
    'mentalist': { title: 'The Mentalist', img: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/ac3oYyS9XpS9f3uI1pYvS6Osh7S.jpg', tags: ['Series', 'Crime', 'Drama'], year: '2008', length: '7 Seasons', creator: 'Bruno Heller', age: '+14', desc: 'A famous "psychic" outs himself as a fake and starts working as a consultant for the California Bureau of Investigation.' },
    'dexter': { title: 'Dexter', img: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/58H3898rclj639SntY9mZ0W917S.jpg', tags: ['Series', 'Crime', 'Thriller'], year: '2006', length: '8 Seasons', creator: 'James Manos Jr.', age: '+18', desc: 'By day, mild-mannered Dexter is a blood-spatter analyst for the Miami police. But at night, he is a serial killer who only targets other murderers.' },
    'gentlemen': { title: 'The Gentlemen', img: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/v8Y9mO5Y6uS9YpSnt9mY9YpY9Yp.jpg', tags: ['Series', 'Crime', 'Comedy'], year: '2024', length: '1 Season', creator: 'Guy Ritchie', age: '+18', desc: 'When aristocratic Eddie inherits the family estate, he discovers that it\'s home to an enormous weed empire, and its proprietors aren\'t going anywhere.' },
    'wednesday': { title: 'Wednesday', img: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/998id8Y9pZ9YpSnt9mY9YpY9Yp.jpg', tags: ['Series', 'Fantasy', 'Mystery'], year: '2022', length: '1 Season', creator: 'Alfred Gough', age: '+13', desc: 'Follows Wednesday Addams\' years as a student at Nevermore Academy, as she attempts to master her emerging psychic ability.' },
    'schindlers-list': { title: 'Schindler\'s List', img: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/sF1U4EU7S6fS9Snt9mY9YpY9Yp.jpg', tags: ['Movie', 'Drama', 'History'], year: '1993', length: '195 Min.', creator: 'Steven Spielberg', age: '+16', desc: 'In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.' },
    'fight-club': { title: 'Fight Club', img: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/pB8BM7SWSZpSnaC9ecT5C60RiS7U.jpg', tags: ['Movie', 'Drama', 'Thriller'], year: '1999', length: '139 Min.', creator: 'David Fincher', age: '+18', desc: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.' },
    'forrest-gump': { title: 'Forrest Gump', img: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/arw2vcBveS5SnaC9ecT5C60RiS7U.jpg', tags: ['Movie', 'Drama', 'Romance'], year: '1994', length: '142 Min.', creator: 'Robert Zemeckis', age: '+13', desc: 'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.' },
    'parasite': { title: 'Parasite', img: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/7IiTTjSWSZpSnaC9ecT5C60RiS7U.jpg', tags: ['Movie', 'Thriller', 'Drama'], year: '2019', length: '132 Min.', creator: 'Bong Joon-ho', age: '+16', desc: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.' },
    'gladiator': { title: 'Gladiator', img: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/ty8TjSWSZpSnaC9ecT5C60RiS7U.jpg', tags: ['Movie', 'Action', 'Drama'], year: '2000', length: '155 Min.', creator: 'Ridley Scott', age: '+16', desc: 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.' },
    'crime-punishment': { title: 'Crime and Punishment', img: 'https://covers.openlibrary.org/b/id/12668586-L.jpg', tags: ['Book', 'Classic', 'Psychological'], year: '1866', length: '671 Pages', creator: 'Fyodor Dostoevsky', age: '+16', desc: 'Raskolnikov, a destitute and desperate former student, wanders through the slums of St Petersburg and commits a random murder without remorse or regret.' },
    'little-prince': { title: 'The Little Prince', img: 'https://covers.openlibrary.org/b/id/12668587-L.jpg', tags: ['Book', 'Fantasy', 'Classic'], year: '1943', length: '96 Pages', creator: 'Antoine de Saint-Exupéry', age: '+8', desc: 'A pilot stranded in the desert awakes one morning to see, standing before him, the most extraordinary little fellow.' },
    'animal-farm': { title: 'Animal Farm', img: 'https://covers.openlibrary.org/b/id/12668588-L.jpg', tags: ['Book', 'Satire', 'Classic'], year: '1945', length: '112 Pages', creator: 'George Orwell', age: '+12', desc: 'A farm is taken over by its overworked, mistreated animals. With flaming idealism and stirring slogans, they set out to create a paradise of progress, justice, and equality.' },
    'max-payne-3': { title: 'Max Payne 3', img: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1v6x.jpg', tags: ['Game', 'Action', 'Shooter'], year: '2012', length: '12 Hours', creator: 'Rockstar Games', age: '+18', desc: 'Max Payne, a man haunted by the traumas of his past, begins a new life working private security protecting a wealthy industrialist and his family in Sao Paulo, Brazil.' },
    'minecraft': { title: 'Minecraft', img: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co49x5.jpg', tags: ['Game', 'Sandbox', 'Adventure'], year: '2011', length: 'Infinite', creator: 'Mojang Studios', age: '+7', desc: 'Explore infinite worlds and build everything from the simplest of homes to the grandest of castles.' },
    'mafia-2': { title: 'Mafia II', img: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co20m5.jpg', tags: ['Game', 'Action', 'Crime'], year: '2010', length: '15 Hours', creator: '2K Czech', age: '+18', desc: 'Vito Scaletta has started to make a name for himself on the streets of Empire Bay as someone who can be trusted to get a job done.' },
    'portal-2': { title: 'Portal 2', img: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1m64.jpg', tags: ['Game', 'Puzzle', 'Sci-Fi'], year: '2011', length: '10 Hours', creator: 'Valve', age: '+10', desc: 'Portal 2 draws from the award-winning formula of innovative gameplay, story, and music that earned the original Portal over 70 industry accolades.' },

    // --- BATCH 3 ---
    'casa-de-papel': { title: 'Money Heist', img: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/reEMJA1uzpG3Snt9mY9YpY9Yp.jpg', tags: ['Series', 'Crime', 'Thriller'], year: '2017', length: '5 Seasons', creator: 'Álex Pina', age: '+16', desc: 'An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history - stealing 2.4 billion euros from the Royal Mint of Spain.' },
    '3-body-problem': { title: '3 Body Problem', img: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/8eJf0hCym6Yny21YnsCk2bsu57T.jpg', tags: ['Series', 'Sci-Fi', 'Mystery'], year: '2024', length: '1 Season', creator: 'David Benioff, D.B. Weiss', age: '+16', desc: 'A fateful decision made in 1960s China echoes across space and time to a group of scientists in the present, forcing them to face humanity\'s greatest threat.' },
    'ragnarok-series': { title: 'Ragnarok', img: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/998id8Y9pZ9YpSnt9mY9YpY9Yp.jpg', tags: ['Series', 'Fantasy', 'Drama'], year: '2020', length: '3 Seasons', creator: 'Adam Price', age: '+16', desc: 'A small Norwegian town experiencing warm winters and violent downpours seems to be headed for another Ragnarok—unless someone intervenes in time.' },
    'after-life': { title: 'After Life', img: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/mS098id8Y9pZ9YpSnt9mY9YpY9Yp.jpg', tags: ['Series', 'Comedy', 'Drama'], year: '2019', length: '3 Seasons', creator: 'Ricky Gervais', age: '+16', desc: 'Tony had a perfect life. But after his wife Lisa dies, Tony changes. After contemplating taking his own life, he decides instead to live long enough to punish the world by saying and doing whatever he likes.' },
    'titanic': { title: 'Titanic', img: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/998id8Y9pZ9YpSnt9mY9YpY9Yp.jpg', tags: ['Movie', 'Romance', 'Drama'], year: '1997', length: '194 Min.', creator: 'James Cameron', age: '+13', desc: 'A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.' },
    'avengers-endgame': { title: 'Avengers: Endgame', img: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/or06qbC9vAgJa7CztY9o6u6Y2.jpg', tags: ['Movie', 'Action', 'Sci-Fi'], year: '2019', length: '181 Min.', creator: 'Anthony Russo, Joe Russo', age: '+12', desc: 'After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more.' },
    'avatar-2': { title: 'Avatar: The Way of Water', img: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/t6HI7SWSZpSnaC9ecT5C60RiS7U.jpg', tags: ['Movie', 'Sci-Fi', 'Action'], year: '2022', length: '192 Min.', creator: 'James Cameron', age: '+12', desc: 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na\'vi race to protect their home.' },
    'spider-verse': { title: 'Spider-Man: Across the Spider-Verse', img: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/8Gxv3mYgiFApXfGrsyotz2pC3vH.jpg', tags: ['Movie', 'Animation', 'Action'], year: '2023', length: '140 Min.', creator: 'Joaquim Dos Santos', age: '+10', desc: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.' },
    'martian': { title: 'The Martian', img: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/998id8Y9pZ9YpSnt9mY9YpY9Yp.jpg', tags: ['Movie', 'Sci-Fi', 'Adventure'], year: '2015', length: '144 Min.', creator: 'Ridley Scott', age: '+13', desc: 'An astronaut becomes stranded on Mars after his team assume him dead, and must rely on his ingenuity to find a way to signal to Earth that he is alive.' },
    'goodfellas': { title: 'Goodfellas', img: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/998id8Y9pZ9YpSnt9mY9YpY9Yp.jpg', tags: ['Movie', 'Crime', 'Drama'], year: '1990', length: '145 Min.', creator: 'Martin Scorsese', age: '+18', desc: 'The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito in the Italian-American crime syndicate.' },
    'tenet': { title: 'Tenet', img: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/k68nPLbT6mY9YpSnt9mY9YpY9Yp.jpg', tags: ['Movie', 'Action', 'Sci-Fi'], year: '2020', length: '150 Min.', creator: 'Christopher Nolan', age: '+13', desc: 'Armed with only one word, Tenet, and fighting for the survival of the entire world, a Protagonist journeys through a twilight world of international espionage on a mission that will unfold in something beyond real time.' },
    'les-miserables': { title: 'Les Misérables', img: 'https://covers.openlibrary.org/b/id/12668589-L.jpg', tags: ['Book', 'Classic', 'Drama'], year: '1862', length: '1462 Pages', creator: 'Victor Hugo', age: '+14', desc: 'In nineteenth-century France, Jean Valjean, who for decades has been hunted by the ruthless policeman Javert after breaking parole, agrees to care for a factory worker\'s daughter.' },
    'mockingbird': { title: 'To Kill a Mockingbird', img: 'https://covers.openlibrary.org/b/id/12668590-L.jpg', tags: ['Book', 'Classic', 'Drama'], year: '1960', length: '281 Pages', creator: 'Harper Lee', age: '+12', desc: 'The story of young Scout Finch and her father Atticus, a lawyer who defends a black man charged with the rape of a white girl.' },
    'dorian-gray': { title: 'The Picture of Dorian Gray', img: 'https://covers.openlibrary.org/b/id/12668591-L.jpg', tags: ['Book', 'Classic', 'Gothic'], year: '1890', length: '254 Pages', creator: 'Oscar Wilde', age: '+16', desc: 'A corruptible young man has his soul painted into a portrait, which ages and decays while he remains forever young.' },
    'alice-wonderland': { title: 'Alice in Wonderland', img: 'https://covers.openlibrary.org/b/id/12668592-L.jpg', tags: ['Book', 'Fantasy', 'Classic'], year: '1865', length: '200 Pages', creator: 'Lewis Carroll', age: '+8', desc: 'A young girl named Alice falls through a rabbit hole into a fantasy world populated by peculiar, anthropomorphic creatures.' },
    'metamorphosis': { title: 'The Metamorphosis', img: 'https://covers.openlibrary.org/b/id/12668593-L.jpg', tags: ['Book', 'Classic', 'Absurdist'], year: '1915', length: '100 Pages', creator: 'Franz Kafka', age: '+14', desc: 'The story of salesman Gregor Samsa, who wakes one morning to find himself inexplicably transformed into a huge insect.' },
    'gta-sa': { title: 'Grand Theft Auto: San Andreas', img: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1vqx.jpg', tags: ['Game', 'Action', 'Open World'], year: '2004', length: '30+ Hours', creator: 'Rockstar North', age: '+18', desc: 'After his mother\'s murder, Carl Johnson is coerced by corrupt police into a journey that takes him across the entire state of San Andreas to save his family and take control of the streets.' },
    'ets2': { title: 'Euro Truck Simulator 2', img: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2lbd.jpg', tags: ['Game', 'Simulation', 'Driving'], year: '2012', length: 'Infinite', creator: 'SCS Software', age: '+3', desc: 'Travel across Europe as king of the road, a trucker who delivers important cargo across impressive distances!' },
    'ac-black-flag': { title: 'Assassin\'s Creed IV Black Flag', img: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1v5x.jpg', tags: ['Game', 'Action', 'Adventure'], year: '2013', length: '20+ Hours', creator: 'Ubisoft Montreal', age: '+18', desc: 'The year is 1715. Pirates rule the Caribbean and have established their own lawless Republic where corruption, greediness and cruelty are commonplace.' },
    'cs2': { title: 'Counter-Strike 2', img: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6cl9.jpg', tags: ['Game', 'Action', 'Shooter'], year: '2023', length: 'Infinite', creator: 'Valve', age: '+16', desc: 'For over two decades, Counter-Strike has offered an elite competitive experience, one shaped by the millions of players from across the globe.' },
    'valorant': { title: 'Valorant', img: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2mdf.jpg', tags: ['Game', 'Action', 'Shooter'], year: '2020', length: 'Infinite', creator: 'Riot Games', age: '+16', desc: 'A 5v5 character-based tactical shooter where precise gunplay meets unique agent abilities.' },
    'hades': { title: 'Hades', img: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1v76.jpg', tags: ['Game', 'Action', 'Indie'], year: '2020', length: '20+ Hours', creator: 'Supergiant Games', age: '+12', desc: 'Defy the god of the dead as you hack and slash out of the Underworld in this rogue-like dungeon crawler from the creators of Bastion and Transistor.' },

    // --- BATCH 4 ---
    'brave-new-world': { title: 'Brave New World', img: 'https://covers.openlibrary.org/b/id/12668594-L.jpg', tags: ['Book', 'Sci-Fi', 'Dystopia'], year: '1932', length: '311 Pages', creator: 'Aldous Huxley', age: '+16', desc: 'A futuristic society where citizens are environmentally engineered into a rigid intelligence-based social hierarchy.' },
    'fahrenheit-451': { title: 'Fahrenheit 451', img: 'https://covers.openlibrary.org/b/id/12668595-L.jpg', tags: ['Book', 'Sci-Fi', 'Dystopia'], year: '1953', length: '158 Pages', creator: 'Ray Bradbury', age: '+14', desc: 'In a future American society where books are outlawed and "firemen" burn any that are found.' },
    'dracula': { title: 'Dracula', img: 'https://covers.openlibrary.org/b/id/12668596-L.jpg', tags: ['Book', 'Horror', 'Classic'], year: '1897', length: '418 Pages', creator: 'Bram Stoker', age: '+16', desc: 'The story of Count Dracula\'s attempt to move from Transylvania to England so that he may find new blood and spread the undead curse.' },
    'hobbit-book': { title: 'The Hobbit', img: 'https://covers.openlibrary.org/b/id/12668597-L.jpg', tags: ['Book', 'Fantasy', 'Adventure'], year: '1937', length: '310 Pages', creator: 'J.R.R. Tolkien', age: '+10', desc: 'Bilbo Baggins, a hobbit enjoying a quiet life, is swept into an epic quest by Gandalf the Wizard and thirteen dwarves.' },
    'foundation-book': { title: 'Foundation', img: 'https://covers.openlibrary.org/b/id/12668598-L.jpg', tags: ['Book', 'Sci-Fi', 'Classic'], year: '1951', length: '255 Pages', creator: 'Isaac Asimov', age: '+14', desc: 'The first novel in the Foundation series, a saga about the fall and rebirth of a galactic empire.' },
    'sapiens-book': { title: 'Sapiens: A Brief History of Humankind', img: 'https://covers.openlibrary.org/b/id/12668599-L.jpg', tags: ['Book', 'Non-Fiction', 'History'], year: '2011', length: '443 Pages', creator: 'Yuval Noah Harari', age: '+14', desc: 'Spanning the whole of human history, from the very first humans to walk the earth to the radical – and sometimes devious – breakthroughs of the Cognitive, Agricultural and Scientific Revolutions.' },
    'doom-2016': { title: 'DOOM', img: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1v5v.jpg', tags: ['Game', 'Action', 'Shooter'], year: '2016', length: '12 Hours', creator: 'id Software', age: '+18', desc: 'Relentless demons, impossibly destructive guns, and fast, fluid movement provide the foundation for intense, first-person combat.' },
    'dark-souls': { title: 'Dark Souls', img: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2lbd.jpg', tags: ['Game', 'RPG', 'Action'], year: '2011', length: '50+ Hours', creator: 'FromSoftware', age: '+16', desc: 'Prepare to Die. A new, dark fantasy world from the creators of Demon\'s Souls, set in a massive, seamless world.' },
    'silent-hill-2': { title: 'Silent Hill 2', img: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2lbe.jpg', tags: ['Game', 'Horror', 'Mystery'], year: '2001', length: '10 Hours', creator: 'Konami', age: '+18', desc: 'James Sunderland\'s life is shattered when his young wife Mary dies. Three years later, a mysterious letter arrives from Mary, beckoning him to return to their "special place" in Silent Hill.' },
    'disco-elysium': { title: 'Disco Elysium', img: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1v69.jpg', tags: ['Game', 'RPG', 'Story'], year: '2019', length: '30+ Hours', creator: 'ZA/UM', age: '+18', desc: 'A detective role-playing game with a unique skill system and a whole city block to carve your path through.' },
    'fallout-nv': { title: 'Fallout: New Vegas', img: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2lbf.jpg', tags: ['Game', 'RPG', 'Action'], year: '2010', length: '40+ Hours', creator: 'Obsidian Entertainment', age: '+18', desc: 'Welcome to Vegas. New Vegas. It’s the kind of town where you dig your own grave prior to being shot in the head and left for dead… and that’s before things really get ugly.' },
    'batman-arkham-city': { title: 'Batman: Arkham City', img: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2lbg.jpg', tags: ['Game', 'Action', 'Adventure'], year: '2011', length: '15+ Hours', creator: 'Rocksteady Studios', age: '+16', desc: 'Batman: Arkham City builds upon the intense, atmospheric foundation of Batman: Arkham Asylum, sending players soaring into the expansive Arkham City.' }
};

// --- FEATURED SECTION (index.html) ---
const sliderWrapper = document.getElementById('main-slider-wrapper');
const featuredGrid = document.getElementById('featured-grid-container');

if (sliderWrapper && featuredGrid) {
    const keys = Object.keys(contentDB);
    // Shuffle
    for (let i = keys.length - 1; i > 0; i--) { 
        const j = Math.floor(Math.random() * (i + 1)); 
        [keys[i], keys[j]] = [keys[j], keys[i]]; 
    }
    const items = keys.map(k => ({ id: k, ...contentDB[k] }));
    
    // Top 5 items for the slider
    const sliderItems = items.slice(0, 5);
    sliderWrapper.innerHTML = sliderItems.map(item => `
        <div class="swiper-slide">
            <div class="main-slider-item" style="background-image: url('${item.img}')">
                <div class="slider-content">
                    <h2 class="slider-title">${item.title}</h2>
                    <p class="slider-desc">${item.desc.substring(0, 120)}...</p>
                    <div class="slider-meta">
                        ${item.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                    </div>
                    <div class="mt-4">
                        <a href="detail.html?id=${item.id}" class="btn btn-primary px-4 py-2" style="background: var(--accent); border: none; font-weight: 600;">View Details</a>
                        <button onclick="globalAddToList('${item.id}', this)" class="btn btn-outline-light ms-3 px-4 py-2" style="border-radius: 8px;">+ Add to List</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Search Logic
    const searchInput = document.getElementById('global-search');
    const sliderSection = document.querySelector('.split-hero-container');
    const categoryHeader = document.querySelector('.category-header');

    const newReleasesGrid = document.getElementById('new-releases-container');
    const newReleasesHeader = document.querySelector('.category-section-title i.fa-sparkles')?.closest('.category-section');

    function renderGrid(data, targetGrid = featuredGrid) {
        if (!targetGrid) return;
        if (data.length === 0) {
            targetGrid.innerHTML = `<div class="col-12 text-center py-5"><p class="text-secondary">No results found for your search.</p></div>`;
            return;
        }
        targetGrid.innerHTML = data.map(r => `
            <div onclick="toggleCard(this, '${r.id}')" class="category-card">
                <img src="${r.img}" alt="${r.title}">
                <div class="category-card-body">
                    <div class="category-card-title">${r.title}</div>
                    <div class="category-card-meta">${r.tags[0]} • ${r.creator} • ${r.year}</div>
                </div>
            </div>
        `).join('');
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (query.length > 0) {
                if (sliderSection) sliderSection.style.display = 'none';
                if (newReleasesHeader) newReleasesHeader.style.display = 'none';
                if (categoryHeader) {
                    categoryHeader.querySelector('h3').innerHTML = `<i class="fa-solid fa-magnifying-glass me-2 text-accent"></i>Search Results for "${query}"`;
                    categoryHeader.querySelector('p').style.display = 'none';
                }
                const filtered = items.filter(item => 
                    item.title.toLowerCase().includes(query) || 
                    item.creator.toLowerCase().includes(query) ||
                    item.tags.some(t => t.toLowerCase().includes(query))
                );
                renderGrid(filtered, featuredGrid);
            } else {
                if (sliderSection) sliderSection.style.display = 'block';
                if (newReleasesHeader) newReleasesHeader.style.display = 'block';
                if (categoryHeader) {
                    categoryHeader.querySelector('h3').innerHTML = `<i class="fa-solid fa-fire me-2 text-accent"></i>Trending Now`;
                    categoryHeader.querySelector('p').style.display = 'block';
                }
                renderGrid(items.slice(4, 8), newReleasesGrid);
                renderGrid(items.slice(8), featuredGrid);
            }
        });
    }

    // Initial Render: 4 items for New Releases, rest for Trending
    renderGrid(items.slice(4, 8), newReleasesGrid);
    renderGrid(items.slice(8), featuredGrid);

    // Initialize Swiper
    new Swiper('.main-slider', {
        loop: true,
        autoplay: { delay: 5000, disableOnInteraction: false },
        pagination: { el: '.swiper-pagination', clickable: true },
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        effect: 'fade',
        fadeEffect: { crossFade: true }
    });
}

window.toggleCard = function(element, id) {
    if(event.target.tagName === 'BUTTON' || event.target.closest('.expanded-actions')) return;
    
    const isExpanded = element.classList.contains('expanded');
    
    // Close others
    document.querySelectorAll('.category-card.expanded, .featured-hero.expanded').forEach(el => {
        if(el !== element) {
            el.classList.remove('expanded');
            const content = el.querySelector('.card-expanded-content');
            if(content) content.remove();
        }
    });

    if (isExpanded) {
        element.classList.remove('expanded');
        const content = element.querySelector('.card-expanded-content');
        if(content) content.remove();
    } else {
        element.classList.add('expanded');
        const item = contentDB[id];
        
        const list = JSON.parse(localStorage.getItem('cultify_mylist') || '[]');
        const inList = list.includes(id);
        const btnHtml = inList 
            ? `<button class="card-action-btn card-action-added" onclick="globalAddToList('${id}', this)"><i class="fa-solid fa-check me-2"></i>In List</button>`
            : `<button class="card-action-btn card-action-add" onclick="globalAddToList('${id}', this)"><i class="fa-solid fa-plus me-2"></i>Add to List</button>`;

        const expandedHtml = `
            <div class="card-expanded-content">
                <div class="expanded-desc">${item.desc}</div>
                <div class="meta-row" style="margin: 12px 0;">
                    <div class="meta-item" style="font-size: 0.8rem;"><i class="fa-solid fa-user-shield" style="font-size: 0.9rem;"></i> ${item.age}</div>
                    <div class="meta-item" style="font-size: 0.8rem;"><i class="fa-regular fa-clock" style="font-size: 0.9rem;"></i> ${item.length}</div>
                </div>
                <div class="expanded-actions" style="display:flex; gap:12px; margin-top:16px;">
                    ${btnHtml}
                    <a href="detail.html?id=${id}" class="card-action-btn card-action-details">Details</a>
                </div>
            </div>
        `;
        
        if(element.classList.contains('featured-hero')) {
           element.querySelector('.featured-hero-overlay').insertAdjacentHTML('beforeend', expandedHtml);
        } else {
           element.querySelector('.category-card-body').insertAdjacentHTML('beforeend', expandedHtml);
        }
    }
}

window.toggleMyList = function(event, id, btn) {
    event.stopPropagation();
    event.preventDefault();
    
    if (!isLoggedIn()) {
        alert('Please log in to add items to your list!');
        window.location.href = 'login.html';
        return;
    }

    let list = JSON.parse(localStorage.getItem('cultify_mylist') || '[]');
    if (!list.includes(id)) {
        list.push(id);
        localStorage.setItem('cultify_mylist', JSON.stringify(list));
        btn.innerHTML = '<i class="fa-solid fa-check me-2"></i>In List';
        btn.className = 'card-action-btn card-action-added';
    }
}

// --- REVIEWS SECTION (index.html) ---
const reviewsContainer = document.getElementById('reviews-container');
    const allReviews = [
        { user: 'Bayram Kartal', item: 'The Godfather', stars: 5, text: 'Sinema tarihinin en büyük yapıtlarından biri.' },
        { user: 'Ali Kara', item: 'Vikings', stars: 5, text: 'Ragnar Lothbrok karakteri efsane işlenmiş.' },
        { user: 'Emily Watson', item: 'Harry Potter', stars: 5, text: 'Always brings back magical childhood memories.' },
        { user: 'Michael Schmidt', item: 'Dark', stars: 5, text: 'Die beste deutsche Serie aller Zeiten!' },
        { user: 'Selin Kaya', item: '1984', stars: 5, text: 'Herkesin kütüphanesinde bulunması gereken bir eser.' },
        { user: 'Arda Yılmaz', item: 'Inception', stars: 5, text: 'Rüyalar içinde rüyalar... Muazzam bir kurgu.' }
    ];

if (reviewsContainer) {
    // Shuffle and pick 6
    for (let i = allReviews.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [allReviews[i], allReviews[j]] = [allReviews[j], allReviews[i]]; }
    const picked = allReviews.slice(0, 6);
    reviewsContainer.innerHTML = picked.map(r => {
        const starsHtml = Array(5).fill(0).map((_, i) => `<i class="fa-solid fa-star${i < r.stars ? '' : '" style="opacity:0.3'}"></i>`).join('');
        return `<div class="review-card"><div class="review-header"><div class="review-avatar"><i class="fa-solid fa-user"></i></div><div><div class="review-user">${r.user}</div><div class="review-item-name">${r.item}</div></div></div><div class="review-stars">${starsHtml}</div><div class="review-text">${r.text}</div></div>`;
    }).join('');
}

// --- DETAIL PAGE LOGIC ---
const detailIdParams = new URLSearchParams(window.location.search);
const currentId = detailIdParams.get('id');
const detailTitleEl = document.getElementById('detail-title');
if (detailTitleEl && currentId) {
    const itemData = contentDB[currentId];
    if (itemData) {
        const pageTitle = document.getElementById('page-title');
        if(pageTitle) pageTitle.textContent = `${itemData.title} — Cultify`;
        detailTitleEl.textContent = itemData.title;
        const yearEl = document.getElementById('detail-year');
        if(yearEl) yearEl.textContent = itemData.year;
        const lengthEl = document.getElementById('detail-length');
        if(lengthEl) lengthEl.textContent = itemData.length;
        const creatorEl = document.getElementById('detail-creator');
        if(creatorEl) creatorEl.textContent = itemData.creator;
        const ageEl = document.getElementById('detail-age');
        if(ageEl) ageEl.textContent = itemData.age;
        const descEl = document.getElementById('detail-desc');
        if(descEl) descEl.textContent = itemData.desc;
        const imgEl = document.getElementById('detail-image');
        if (imgEl && itemData.img) imgEl.src = itemData.img;
        const tagsContainer = document.getElementById('detail-tags');
        if (tagsContainer) tagsContainer.innerHTML = itemData.tags.map((tag, i) => `<span class="tag tag-color-${(i % 3) + 1}">${tag}</span>`).join('');
    }
}

// --- ADD TO LIST (localStorage) ---
const addListBtn = document.querySelector('.btn-add-list');
if (addListBtn) {
    // Update button state
    const myList = JSON.parse(localStorage.getItem('cultify_mylist') || '[]');
    if (currentId && myList.includes(currentId)) {
        addListBtn.innerHTML = '<i class="fa-solid fa-check me-2"></i>In List';
        addListBtn.style.backgroundColor = 'var(--accent)';
        addListBtn.style.color = 'var(--bg-primary)';
    }
    addListBtn.addEventListener('click', function() {
        if (!isLoggedIn()) { showLoginModal(); return; }
        const list = JSON.parse(localStorage.getItem('cultify_mylist') || '[]');
        if (currentId && !list.includes(currentId)) {
            list.push(currentId);
            localStorage.setItem('cultify_mylist', JSON.stringify(list));
            this.innerHTML = '<i class="fa-solid fa-check me-2"></i>In List';
            this.style.backgroundColor = 'var(--accent)';
            this.style.color = 'var(--bg-primary)';
        }
    });
}

// --- COMMENT LOGIN CHECK ---
const commentSendBtn = document.querySelector('.comment-send-btn');
if (commentSendBtn) {
    commentSendBtn.addEventListener('click', function() {
        if (!isLoggedIn()) { window.location.href = 'login.html'; return; }
        const input = document.querySelector('.comment-input-wrapper input');
        if (input && input.value.trim()) {
            const commentList = document.querySelector('.content-card:last-child');
            const newComment = document.createElement('div');
            newComment.className = 'comment-item';
            newComment.innerHTML = `<div class="comment-avatar"><i class="fa-solid fa-user"></i></div><div><div class="comment-username">Elif Çiçek</div><div class="comment-text">${input.value}</div></div>`;
            commentList.appendChild(newComment);
            input.value = '';
        }
    });
}

// --- STAR RATING ---
const stars = document.querySelectorAll('.star-rating i');
if (stars.length > 0) {
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            if (!isLoggedIn()) { showLoginModal(); return; }
            stars.forEach((s, i) => { if (i <= index) s.classList.add('active'); else s.classList.remove('active'); });
        });
        star.addEventListener('mouseenter', () => {
            stars.forEach((s, i) => { s.style.color = i <= index ? '#fbbf24' : ''; });
        });
    });
    const ratingContainer = document.querySelector('.star-rating');
    if (ratingContainer) ratingContainer.addEventListener('mouseleave', () => { stars.forEach(s => { s.style.color = ''; }); });
}

// --- MY LIST PAGE ---
const mylistGrid = document.getElementById('mylist-grid');
if (mylistGrid) {
    const list = JSON.parse(localStorage.getItem('cultify_mylist') || '[]');
    const emptyEl = document.getElementById('mylist-empty');
    if (list.length === 0) {
        if (emptyEl) emptyEl.style.display = '';
        mylistGrid.style.display = 'none';
    } else {
        if (emptyEl) emptyEl.style.display = 'none';
        mylistGrid.innerHTML = list.map(id => {
            const item = contentDB[id];
            if (!item) return '';
            return `<div class="mylist-card" data-id="${id}"><button class="mylist-remove-btn" onclick="removeFromList(event, '${id}')"><i class="fa-solid fa-xmark"></i></button><a href="detail.html?id=${id}" class="text-decoration-none"><img src="${item.img}" alt="${item.title}"><div class="mylist-card-body"><div class="mylist-card-title">${item.title}</div><div class="mylist-card-meta">${item.tags[0]} • ${item.creator} • ${item.year}</div></div></a></div>`;
        }).join('');
    }
}
window.removeFromList = function(event, id) {
    event.stopPropagation();
    event.preventDefault();
    let list = JSON.parse(localStorage.getItem('cultify_mylist') || '[]');
    list = list.filter(x => x !== id);
    localStorage.setItem('cultify_mylist', JSON.stringify(list));
    location.reload();
};

// --- LOGIN FORM ---
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const pass = document.getElementById('password').value;

        if (email === 'admin@cult.com' && pass === 'admin123') {
            setLoggedIn(true, 'Elif Çiçek', 'admin');
            alert('Login successful! Welcome back, Elif.');
            window.location.href = 'index.html';
        } else if (email === 'user@cult.com' && pass === 'user123') {
            setLoggedIn(true, 'Bayram Kartal', 'user');
            alert('Login successful! Welcome, Bayram.');
            window.location.href = 'index.html';
        } else {
            alert('Invalid credentials! Please check your email and password.');
        }
    });
}

// --- REGISTER FORM ---
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Registration successful! Redirecting to login page.');
        window.location.href = 'login.html';
    });
}

// --- PROFILE PICTURE EDIT ---
const editBtn = document.querySelector('.profile-edit-button');
const ppInput = document.querySelector('#pp-input');
const avatarCircle = document.querySelector('.profile-avatar-circle');
if (editBtn && ppInput && avatarCircle) {
    editBtn.addEventListener('click', (e) => { e.preventDefault(); ppInput.click(); });
    ppInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) { avatarCircle.innerHTML = `<img src="${e.target.result}" alt="PP" class="uploaded-pp">`; };
            reader.readAsDataURL(file);
        }
    });
}

// --- ACCOUNT DELETE ---
const deleteBtn = document.getElementById('delete-account');
if (deleteBtn) { deleteBtn.addEventListener('click', function(e) { e.preventDefault(); if (confirm('Are you sure you want to delete your account?')) alert('Your account has been deleted.'); }); }

// --- ACCOUNT UPDATE ---
const updateBtn = document.getElementById('update-account');
if (updateBtn) { updateBtn.addEventListener('click', function(e) { e.preventDefault(); alert('Your account has been updated.'); }); }

// --- AVATAR SELECTION ---
const avatarOptions = document.querySelectorAll('.avatar-option');
if (avatarOptions.length > 0) { avatarOptions.forEach(o => { o.addEventListener('click', () => { avatarOptions.forEach(x => x.classList.remove('selected')); o.classList.add('selected'); }); }); }

// --- FILTER TABS ---
const filterTabs = document.querySelectorAll('.filter-tab');
if (filterTabs.length > 0) { filterTabs.forEach(tab => { tab.addEventListener('click', () => { filterTabs.forEach(t => t.classList.remove('active')); tab.classList.add('active'); }); }); }

// --- CATEGORY PAGE ---
const urlParams = new URLSearchParams(window.location.search);
const categoryType = urlParams.get('type');
const categoryNameEl = document.getElementById('category-name');
const categoryIconEl = document.getElementById('category-icon');
if (categoryNameEl && categoryType) {
    const categoryConfig = { games: { name: 'Games', icon: 'fa-gamepad' }, movies: { name: 'Movies & Series', icon: 'fa-film' }, books: { name: 'Books', icon: 'fa-book' } };
    const config = categoryConfig[categoryType];
    if (config) {
        categoryNameEl.textContent = config.name;
        if (categoryIconEl) categoryIconEl.className = `fa-solid ${config.icon} me-2 text-accent`;
        document.title = `${config.name} — Cultify`;
    }
    const allGrids = document.querySelectorAll('[id^="grid-"]');
    allGrids.forEach(grid => { grid.style.display = 'none'; });
    const activeGrid = document.getElementById(`grid-${categoryType}`);
    if (activeGrid) activeGrid.style.display = '';
}

// --- NAV ACTIVE STATE ---
const currentPage = window.location.pathname.split('/').pop();
const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) link.classList.add('active');
    else if (href && href.includes('category.html') && currentPage === 'category.html') {
        const linkType = new URL(link.href, window.location.origin).searchParams.get('type');
        if (linkType === categoryType) link.classList.add('active'); else link.classList.remove('active');
    } else link.classList.remove('active');
});

// --- SWIPER ---
const bookSwiperEl = document.querySelector(".bookSwiper");
if (bookSwiperEl) { new Swiper(".bookSwiper", { slidesPerView: 1, spaceBetween: 20, loop: false, grabCursor: true, pagination: { el: ".swiper-pagination", clickable: true, dynamicBullets: true }, navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }, breakpoints: { 576: { slidesPerView: 2 }, 768: { slidesPerView: 3 }, 1024: { slidesPerView: 4 } } }); }
const profileSwiperEl = document.querySelector(".profileSwiper");
if (profileSwiperEl) { new Swiper(".profileSwiper", { slidesPerView: 2, spaceBetween: 15, grabCursor: true, breakpoints: { 768: { slidesPerView: 4, spaceBetween: 20 } } }); }

// --- STARS BACKGROUND ---
function createStars() {
    const starsContainer = document.createElement('div');
    starsContainer.id = 'stars-bg-container';
    
    // Add 3 layers of stars
    for (let i = 1; i <= 3; i++) {
        const layer = document.createElement('div');
        layer.className = `star-layer star-layer-${i}`;
        
        let boxShadows = [];
        const numStars = i === 1 ? 150 : (i === 2 ? 75 : 30); // More small stars, fewer big stars
        for (let j = 0; j < numStars; j++) {
            const x = Math.floor(Math.random() * 100);
            const y = Math.floor(Math.random() * 100);
            boxShadows.push(`${x}vw ${y}vh #fff`);
        }
        
        layer.style.boxShadow = boxShadows.join(', ');
        
        // Duplicate layer for seamless scrolling animation
        const layerAfter = document.createElement('div');
        layerAfter.className = `star-layer star-layer-${i} after`;
        layerAfter.style.boxShadow = boxShadows.join(', ');
        
        starsContainer.appendChild(layer);
        starsContainer.appendChild(layerAfter);
    }
    
    // Insert behind everything
    document.body.prepend(starsContainer);
}
// Run on load
document.addEventListener('DOMContentLoaded', createStars);