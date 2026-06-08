import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Experience = sequelize.define('Experience', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  company: { type: DataTypes.STRING, allowNull: false },
  position: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  startDate: { type: DataTypes.DATEONLY },
  endDate: { type: DataTypes.DATEONLY },
  isCurrent: { type: DataTypes.BOOLEAN, defaultValue: false },
  order: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
  tableName: 'experiences',
  timestamps: true
});

export default Experience;