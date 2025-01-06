import fastify, { type FastifyReply } from 'fastify'
import awsLambdaHandler from '@fastify/aws-lambda'
import { userController } from './users/users.module'

const STAGE = process.env.STAGE
const NODE_ENV = process.env.NODE_ENV

const app = fastify({
  logger: true,
})

app
  .get('/', (req, res: FastifyReply) => {
    res.send({
      message: 'Hello world with pollito!',
      node_env: NODE_ENV,
      stage: STAGE,
    })
  })
  .get('/hello', (req, res: FastifyReply) => {
    res.send({ message: 'Pollito says hello! PIO!' })
  })
  .get('/goodbye', (req, res: FastifyReply) => {
    res.send({ message: 'Good bye pollito, see you tomorrow!' })
  })
  .register(userController.setUserRoute, { prefix: 'api/user' })

if (NODE_ENV !== 'production') {
  app.listen({ port: 3000 }, (err, address) => {
    if (err) {
      app.log.error(err)
      process.exit(1)
    }
    console.log(`Server is now listening on ${address}`)
  })
}

export const handler = awsLambdaHandler(app)
