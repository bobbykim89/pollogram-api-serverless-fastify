import { type FastifyReply } from 'fastify'
import { ServiceResponse } from '../types/service.types'

type ServerResponseType<T> = {
  statusCode: number
  error?: string
  data?: T
}

export class UseRes {
  public sendDataOrError = <T>(
    res: FastifyReply,
    sr: ServerResponseType<T>
  ) => {
    const { statusCode, data, error } = sr
    if (error) {
      res.code(statusCode).send({
        message: error,
      })
      return
    }
    res.code(statusCode).send(data)
  }
}
