import { IsArray, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class AssignDto {
  @ApiProperty({ example: [1, 2], description: '菜单id数组' })
  @IsNumber({}, { message: 'menus数组类型必须是number类型', each: true })
  @IsArray({ message: 'menus必须是数组' })
  menus: number[]
}
