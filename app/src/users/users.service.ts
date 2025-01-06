import type { FastifyRequest, FastifyReply } from 'fastify'
import { polloSchema, type PolloSchemaType } from './dto'

export class UserService {
  constructor() {}

  public getPollitoPollito = async (req: FastifyRequest, res: FastifyReply) => {
    res.code(200).send({ message: 'Pollito pollito' })
  }

  public getPolloId = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    res: FastifyReply
  ) => {
    const { id } = req.params
    res.code(200).send({
      message: `id is ${id}`,
    })
  }
  public postPollitoInfo = async (
    req: FastifyRequest<{ Params: { id: string }; Body: PolloSchemaType }>,
    res: FastifyReply
  ) => {
    const { id } = req.params
    const { name, age } = polloSchema.parse(req.body)
    res.send({
      message: `Name is ${name} and ${age} years old`,
      id,
    })
  }
}
