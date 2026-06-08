import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Profile = sequelize.define('Profile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fullName: { type: DataTypes.STRING, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  bio: { type: DataTypes.TEXT },
  email: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  location: { type: DataTypes.STRING },
  github: { type: DataTypes.STRING },
  linkedin: { type: DataTypes.STRING },
  website: { type: DataTypes.STRING },
  photoUrl: { type: DataTypes.STRING },
  resumeUrl: { type: DataTypes.STRING },
  skills: { type: DataTypes.JSON }
}, {
  tableName: 'profile',
  timestamps: true
});

export default Profile;