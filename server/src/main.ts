import Dotenv from 'dotenv'
Dotenv.config({ path: '.env' }) // 加载环境变量并注入到process.env当中
import { NestFactory } from '@nestjs/core'
import { Logger, ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'node:path'
import { createSwagger } from './common/swagger'
import { AppModule } from './app.module'
import { BadRequestExceptionFilter, TransformInterceptor } from 'src/common'
import hbs from 'hbs'
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.enableCors()
  app.setGlobalPrefix(process.env.APIPREFIX) // 设置全局路由前缀
  app.useGlobalInterceptors(new TransformInterceptor())
  app.useGlobalFilters(new BadRequestExceptionFilter())
  app.useStaticAssets(join(__dirname, '../', 'public'))
  app.setBaseViewsDir(join(__dirname, '../', 'views'))
  app.setViewEngine('html')
  app.engine('html', hbs.__express)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        // 开启class-transformer的隐式类型强制转换
        enableImplicitConversion: true
      }
    })
  )
  createSwagger(app)
  await app.listen(process.env.PORT, () => {
    Logger.log(
      `服务已经启动,接口请访问: http://localhost:${process.env.PORT}${process.env.APIPREFIX}`
    )
    Logger.log(
      `swagger文档已经就绪,文档地址请访问: http://localhost:${process.env.PORT}${process.env.SWAGGERPREFIX}`
    )
  })
}
bootstrap()
