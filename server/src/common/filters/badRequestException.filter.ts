import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common'
import { Response } from 'express'

@Catch()
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    // nestjs内置的异常类
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse() as any
      const status = exception.getStatus()
      if (typeof exceptionResponse === 'string') {
        return response.status(status).json({
          code: status,
          message: exceptionResponse
        })
      }

      if (status === 403) {
        return response.status(status).json({
          code: status,
          message: '没有访问权限'
        })
      }

      // 将 message 数组连接成字符串
      const message = Array.isArray(exceptionResponse.message)
        ? exceptionResponse.message.join(', ')
        : exceptionResponse.message

      return response.status(status).json({
        code: status,
        message
      })
    }
    // 其它异常
    response.status(500).json({
      code: 500,
      message: exception.message
    })
  }
}
