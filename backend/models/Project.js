import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Project = sequelize.define('Project', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  longDescription: { type: DataTypes.TEXT },       // Modal icin detayli aciklama
  technologies: { type: DataTypes.JSON },           // ["React", "Node.js"]
  images: { type: DataTypes.JSON, defaultValue: [] }, // ["/uploads/a.jpg", "/uploads/b.jpg"]
  imageUrl: { type: DataTypes.STRING },             // Kapak gorseli (onceki alan korundu)
  githubUrl: { type: DataTypes.STRING },
  liveUrl: { type: DataTypes.STRING },
  featured: { type: DataTypes.BOOLEAN, defaultValue: false },
  order: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
  tableName: 'projects',
  timestamps: true
});

export default Project;