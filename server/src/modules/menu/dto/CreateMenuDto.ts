import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { MENU_TYPE_ENUM } from 'src/common/constants/menu.constant'

export class CreateMenuDto {
  @ApiProperty({ example: '首页', description: '菜单标题' })
  @IsString({ message: 'title必须是string类型' })
  @IsNotEmpty()
  title: string

  @ApiProperty({ example: '/home', description: '菜单路径' })
  @IsString({ message: 'path必须是string类型' })
  @IsOptional()
  path?: string

  @ApiProperty({ example: 'Home', description: '组件名称' })
  @IsString({ message: 'name必须是string类型' })
  @IsOptional()
  name?: string

  @ApiProperty({ example: '/Home/Home', description: '前端组件路径' })
  @IsString({ message: 'component必须是string类型' })
  @IsOptional()
  componentPath?: string

  @ApiProperty({ example: null, description: '上级菜单' })
  @IsNumber({}, { message: 'parentId必须是number类型' })
  @IsOptional()
  parentId?: number | null

  @ApiProperty({ example: 0, description: '前端组件路径' })
  @IsNumber({}, { message: 'sort必须是number类型' })
  @IsOptional()
  sort: number

  @ApiProperty({ example: '', description: '按钮授权标识' })
  @IsString({ message: 'permission必须是string类型' })
  @IsOptional()
  permission: string

  @ApiProperty({ example: 0, description: '菜单类型' })
  @IsEnum(MENU_TYPE_ENUM, { message: 'type只能取0、1、2' })
  type: MENU_TYPE_ENUM

  @ApiProperty({ example: 'ep:house', description: '图标' })
  @IsString({ message: 'icon必须是string类型' })
  @IsOptional()
  icon: string

  @ApiProperty({ example: '', description: '图标' })
  @IsString({ message: 'redirect必须是string类型' })
  @IsOptional()
  redirect: string

  @ApiProperty({ example: 1, description: '是否隐藏' })
  @IsEnum([0, 1], { message: 'status只能取0、1' })
  status: number

  @ApiProperty({ example: 1, description: '是否缓存' })
  @IsEnum([0, 1], { message: 'isKeepAlive只能取0、1' })
  isKeepAlive: number
}
