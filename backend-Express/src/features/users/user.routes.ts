import { Router } from 'express';
import { authenticateJWT } from '../../core/middlewares/auth';
import {
  getProfile,
  updateProfile,
  listAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  listPaymentMethods,
  addPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} from './user.controller';

const router = Router();

// Apply auth middleware uniformly across all subroutes
router.use(authenticateJWT);

router.get('/me', getProfile);
router.put('/me', updateProfile);

router.get('/me/addresses', listAddresses);
router.post('/me/addresses', addAddress);
router.put('/me/addresses/:id', updateAddress);
router.delete('/me/addresses/:id', deleteAddress);

router.get('/me/payment-methods', listPaymentMethods);
router.post('/me/payment-methods', addPaymentMethod);
router.put('/me/payment-methods/:id', updatePaymentMethod);
router.delete('/me/payment-methods/:id', deletePaymentMethod);

export default router;