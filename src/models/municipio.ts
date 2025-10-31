import { Table, Column, DataType, Model } from 'sequelize-typescript';

@Table({
  tableName: 'municipios',
  timestamps: true, // si quieres createdAt/updatedAt
})
export class Municipio extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  nombre!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;
}

export default Municipio;
