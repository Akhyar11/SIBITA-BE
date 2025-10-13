import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface UserAttributes {
  nim: string;
  name: string;
  password: string;
  role: "admin" | "KPRODI" | "Dosen" | "MHS";
}

interface UserCreationAttributes extends Optional<UserAttributes, "nim"> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public nim!: string;
  public name!: string;
  public password!: string;
  public role!: "admin" | "KPRODI" | "Dosen" | "MHS";
}

User.init(
  {
    nim: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "KPRODI", "Dosen", "MHS"),
      defaultValue: "MHS",
    },
  },
  {
    sequelize,
    modelName: "user",
    tableName: "users",
    timestamps: false,
  }
);

export default User;
