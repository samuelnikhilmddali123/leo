import jwt from 'jsonwebtoken';

export const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'velora_jwt_luxury_secret_key_2026',
    { expiresIn: '30d' }
  );
};
