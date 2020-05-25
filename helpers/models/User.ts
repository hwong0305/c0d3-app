import { Model, DataTypes } from 'sequelize'

export class User extends Model {
  public id!: number
  public name!: string
  public username!: string
  public password!: string
  public email!: string
  public gsId?: number
  public isOnline!: boolean
  public isAdmin!: boolean
  public forgotToken?: string
  public cliToken?: string
  public emailVerificationToken?: string
  public expiration?: Date

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export const UserTypes = {
  name: DataTypes.STRING,
  username: DataTypes.STRING,
  password: DataTypes.STRING,
  email: DataTypes.STRING,
  gsId: DataTypes.INTEGER,
  isOnline: DataTypes.BOOLEAN,
  isAdmin: {
    type: DataTypes.STRING,
    defaultValue: false
  },
  forgotToken: DataTypes.STRING,
  cliToken: DataTypes.STRING,
  emailVerificationToken: DataTypes.STRING,
  expiration: DataTypes.DATE
}
