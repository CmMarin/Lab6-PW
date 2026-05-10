export default async function (fastify, opts) {
  fastify.post('/token', {
    schema: {
      tags: ['auth'],
      summary: 'Generate an access token',
      body: {
        type: 'object',
        properties: {
          role: { type: 'string', enum: ['ADMIN', 'WRITER', 'VISITOR'] },
          permissions: { type: 'array', items: { type: 'string' } }
        },
        anyOf: [
          { required: ['role'] },
          { required: ['permissions'] }
        ]
      },
      response: {
        200: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            expiresIn: { type: 'string' }
          }
        },
        400: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { role } = request.body;
    
    if (!['ADMIN', 'WRITER', 'VISITOR'].includes(role)) {
      return reply.code(400).send({ error: 'Invalid role. Must be ADMIN, WRITER, or VISITOR' });
    }

    let permissions = [];
    if (role === 'ADMIN') {
      permissions = ['READ', 'WRITE', 'DELETE'];
    } else if (role === 'WRITER') {
      permissions = ['READ', 'WRITE'];
    } else if (role === 'VISITOR') {
      permissions = ['READ'];
    }

    const payload = {
      role,
      permissions
    };

    const token = fastify.jwt.sign(payload, { expiresIn: '1m' });

    return reply.send({
      token,
      expiresIn: '1m'
    });
  });
}