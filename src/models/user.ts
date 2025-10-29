import { Table, Column, DataType, Model } from 'sequelize-typescript';

@Table({
  tableName: 'users',
  timestamps: true, // opcional, crea createdAt y updatedAt automáticamente
})
export class User extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  username!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;
}

export default User