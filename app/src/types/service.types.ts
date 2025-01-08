// export interface ServiceResponse<T> {
//   statusCode: number
//   error?: string
//   data?: T
// }

interface ServiceResponseStatus {
  statusCode: number
}

interface ServiceResponseSuccess<T> extends ServiceResponseStatus {
  error?: undefined
  data: T
}
interface ServiceResponseError extends ServiceResponseStatus {
  error: string
  data?: undefined
}

export type ServiceResponse<T> =
  | ServiceResponseSuccess<T>
  | ServiceResponseError
