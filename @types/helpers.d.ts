import winston from 'winston'
import { Request } from 'express'

export interface LoggedRequest extends Request {
  logger: winston.Logger
  uid: string
}
