import Dexie from 'dexie';

// Database utama aplikasi, versi 1
const db = new Dexie('PokedexAI');

db.version(1).stores({
  // id auto-increment, index name dan createdAt
  teams: '++id, name, createdAt',
});

export default db;
