import { IsArray, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class AssignRoleDto {
  @ApiProperty({ example: [1], description: '角色id' })
  @IsNumber({}, { message: 'roleIds 数组类型必须是number类型', each: true })
  @IsArray({ message: 'roleIds 必须是数组' })
  roleIds: number[]
}
