import fastify, { type FastifyReply } from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
} from 'fastify-type-provider-zod'
import awsLambdaHandler from '@fastify/aws-lambda'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastifyMultipart from '@fastify/multipart'
import fastifyAuth from '@fastify/auth'
import { userModule } from './users/users.module'
import { authModule } from './auth/auth.module'
import { profileModule } from './profile/profile.module'
import { postModule } from './posts/posts.module'
import { commentModule } from './comments/comments.module'

const STAGE = process.env.STAGE
const NODE_ENV = process.env.NODE_ENV

const app = fastify({
  logger: true,
})

app
  .setValidatorCompiler(validatorCompiler)
  .setSerializerCompiler(serializerCompiler)
  .get('/', (req, res: FastifyReply) => {
    res.send({
      message: 'Hello world with pollito!',
      node_env: NODE_ENV,
      stage: STAGE,
    })
  })
  .register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Pollogram API (Fastify)',
        description: 'Pollogram API backend built on Fastify',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'Bearer ',
          },
          // apiKey: {
          //   name: 'authorization',
          //   type: 'http',
          //   in: 'header',
          // },
        },
      },
      tags: [
        { name: 'Users', description: 'User route' },
        { name: 'Auth', description: 'Auth route' },
        { name: 'Profiles', description: 'Profiles route' },
        { name: 'Posts', description: 'Posts route' },
        { name: 'Comments', description: 'Comments route' },
      ],
    },
    transform: jsonSchemaTransform,
  })
  .register(fastifySwaggerUi, {
    routePrefix: '/doc',
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, req, res) => {
      return swaggerObject
    },
    transformSpecificationClone: true,
  })
  .register(fastifyMultipart, {
    limits: {
      fileSize: 1024 * 1024 * 10,
      files: 1,
    },
    attachFieldsToBody: true,
  })
  .register(fastifyAuth, { defaultRelation: 'and' })
  .register(userModule.setRoute, { prefix: 'api/user' })
  .register(authModule.setRoute, { prefix: 'api/auth' })
  .register(profileModule.setRoute, { prefix: 'api/profile' })
  .register(postModule.setRoute, { prefix: '/api/post' })
  .register(commentModule.setRoute, { prefix: '/api/comment' })

if (NODE_ENV !== 'production') {
  app.listen({ host: 'localhost', port: 3000 }, (err, address) => {
    if (err) {
      app.log.error(err)
      process.exit(1)
    }
    console.log(`Server is now listening on ${address}`)
  })
}

export const handler = awsLambdaHandler(app)
