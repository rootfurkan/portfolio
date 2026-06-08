import Education from '../models/Education.js';

export const getAll = async (req, res) => {
  try {
    const data = await Education.findAll({ order: [['order', 'ASC']] });
    res.json(data);
  } catch (error) { res.status(500).json({ message: 'Sunucu hatası' }); }
};

export const create = async (req, res) => {
  try {
    const item = await Education.create(req.body);
    res.status(201).json(item);
  } catch (error) { res.status(500).json({ message: 'Sunucu hatası', error: error.message }); }
};

export const update = async (req, res) => {
  try {
    const item = await Education.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Bulunamadı' });
    await item.update(req.body);
    res.json(item);
  } catch (error) { res.status(500).json({ message: 'Sunucu hatası' }); }
};

export const remove = async (req, res) => {
  try {
    const item = await Education.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Bulunamadı' });
    await item.destroy();
    res.json({ message: 'Silindi' });
  } catch (error) { res.status(500).json({ message: 'Sunucu hatası' }); }
};