import { Router } from 'express';
import { searchFAQs, getFAQSuggestions, searchWalletFAQs, searchXuFAQs } from '../controllers/helpCenterController';

const router = Router();

// Search FAQs
router.get('/search', searchFAQs);

// Get FAQ suggestions for autocomplete
router.get('/suggestions', getFAQSuggestions);

// Search Wallet FAQs
router.get('/wallet/search', searchWalletFAQs);

// Search Xu FAQs
router.get('/xu/search', searchXuFAQs);

export default router;