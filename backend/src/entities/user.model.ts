import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/sequelize";

export interface UserResponse {
  id: number;
  nome: string;
  email: string;
  cpf: string;
}

export class User extends Model {
  declare id: number;
  declare nome: string;
  declare email: string;
  declare cpf: string;
  declare password: string;

  // Nunca devolvemos a senha (nem criptografada) nas respostas da API
  public convertToResponse(): UserResponse {
    return {
      id: this.id,
      nome: this.nome,
      email: this.email,
      cpf: this.cpf,
    };
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    // CPF salvo somente com dígitos (11 caracteres)
    cpf: { type: DataTypes.STRING(11), allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
  },
);
