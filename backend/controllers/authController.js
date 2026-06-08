import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'

export const register = async (req, res) => {
  try {
    const { email, password } = req.body
    const existing = await User.findOne({ where: { email } })
    if (existing) return res.status(400).json({ message: 'Bu email zaten kayıtlı' })
    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({ email, password: hashed })
    res.status(201).json({ message: 'Admin oluşturuldu', id: user.id })
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ where: { email } })
    if (!user) return res.status(401).json({ message: 'Email veya şifre hatalı' })
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(401).json({ message: 'Email veya şifre hatalı' })
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user: { id: user.id, email: user.email } })
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const me = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: ['id', 'email'] })
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' })
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Mevcut şifre ve yeni şifre zorunludur' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Yeni şifre en az 6 karakter olmalıdır' })
    }

    const user = await User.findByPk(req.user.id)
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' })

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) return res.status(401).json({ message: 'Mevcut şifre hatalı' })

    const hashed = await bcrypt.hash(newPassword, 10)
    await user.update({ password: hashed })

    res.json({ message: 'Şifre başarıyla güncellendi' })
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}