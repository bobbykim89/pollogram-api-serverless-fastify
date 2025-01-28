import fastify, { type FastifyReply } from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import awsLambdaHandler from '@fastify/aws-lambda'
import fastifyMultipart from '@fastify/multipart'
import fastifyAuth from '@fastify/auth'
import { userModule } from './users/users.module'
import { authModule } from './auth/auth.module'
import { profileModule } from './profile/profile.module'
import { postModule } from './posts/posts.module'
import { commentModule } from './comments/comments.module'

const NODE_ENV = process.env.NODE_ENV

const init = () => {
  const app = fastify({
    logger: true,
  })

  app
    .setValidatorCompiler(validatorCompiler)
    .setSerializerCompiler(serializerCompiler)
    .get('/', (req, res: FastifyReply) => {
      res.send({
        message: 'Hello world from Pollito!',
      })
    })
    .register(fastifyMultipart, {
      limits: {
        fileSize: 1024 * 1024 * 10,
        files: 1,
      },
      attachFieldsToBody: true,
    })
    .register(fastifyAuth, { defaultRelation: 'and' })
    .register(userModule.setRoute, { prefix: '/api/user' })
    .register(authModule.setRoute, { prefix: '/api/auth' })
    .register(profileModule.setRoute, { prefix: '/api/profile' })
    .register(postModule.setRoute, { prefix: '/api/post' })
    .register(commentModule.setRoute, { prefix: '/api/comment' })

  return app
}

if (NODE_ENV !== 'production') {
  init().listen({ host: 'localhost', port: 3000 }, (err, address) => {
    if (err) {
      init().log.error(err)
      process.exit(1)
    }
    console.log(`Server is now listening on ${address}`)
  })
}

export const handler = awsLambdaHandler(init())
