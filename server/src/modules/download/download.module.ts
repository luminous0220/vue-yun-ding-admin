import { Module } from '@nestjs/common'
import { DownloadController } from './download.controller'
import { UserModule } from '../user/user.module'
import { RoleModule } from '../role/role.module'

@Module({
  imports: [UserModule, RoleModule],
  controllers: [DownloadController]
})
export class DownloadModule {}
