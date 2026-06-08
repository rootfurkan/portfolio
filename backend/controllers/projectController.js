import Project from '../models/Project.js';
import fs from 'fs';
import path from 'path';

export const getAll = async (req, res) => {
  try {
    const data = await Project.findAll({ order: [['order', 'ASC'], ['createdAt', 'DESC']] });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

export const getOne = async (req, res) => {
  try {
    const item = await Project.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Bulunamadı' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

export const create = async (req, res) => {
  try {
    const body = { ...req.body };

    // Tekli kapak gorseli
    if (req.files && req.files['image']) {
      body.imageUrl = `/uploads/${req.files['image'][0].filename}`;
    }

    // Coklu gorsel dizisi
    if (req.files && req.files['images']) {
      body.images = req.files['images'].map(f => `/uploads/${f.filename}`);
    } else {
      body.images = [];
    }

    if (body.technologies && typeof body.technologies === 'string') {
      body.technologies = JSON.parse(body.technologies);
    }

    const item = await Project.create(body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const item = await Project.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Bulunamadı' });

    const body = { ...req.body };

    if (req.files && req.files['image']) {
      body.imageUrl = `/uploads/${req.files['image'][0].filename}`;
    }

    if (req.files && req.files['images'] && req.files['images'].length > 0) {
      const newImages = req.files['images'].map(f => `/uploads/${f.filename}`);
      // Mevcut gorsellerin uzerine ekle veya degistir
      const existing = item.images || [];
      body.images = [...existing, ...newImages];
    }

    if (body.technologies && typeof body.technologies === 'string') {
      body.technologies = JSON.parse(body.technologies);
    }

    // Belirli bir gorseli silmek icin (admin panelinden)
    if (body.removeImage) {
      const images = item.images || [];
      body.images = images.filter(img => img !== body.removeImage);
      delete body.removeImage;
    }

    await item.update(body);
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

export const remove = async (req, res) => {
  try {
    const item = await Project.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Bulunamadı' });
    await item.destroy();
    res.json({ message: 'Silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};