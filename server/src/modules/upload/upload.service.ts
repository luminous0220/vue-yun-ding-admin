import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import ExcleJs from 'exceljs'
import { UserEntity } from '../user/entities/user.entity'
import { Repository } from 'typeorm'
import { encrypByMd5 } from 'src/utils'
import { RoleEntity } from '../role/entities/role.entity'
import { ROLE_ENUME } from 'src/common/constants/role.constant'

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEnity: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleEntity: Repository<RoleEntity>
  ) {}

  async handleUsersExcle(file: Express.Multer.File) {
    const workbook = new ExcleJs.Workbook()
    await workbook.xlsx.load(file.buffer)
    const sheet1 = workbook.getWorksheet(1)
    const headers = ['username', 'email', 'nickname', 'password', 'sex', 'birthday', 'sign']
    const userlist = []
    // 读取数据并填充到 userlist 中
    sheet1.eachRow((row, idx) => {
      if (idx > 1) {
        const data = {}
        row.eachCell((cell, col) => {
          // 密码加密MD5
          if (col === 4) {
            data[headers[col - 1]] = encrypByMd5(String(cell.value))
            return
          }

          data[headers[col - 1]] = cell.value
        })
        userlist.push(data)
      }
    })
    const u = await this.roleEntity.findOne({ where: { flag: ROLE_ENUME.USER } })

    // 默认角色为user，状态为1
    userlist.forEach((ite) => {
      ite.roles = [u]
      ite.status = 1
    })
    await this.userEnity.save(userlist)
  }

  async handleImageFile(id: number, file: Express.Multer.File) {
    const u = await this.userEnity.findOneBy({ id })
    u.avatar =
      process.env.BASEURL + ':' + process.env.PORT + process.env.IMAGE_PREFIX + '/' + file.filename
    await this.userEnity.save(u)
  }
}
