import { nanoid } from 'nanoid'
import winston from 'winston'
import { TransformableInfo } from 'logform' // Types for Winston
import { LoggedRequest } from '../@types/helpers'
import { NextApiResponse } from 'next'

export const printFunc = (info: TransformableInfo) => {
  return `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
}

export const winstonLogger = (file: string) => {
  return winston.createLogger({
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.label({
        label: file
      }),
      winston.format.colorize(),
      winston.format.printf(printFunc)
    ),
    transports: [new winston.transports.Console()]
  })
}

export default (req: LoggedRequest, res: NextApiResponse, next: () => void) => {
  const uid = nanoid()
  req.logger = winstonLogger(__filename)
  req.uid = uid
  res.setHeader('c0d3-debug-id', uid)
  next()
}
