import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNumber } from 'class-validator'
import { USER_STATUS_ENUM } from 'src/common/constants/user.constant'

export class UpdateUserStatusDto {
  @ApiProperty({ description: '用户id', required: true })
  @IsNumber()
  id: number

  @ApiProperty({ description: '状态（1正常、2锁定）', required: true })
  @IsEnum([1, 2], { message: 'status的值只能是1、2' })
  status: USER_STATUS_ENUM
}
