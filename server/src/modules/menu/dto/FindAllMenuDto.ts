import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export class FindAllMenuDto {
  @ApiProperty({ example: '角色管理', description: '菜单名称', required: false })
  @IsOptional()
  title?: string
}
