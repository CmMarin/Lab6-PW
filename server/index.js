import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import swaggerConfig from './swagger.js';

import dbPlugin from './plugins/db.js';
import jwtPlugin from './plugins/jwt.js';
import authRoutes from './routes/auth.js';
import gamesRoutes from './routes/games.js';

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../server.env.example') });

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const fastify = Fastify({ logger: true });

const start = async () => {
  try {
    await fastify.register(cors, { origin: '*' });
    await fastify.register(fastifySwagger, swaggerConfig);
    await fastify.register(fastifySwaggerUi, {
      routePrefix: '/docs',
      uiConfig: {
        docExpansion: 'full',
        deepLinking: false
      }
    });

    await fastify.register(dbPlugin);
    await fastify.register(jwtPlugin);

    // Initialize Schema
    const initSql = fs.readFileSync(path.join(__dirname, 'db', 'schema.sql'), 'utf-8');
    fastify.db.exec(initSql);

    await fastify.register(authRoutes, { prefix: '/' });
    await fastify.register(gamesRoutes, { prefix: '/games' });

    const port = process.env.PORT || 3000;
    await fastify.listen({ port, host: '0.0.0.0' });

    fastify.log.info(`Swagger UI running at http://localhost:${port}/docs`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
