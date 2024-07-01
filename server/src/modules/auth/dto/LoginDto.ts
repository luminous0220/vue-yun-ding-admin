import { IsNotEmpty, IsEmail, Length, ValidateIf } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
  @IsEmail({}, { message: '请填写正确格式的邮箱！' })
  @ValidateIf((o) => !o.username)
  email: string

  @ApiProperty({
    example: 'admin',
    description: '用户名'
  })
  @Length(5, 32, { message: '用户名长度为5-32位' })
  @IsNotEmpty({ message: '用户名不能为空！' })
  @ValidateIf((o) => !o.email)
  username: string

  @ApiProperty({ example: 'admin123', description: '用户密码' })
  @IsNotEmpty({ message: '用户密码不能为空' })
  password: string
}
