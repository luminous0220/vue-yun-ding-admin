import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

const swaggerOptions = new DocumentBuilder()
  .setTitle('标题')
  .setDescription('文档描述')
  .setVersion('1.0.0')
  .addBearerAuth()
  .build()

export function createSwagger(app) {
  const document = SwaggerModule.createDocument(app, swaggerOptions)
  SwaggerModule.setup(process.env.SWAGGERPREFIX, app, document)
}
