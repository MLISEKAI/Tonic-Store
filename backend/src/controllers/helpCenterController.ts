import type { Request, Response } from 'express';
import { handleControllerError, ErrorCodes } from '../common/types/api-response';

const faqData = [
  { id: 1, question: 'Làm thế nào để đặt hàng?', answer: 'Để đặt hàng trên Tonic Store, bạn có thể làm theo các bước sau: 1. Đăng nhập vào tài khoản, 2. Chọn sản phẩm và thêm vào giỏ hàng, 3. Kiểm tra giỏ hàng và thanh toán, 4. Điền thông tin giao hàng, 5. Xác nhận đơn hàng', category: 'Đặt hàng', keywords: ['đặt hàng', 'mua hàng', 'order', 'purchase', 'giỏ hàng', 'thanh toán'] },
  { id: 2, question: 'Các phương thức thanh toán nào được hỗ trợ?', answer: 'Tonic Store hỗ trợ các phương thức thanh toán: COD, VNPay, Chuyển khoản ngân hàng, Ví điện tử', category: 'Thanh toán', keywords: ['thanh toán', 'payment', 'cod', 'vnpay', 'chuyển khoản', 'ví điện tử'] },
  { id: 3, question: 'Thời gian giao hàng là bao lâu?', answer: 'Thời gian giao hàng: TP.HCM 1-2 ngày, Hà Nội 2-3 ngày, các tỉnh khác 3-5 ngày', category: 'Giao hàng', keywords: ['giao hàng', 'shipping', 'delivery', 'thời gian', 'bao lâu'] },
  { id: 4, question: 'Làm thế nào để trả hàng/hoàn tiền?', answer: 'Bạn có thể trả hàng trong 7 ngày: liên hệ hotline, điền form trả hàng, đóng gói nguyên vẹn, gửi về địa chỉ, chúng tôi sẽ hoàn tiền sau khi kiểm tra', category: 'Trả hàng', keywords: ['trả hàng', 'hoàn tiền', 'refund', 'return', 'đổi hàng', 'hủy đơn'] },
  { id: 5, question: 'Làm thế nào để theo dõi đơn hàng?', answer: 'Theo dõi đơn hàng: đăng nhập vào "Đơn hàng của tôi", sử dụng mã đơn hàng tra cứu, liên hệ hotline hỗ trợ', category: 'Theo dõi', keywords: ['theo dõi', 'tracking', 'tra cứu', 'đơn hàng', 'order status', 'trạng thái'] },
];

const walletFaqData = [
  { id: 1, question: 'Ví Tonic Store là gì?', answer: 'Ví Tonic Store là dịch vụ ví điện tử tích hợp trong nền tảng Tonic Store, cho phép bạn thanh toán nhanh chóng, an toàn và tiện lợi.', category: 'Giới thiệu', keywords: ['ví', 'tonic store', 'thanh toán', 'ví điện tử', 'tiền', 'giao dịch'] },
  { id: 2, question: 'Làm thế nào để nạp tiền vào ví?', answer: 'Bạn có thể nạp tiền vào ví Tonic Store bằng chuyển khoản ngân hàng, thẻ ATM/Credit, ví điện tử khác.', category: 'Nạp tiền', keywords: ['nạp tiền', 'ví', 'ngân hàng', 'thẻ', 'atm', 'credit'] },
  { id: 3, question: 'Làm thế nào để rút tiền từ ví?', answer: 'Để rút tiền từ ví về tài khoản ngân hàng: đăng nhập → Ví → Rút tiền → nhập số tiền → chọn ngân hàng → xác nhận.', category: 'Rút tiền', keywords: ['rút tiền', 'ví', 'ngân hàng', 'chuyển khoản', 'tiền mặt'] },
];

const xuFaqData = [
  { id: 1, question: 'Tonic Xu là gì?', answer: 'Tonic Xu là hệ thống điểm thưởng của Tonic Store, cho phép bạn tích lũy điểm khi mua sắm và sử dụng để giảm giá.', category: 'Giới thiệu', keywords: ['tonic xu', 'điểm thưởng', 'xu', 'tích lũy', 'giảm giá', 'thưởng'] },
  { id: 2, question: 'Làm thế nào để tích lũy Tonic Xu?', answer: 'Bạn có thể tích lũy Tonic Xu thông qua: mua hàng (1 VND = 1 Xu), đánh giá sản phẩm (+10 Xu), chia sẻ sản phẩm (+5 Xu).', category: 'Tích lũy', keywords: ['tích lũy', 'xu', 'mua hàng', 'đánh giá', 'chia sẻ', 'mời bạn'] },
];

function calculateRelevanceScore(faq: any, searchTerm: string): number {
  let score = 0;
  const term = searchTerm.toLowerCase();
  if (faq.question.toLowerCase().includes(term)) score += 10;
  if (faq.answer.toLowerCase().includes(term)) score += 5;
  faq.keywords.forEach((keyword: string) => { if (keyword.toLowerCase().includes(term)) score += 2; });
  return score;
}

export const searchFAQs = async (req: Request, res: Response) => {
  try {
    const { q: query, limit = 20 } = req.query;
    if (!query || typeof query !== 'string') {
      res.apiSuccess([], "Vui lòng nhập từ khóa tìm kiếm");
      return;
    }

    const searchTerm = query.toLowerCase().trim();
    const results = faqData
      .filter(faq => faq.question.toLowerCase().includes(searchTerm) || faq.answer.toLowerCase().includes(searchTerm) || faq.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm)))
      .map(faq => ({ id: faq.id, question: faq.question, category: faq.category, answer: faq.answer.substring(0, 150) + '...', relevanceScore: calculateRelevanceScore(faq, searchTerm) }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, parseInt(limit as string));

    res.apiSuccess({ data: results, total: results.length, query: searchTerm }, "Tìm kiếm FAQ thành công");
  } catch (error) {
    handleControllerError(res, error, "searchFAQs");
  }
};

export const getFAQSuggestions = async (req: Request, res: Response) => {
  try {
    const { q: query, limit = 5 } = req.query;
    if (!query || typeof query !== 'string' || query.length < 2) {
      res.apiSuccess([], "Nhập ít nhất 2 ký tự để tìm kiếm");
      return;
    }

    const searchTerm = query.toLowerCase().trim();
    const suggestions = faqData
      .filter(faq => faq.question.toLowerCase().includes(searchTerm) || faq.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm)))
      .map(faq => ({ id: faq.id, text: faq.question, category: faq.category }))
      .slice(0, parseInt(limit as string));

    res.apiSuccess({ data: suggestions, query: searchTerm }, "Lấy gợi ý FAQ thành công");
  } catch (error) {
    handleControllerError(res, error, "getFAQSuggestions");
  }
};

export const searchWalletFAQs = async (req: Request, res: Response) => {
  try {
    const { q: query, limit = 10 } = req.query;
    if (!query || typeof query !== 'string') {
      res.apiSuccess([], "Vui lòng nhập từ khóa tìm kiếm");
      return;
    }

    const searchTerm = query.toLowerCase().trim();
    const results = walletFaqData
      .filter(faq => faq.question.toLowerCase().includes(searchTerm) || faq.answer.toLowerCase().includes(searchTerm) || faq.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm)))
      .map(faq => ({ id: faq.id, question: faq.question, category: faq.category, answer: faq.answer.substring(0, 150) + '...', relevanceScore: calculateRelevanceScore(faq, searchTerm) }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, parseInt(limit as string));

    res.apiSuccess({ data: results, total: results.length, query: searchTerm }, "Tìm kiếm FAQ ví thành công");
  } catch (error) {
    handleControllerError(res, error, "searchWalletFAQs");
  }
};

export const searchXuFAQs = async (req: Request, res: Response) => {
  try {
    const { q: query, limit = 10 } = req.query;
    if (!query || typeof query !== 'string') {
      res.apiSuccess([], "Vui lòng nhập từ khóa tìm kiếm");
      return;
    }

    const searchTerm = query.toLowerCase().trim();
    const results = xuFaqData
      .filter(faq => faq.question.toLowerCase().includes(searchTerm) || faq.answer.toLowerCase().includes(searchTerm) || faq.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm)))
      .map(faq => ({ id: faq.id, question: faq.question, category: faq.category, answer: faq.answer.substring(0, 150) + '...', relevanceScore: calculateRelevanceScore(faq, searchTerm) }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, parseInt(limit as string));

    res.apiSuccess({ data: results, total: results.length, query: searchTerm }, "Tìm kiếm FAQ xu thành công");
  } catch (error) {
    handleControllerError(res, error, "searchXuFAQs");
  }
};
