import express from 'express';
import {
  getCollections,
  getCollectionBySlug,
  createCollection,
  updateCollection,
  deleteCollection,
} from '../controllers/collectionController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getCollections)
  .post(protect, admin, createCollection);

router.route('/slug/:slug')
  .get(getCollectionBySlug);

router.route('/:id')
  .put(protect, admin, updateCollection)
  .delete(protect, admin, deleteCollection);

export default router;
