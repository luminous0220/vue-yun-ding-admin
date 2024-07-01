import { IsArray, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class DeleteUserDto {
  @ApiProperty({ example: [1], description: '角色id' })
  @IsNumber({}, { message: 'ids 数组类型必须是number类型', each: true })
  @IsArray({ message: 'ids 必须是数组' })
  ids: number[]
}
