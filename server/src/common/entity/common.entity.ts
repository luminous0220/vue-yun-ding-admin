import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn
} from 'typeorm'

@Entity()
export class CommonEntity {
  @PrimaryGeneratedColumn()
  id?: number

  @CreateDateColumn({ type: 'datetime', comment: '创建时间' })
  createdAt?: Date

  @UpdateDateColumn({ type: 'datetime', comment: '更新时间' })
  updatedAt?: Date

  @DeleteDateColumn({ type: 'datetime', comment: '删除时间' })
  deletedAt?: Date
}
