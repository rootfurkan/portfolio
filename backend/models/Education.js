import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Education = sequelize.define('Education', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  school: { type: DataTypes.STRING, allowNull: false },
  degree: { type: DataTypes.STRING },
  field: { type: DataTypes.STRING },
  startDate: { type: DataTypes.DATEONLY },
  endDate: { type: DataTypes.DATEONLY },
  isCurrent: { type: DataTypes.BOOLEAN, defaultValue: false },
  description: { type: DataTypes.TEXT },
  order: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
  tableName: 'educations',
  timestamps: true
});

export default Education;