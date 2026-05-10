import fp from 'fastify-plugin';
import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default fp(async (fastify, opts) => {
  const dbDir = path.join(__dirname, '../db');
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
  
  const db = new DatabaseSync(path.join(dbDir, 'games.db'));
  
  fastify.decorate('db', db);

  fastify.addHook('onClose', (fastifyInstance, done) => {
    fastifyInstance.db.close();
    done();
  });
});
