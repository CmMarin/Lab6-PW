import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';

export default fp(async (fastify, opts) => {
  fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'lab7-secret-key'
  });

  fastify.decorate('authenticate', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  fastify.decorate('requirePermission', (permission) => {
    return async (request, reply) => {
      const user = request.user;
      if (!user) {
        return reply.code(401).send({ error: 'Unauthorized' });
      }

      if (user.role === 'ADMIN') {
        return; // Allow ADMIN all access
      }

      if (user.permissions && user.permissions.includes(permission)) {
        return; // Allow if exact permission matched
      }

      return reply.code(403).send({ error: `Forbidden. Missing permission: ${permission}` });
    };
  });
});