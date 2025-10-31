import { Table, Column, DataType, Model } from 'sequelize-typescript';

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare is_master: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare master_key_hash?: string;
}

export default User;
