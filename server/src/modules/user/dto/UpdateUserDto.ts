import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsEnum, IsDate } from 'class-validator'
import { USER_SEX_ENUM } from 'src/common/constants/user.constant'

export class UpdateUserDto {
  @ApiProperty({ example: 'helloworld', description: '用户名称', required: false })
  @IsOptional()
  nickname?: string

  @ApiProperty({ example: USER_SEX_ENUM.MAN, description: '用户性别', required: false })
  @IsEnum(USER_SEX_ENUM)
  @IsOptional()
  sex?: USER_SEX_ENUM

  @ApiProperty({ example: '2000-01-01', description: '生日', required: false })
  @IsDate()
  @IsOptional()
  birthday?: Date

  @ApiProperty({
    example: '会当凌绝顶，一览众山小！',
    description: '用户签名',
    required: false
  })
  @IsOptional()
  sign?: string

  @ApiProperty({
    example: 12,
    description: '年龄',
    required: false
  })
  @IsOptional()
  age?: number

  @ApiProperty({
    example: '19827653372',
    description: '手机',
    required: false
  })
  @IsOptional()
  phone?: string
}
