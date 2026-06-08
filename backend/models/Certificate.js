import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Certificate = sequelize.define('Certificate', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  issuer: { type: DataTypes.STRING },
  date: { type: DataTypes.DATEONLY },
  credentialUrl: { type: DataTypes.STRING },
  imageUrl: { type: DataTypes.STRING },
  order: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
  tableName: 'certificates',
  timestamps: true
});

export default Certificate;