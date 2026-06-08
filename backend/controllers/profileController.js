import Profile from '../models/Profile.js';

export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) {
      return res.status(404).json({ message: 'Profil bulunamadı' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();

    if (profile) {
      await profile.update(req.body);
    } else {
      profile = await Profile.create(req.body);
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

export const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Dosya bulunamadı' });
    }

    const photoUrl = `/uploads/${req.file.filename}`;

    let profile = await Profile.findOne();
    if (profile) {
      await profile.update({ photoUrl });
    } else {
      profile = await Profile.create({ photoUrl, fullName: 'Admin', title: 'Developer' });
    }

    res.json({ photoUrl });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};