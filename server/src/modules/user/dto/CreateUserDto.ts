import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsEnum, IsEmail, IsString, IsDate } from 'class-validator'
import { USER_SEX_ENUM } from 'src/common/constants/user.constant'

export class CreateUserDto {
  @ApiProperty({ example: 'xxx@qq.com', description: '用户邮箱' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'newUser1', description: '用户名' })
  @IsString()
  username: string

  @ApiProperty({ example: 'zx13579', description: '密码' })
  @IsString()
  password: string

  @ApiProperty({ example: '新用户', description: '昵称', required: false })
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

  @ApiProperty({ example: 'hellomrtree', description: '用户头像', required: false })
  @IsOptional()
  avatar?: string

  @ApiProperty({
    example: '会当凌绝顶，一览众山小！',
    description: '用户签名',
    required: false
  })
  @IsOptional()
  sign?: string
}
