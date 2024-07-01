import { IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class FindAllRoleDto {
  @ApiProperty({ example: 'admin', description: '角色名称', required: false })
  @IsString({ message: 'name字段必须是string类型' })
  @IsOptional()
  name?: string

  @ApiProperty({ example: '管理员', description: '角色描述', required: false })
  @IsString({ message: 'desc字段必须是string类型' })
  @IsOptional()
  desc?: string
}
