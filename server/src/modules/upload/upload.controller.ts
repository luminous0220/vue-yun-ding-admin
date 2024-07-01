import { Controller, Post, Req, UploadedFile } from '@nestjs/common'
import { UploadService } from './upload.service'
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger'
import { Excle, Image } from 'src/common'
import { FileUploadDto } from './dto/file-upload.dto'
import { Request } from 'express'
@Controller('upload')
@ApiTags('上传模块')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiOperation({ summary: '批量新增用户（上传Excle）' })
  @Post('users')
  @Excle()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '只支持xlsx、xls文件',
    type: FileUploadDto
  })
  async handleUsersExcle(@UploadedFile() file: Express.Multer.File) {
    return await this.uploadService.handleUsersExcle(file)
  }

  @ApiOperation({ summary: '图片上传' })
  @Post('image')
  @Image()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '只支持jpg、jpeg、png等格式',
    type: FileUploadDto
  })
  async handleImageFile(@Req() req: Request, @UploadedFile() file: Express.Multer.File) {
    const { userId } = req.user
    await this.uploadService.handleImageFile(userId, file)
  }
}
