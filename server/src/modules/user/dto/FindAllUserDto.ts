import { IsOptional, IsString, IsNumber, IsDate } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class FindAllUserDto {
  @ApiProperty({ example: '', description: '用户名', required: false })
  @IsString({ message: 'username必须是字符串' })
  @IsOptional()
  username?: string

  @ApiProperty({ example: '', description: '邮箱', required: false })
  @IsString({ message: 'email必须是字符串' })
  @IsOptional()
  email?: string

  @ApiProperty({ example: '', description: '开始日期', required: false })
  @IsDate({ message: '开始日期格式不对' })
  @IsOptional()
  startTime?: Date

  @ApiProperty({ example: '', description: '结束日期', required: false })
  @IsDate({ message: '结束日期格式不对' })
  @IsOptional()
  endTime?: Date

  @ApiProperty({ example: 1, description: '当前页', required: false })
  @IsNumber({}, { message: 'pageNumber必须是数字类型' })
  @IsOptional()
  pageNumber?: number

  @ApiProperty({ example: 10, description: '条数', required: false })
  @IsNumber({}, { message: 'pageSize必须是数字类型' })
  @IsOptional()
  pageSize?: number
}
