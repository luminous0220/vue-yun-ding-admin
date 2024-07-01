import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateRoleDto {
  @ApiProperty({ example: 'admin', description: '角色名称' })
  @IsString({ message: 'flag字段必须为字符串' })
  @IsNotEmpty({ message: 'flag字段不能为空' })
  flag: string

  @ApiProperty({ example: '普通管理员', description: '角色名称' })
  @IsString({ message: 'name字段必须为字符串' })
  @IsNotEmpty({ message: 'name字段不能为空' })
  name: string

  @ApiProperty({ example: '管理员', description: '角色描述' })
  @IsString({ message: 'desc字段必须为字符串' })
  @IsOptional()
  desc: string
}
