import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { type Response } from 'express'

interface IRes<T> {
  statusCode: number
  message: string
  data: T
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, IRes<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<IRes<T>> {
    const ctx = context.switchToHttp()
    const res = ctx.getResponse<Response>()
    // 将 2xx 状态码修改为 200
    res.status(200)
    const header = res.getHeader('Content-Type') as string
    return next.handle().pipe(
      map((data) => {
        // 如果响应的内容类型是 'text/html'，则直接返回原始数据
        if (header && header.includes('text/html')) {
          return data
        }
        return {
          code: res.statusCode,
          message: '请求成功',
          data
        }
      })
    )
  }
}
