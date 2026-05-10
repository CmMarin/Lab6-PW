export default async function (fastify, opts) {

  // Default game schema for responses and parameters
  const gameSchema = {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      title: { type: 'string' },
      genre: { type: 'string' },
      minPlayers: { type: 'integer' },
      maxPlayers: { type: 'integer' },
      playTime: { type: 'integer' },
      difficulty: { type: 'string' },
      description: { type: 'string' },
      imageUrl: { type: 'string' },
      isFavorite: { type: 'integer' }
    }
  };

  // GET /games
  fastify.get('/', {
    preHandler: [fastify.authenticate, fastify.requirePermission('READ')],
    schema: {
      tags: ['games'],
      summary: 'Get paginated list of games',
      security: [{ BearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', default: 1 },
          limit: { type: 'integer', default: 10, maximum: 100 }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            data: { type: 'array', items: gameSchema },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'integer' },
                limit: { type: 'integer' },
                total: { type: 'integer' },
                totalPages: { type: 'integer' }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { page, limit } = request.query;
    const offset = (page - 1) * limit;

    const rowTotal = fastify.db.prepare('SELECT COUNT(*) as count FROM games').get();
    const rows = fastify.db.prepare('SELECT * FROM games LIMIT ? OFFSET ?').all(limit, offset);

    return reply.send({
      data: rows,
      pagination: {
        page,
        limit,
        total: rowTotal.count,
        totalPages: Math.ceil(rowTotal.count / limit)
      }
    });
  });

  // GET /games/:id
  fastify.get('/:id', {
    preHandler: [fastify.authenticate, fastify.requirePermission('READ')],
    schema: {
      tags: ['games'],
      summary: 'Get a single game by ID',
      security: [{ BearerAuth: [] }],
      params: { type: 'object', properties: { id: { type: 'integer' } } },
      response: {
        200: gameSchema,
        404: { type: 'object', properties: { error: { type: 'string' } } }
      }
    }
  }, async (request, reply) => {
    const game = fastify.db.prepare('SELECT * FROM games WHERE id = ?').get(request.params.id);
    if (!game) return reply.code(404).send({ error: 'Game not found' });
    return reply.send(game);
  });

  // POST /games
  fastify.post('/', {
    preHandler: [fastify.authenticate, fastify.requirePermission('WRITE')],
    schema: {
      tags: ['games'],
      summary: 'Create a new game',
      security: [{ BearerAuth: [] }],
      body: gameSchema,
      response: {
        201: gameSchema,
        400: { type: 'object', properties: { error: { type: 'string' } } }
      }
    }
  }, async (request, reply) => {
    const b = request.body;
    if (!b.title) return reply.code(400).send({ error: 'title is required' });

    const stmt = fastify.db.prepare(`
      INSERT INTO games (title, genre, minPlayers, maxPlayers, playTime, difficulty, description, imageUrl, isFavorite)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const info = stmt.run(
      b.title, b.genre || '', b.minPlayers || 1, b.maxPlayers || 1,
      b.playTime || 0, b.difficulty || 'Easy', b.description || '', b.imageUrl || '',
      b.isFavorite ? 1 : 0
    );

    const created = fastify.db.prepare('SELECT * FROM games WHERE id = ?').get(info.lastInsertRowid);
    return reply.code(201).send(created);
  });

  // PUT /games/:id
  fastify.put('/:id', {
    preHandler: [fastify.authenticate, fastify.requirePermission('WRITE')],
    schema: {
      tags: ['games'],
      summary: 'Update an existing game',
      security: [{ BearerAuth: [] }],
      params: { type: 'object', properties: { id: { type: 'integer' } } },
      body: gameSchema,
      response: {
        200: gameSchema,
        404: { type: 'object', properties: { error: { type: 'string' } } }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params;
    const b = request.body;

    const game = fastify.db.prepare('SELECT * FROM games WHERE id = ?').get(id);
    if (!game) return reply.code(404).send({ error: 'Game not found' });

    const stmt = fastify.db.prepare(`
      UPDATE games SET title=?, genre=?, minPlayers=?, maxPlayers=?, playTime=?, difficulty=?, description=?, imageUrl=?, isFavorite=? WHERE id=?
    `);

    stmt.run(
      b.title || game.title, b.genre || game.genre, b.minPlayers || game.minPlayers, 
      b.maxPlayers || game.maxPlayers, b.playTime || game.playTime, b.difficulty || game.difficulty, 
      b.description || game.description, b.imageUrl || game.imageUrl, 
      b.isFavorite !== undefined ? (b.isFavorite ? 1 : 0) : game.isFavorite,
      id
    );

    const updated = fastify.db.prepare('SELECT * FROM games WHERE id = ?').get(id);
    return reply.code(200).send(updated);
  });

  // DELETE /games/:id
  fastify.delete('/:id', {
    preHandler: [fastify.authenticate, fastify.requirePermission('DELETE')],
    schema: {
      tags: ['games'],
      summary: 'Delete a game',
      security: [{ BearerAuth: [] }],
      params: { type: 'object', properties: { id: { type: 'integer' } } },
      response: {
        204: { type: 'null' },
        404: { type: 'object', properties: { error: { type: 'string' } } }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params;
    const info = fastify.db.prepare('DELETE FROM games WHERE id = ?').run(id);

    if (info.changes === 0) return reply.code(404).send({ error: 'Game not found' });
    return reply.code(204).send();
  });
}