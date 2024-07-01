import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from './modules/user/user.module'
import { VerifyModule } from './modules/verify/verify.module'
import { RolesGuard } from 'src/common/guards/role.guard'
import { APP_GUARD } from '@nestjs/core'
import { AuthModule } from './modules/auth/auth.module'
import { AuthGuard } from './common'
import { RoleModule } from './modules/role/role.module'
import { MenuModule } from './modules/menu/menu.module'
import { DataSource } from 'typeorm'
import { UploadModule } from './modules/upload/upload.module'
import { DownloadModule } from './modules/download/download.module'
import { UserEntity } from './modules/user/entities/user.entity'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return {
          type: 'mysql',
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          username: process.env.DB_USER,
          password: process.env.DB_PASS,
          database: process.env.DB_DATABASE,
          synchronize: Boolean(process.env.DB_SYNC),
          autoLoadEntities: true
        }
      },
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize()
        return dataSource
      }
    }),
    // RolesGuard 使用到了UserEntity，所以需要在这里注册
    TypeOrmModule.forFeature([UserEntity]),
    VerifyModule,
    UserModule,
    AuthModule,
    RoleModule,
    MenuModule,
    UploadModule,
    DownloadModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ]
})
export class AppModule {}
