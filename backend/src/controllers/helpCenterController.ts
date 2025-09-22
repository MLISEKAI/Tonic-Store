import { Request, Response } from 'express';

// Dữ liệu FAQ mẫu - trong thực tế có thể lưu trong database
const faqData = [
  {
    id: 1,
    question: 'Làm thế nào để đặt hàng?',
    answer: 'Để đặt hàng trên Tonic Store, bạn có thể làm theo các bước sau: 1. Đăng nhập vào tài khoản, 2. Chọn sản phẩm và thêm vào giỏ hàng, 3. Kiểm tra giỏ hàng và thanh toán, 4. Điền thông tin giao hàng, 5. Xác nhận đơn hàng',
    category: 'Đặt hàng',
    keywords: ['đặt hàng', 'mua hàng', 'order', 'purchase', 'giỏ hàng', 'thanh toán']
  },
  {
    id: 2,
    question: 'Các phương thức thanh toán nào được hỗ trợ?',
    answer: 'Tonic Store hỗ trợ các phương thức thanh toán: COD, VNPay, Chuyển khoản ngân hàng, Ví điện tử',
    category: 'Thanh toán',
    keywords: ['thanh toán', 'payment', 'cod', 'vnpay', 'chuyển khoản', 'ví điện tử']
  },
  {
    id: 3,
    question: 'Thời gian giao hàng là bao lâu?',
    answer: 'Thời gian giao hàng: TP.HCM 1-2 ngày, Hà Nội 2-3 ngày, các tỉnh khác 3-5 ngày, vùng sâu vùng xa 5-7 ngày',
    category: 'Giao hàng',
    keywords: ['giao hàng', 'shipping', 'delivery', 'thời gian', 'bao lâu', 'vận chuyển']
  },
  {
    id: 4,
    question: 'Làm thế nào để trả hàng/hoàn tiền?',
    answer: 'Bạn có thể trả hàng trong 7 ngày: liên hệ hotline, điền form trả hàng, đóng gói nguyên vẹn, gửi về địa chỉ, chúng tôi sẽ hoàn tiền sau khi kiểm tra',
    category: 'Trả hàng',
    keywords: ['trả hàng', 'hoàn tiền', 'refund', 'return', 'đổi hàng', 'hủy đơn']
  },
  {
    id: 5,
    question: 'Làm thế nào để theo dõi đơn hàng?',
    answer: 'Theo dõi đơn hàng: đăng nhập vào "Đơn hàng của tôi", sử dụng mã đơn hàng tra cứu, liên hệ hotline hỗ trợ',
    category: 'Theo dõi',
    keywords: ['theo dõi', 'tracking', 'tra cứu', 'đơn hàng', 'order status', 'trạng thái']
  },
  {
    id: 6,
    question: '[Cảnh báo lừa đảo] Nên và không nên làm để tránh nhận phải đơn hàng ảo/giả mạo',
    answer: 'Để tránh nhận phải đơn hàng ảo/giả mạo: 1. Kiểm tra kỹ thông tin người bán, 2. Xem đánh giá và phản hồi, 3. Không thanh toán trước khi nhận hàng, 4. Liên hệ trực tiếp với shop để xác nhận, 5. Báo cáo ngay khi phát hiện gian lận',
    category: 'Cảnh báo lừa đảo',
    keywords: ['lừa đảo', 'đơn hàng ảo', 'giả mạo', 'cảnh báo', 'gian lận', 'áo', 'quần áo']
  },
  {
    id: 7,
    question: '[Đơn hàng] Tôi cần làm gì nếu nhận phải đơn/gói hàng mà tôi không đặt?',
    answer: 'Nếu nhận phải đơn hàng không đặt: 1. Không mở gói hàng, 2. Chụp ảnh gói hàng và hóa đơn, 3. Liên hệ hotline Tonic Store ngay lập tức, 4. Gửi trả hàng về địa chỉ chúng tôi, 5. Chúng tôi sẽ xử lý và hoàn tiền',
    category: 'Đơn hàng',
    keywords: ['đơn hàng', 'không đặt', 'nhận nhầm', 'gói hàng', 'áo', 'quần áo']
  },
  {
    id: 8,
    question: '[Dịch vụ] Làm sao để tố cáo hành vi gian lận của Shop (Người Bán)?',
    answer: 'Để tố cáo gian lận: 1. Chụp ảnh bằng chứng, 2. Ghi lại thông tin shop, 3. Gửi email đến support@tonicstore.com, 4. Gọi hotline 1900-xxxx, 5. Chúng tôi sẽ điều tra và xử lý trong 24h',
    category: 'Dịch vụ',
    keywords: ['tố cáo', 'gian lận', 'shop', 'người bán', 'áo', 'quần áo']
  },
  {
    id: 9,
    question: '[Trả hàng] Sản phẩm hạn chế trả hàng là gì?',
    answer: 'Sản phẩm hạn chế trả hàng: đồ lót, mỹ phẩm đã mở, thực phẩm, đồ điện tử đã kích hoạt, hàng may đo, sản phẩm có dấu hiệu sử dụng. Vui lòng kiểm tra chính sách trước khi mua',
    category: 'Trả hàng',
    keywords: ['hạn chế trả hàng', 'sản phẩm', 'áo', 'quần áo', 'đồ lót']
  },
  {
    id: 10,
    question: '[Trả hàng/Hoàn tiền] Câu Hỏi Thường Gặp Khi Trả Hàng (với lý do Hàng nguyên vẹn nhưng không còn nhu cầu)',
    answer: 'Trả hàng vì không còn nhu cầu: 1. Hàng phải nguyên vẹn, chưa sử dụng, 2. Còn hạn 7 ngày kể từ khi nhận, 3. Liên hệ hotline để tạo đơn trả hàng, 4. Đóng gói và gửi về, 5. Hoàn tiền 100% sau khi kiểm tra',
    category: 'Trả hàng/Hoàn tiền',
    keywords: ['trả hàng', 'hoàn tiền', 'không còn nhu cầu', 'áo', 'quần áo']
  },
  {
    id: 11,
    question: '[Cảnh báo vi phạm] Vì sao tôi nhận được thông báo nghi ngờ về hành vi hợp tác gian lận từ Tonic Store?',
    answer: 'Thông báo nghi ngờ gian lận có thể do: 1. Mua hàng với tần suất bất thường, 2. Địa chỉ giao hàng không khớp, 3. Thanh toán từ nhiều tài khoản khác nhau, 4. Hành vi mua bán bất thường. Liên hệ hotline để được giải thích chi tiết',
    category: 'Cảnh báo vi phạm',
    keywords: ['cảnh báo', 'vi phạm', 'gian lận', 'hợp tác', 'áo', 'quần áo']
  },
  {
    id: 12,
    question: '[Lỗi] Tại sao tài khoản Tonic Store của tôi bị khóa/bị giới hạn?',
    answer: 'Tài khoản bị khóa có thể do: 1. Vi phạm điều khoản sử dụng, 2. Hành vi gian lận, 3. Tạo nhiều tài khoản, 4. Spam hoặc gửi tin nhắn không phù hợp. Liên hệ support để được hỗ trợ mở khóa',
    category: 'Lỗi',
    keywords: ['tài khoản', 'khóa', 'giới hạn', 'lỗi', 'áo', 'quần áo']
  },
  {
    id: 13,
    question: '[Cảnh báo lừa đảo] Làm thế nào để bảo vệ bản thân khỏi những kẻ lừa đảo?',
    answer: 'Để bảo vệ khỏi lừa đảo: 1. Không chia sẻ thông tin cá nhân, 2. Kiểm tra kỹ shop trước khi mua, 3. Không click vào link lạ, 4. Sử dụng thanh toán an toàn, 5. Báo cáo ngay khi nghi ngờ',
    category: 'Cảnh báo lừa đảo',
    keywords: ['bảo vệ', 'lừa đảo', 'cảnh báo', 'áo', 'quần áo', 'an toàn']
  },
  {
    id: 14,
    question: '[SHOPEE ĐỒNG KIỂM] Hướng dẫn đồng kiểm',
    answer: 'Đồng kiểm hàng hóa: 1. Kiểm tra hàng trước khi thanh toán, 2. Xác nhận đúng sản phẩm, 3. Kiểm tra chất lượng, 4. Chụp ảnh làm bằng chứng, 5. Từ chối nhận nếu không đúng',
    category: 'Đồng kiểm',
    keywords: ['đồng kiểm', 'hướng dẫn', 'kiểm tra', 'áo', 'quần áo', 'chất lượng']
  },
  {
    id: 15,
    question: '[Shopee Video] Quy định đăng Shopee Video và các hình thức xử lý vi phạm',
    answer: 'Quy định Shopee Video: 1. Nội dung phù hợp, không vi phạm, 2. Không spam, 3. Tuân thủ bản quyền, 4. Không quảng cáo gian lận, 5. Vi phạm sẽ bị xử lý theo quy định',
    category: 'Shopee Video',
    keywords: ['shopee video', 'quy định', 'vi phạm', 'áo', 'quần áo', 'nội dung']
  }
];

// Dữ liệu FAQ cho Ví TonicPay
const walletFaqData = [
  {
    id: 1,
    question: 'Ví Tonic Store là gì?',
    answer: 'Ví Tonic Store là dịch vụ ví điện tử tích hợp trong nền tảng Tonic Store, cho phép bạn thanh toán nhanh chóng, an toàn và tiện lợi cho các giao dịch mua sắm.',
    category: 'Giới thiệu',
    keywords: ['ví', 'tonic store', 'thanh toán', 'ví điện tử', 'tiền', 'giao dịch']
  },
  {
    id: 2,
    question: 'Làm thế nào để nạp tiền vào ví?',
    answer: 'Bạn có thể nạp tiền vào ví Tonic Store bằng chuyển khoản ngân hàng, thẻ ATM/Credit, ví điện tử khác hoặc nạp tiền mặt tại các điểm giao dịch.',
    category: 'Nạp tiền',
    keywords: ['nạp tiền', 'ví', 'ngân hàng', 'thẻ', 'atm', 'credit']
  },
  {
    id: 3,
    question: 'Làm thế nào để rút tiền từ ví?',
    answer: 'Để rút tiền từ ví về tài khoản ngân hàng: đăng nhập → Ví → Rút tiền → nhập số tiền → chọn ngân hàng → xác nhận.',
    category: 'Rút tiền',
    keywords: ['rút tiền', 'ví', 'ngân hàng', 'chuyển khoản', 'tiền mặt']
  },
  {
    id: 4,
    question: 'Phí sử dụng ví như thế nào?',
    answer: 'Ví Tonic Store: nạp tiền từ ngân hàng miễn phí, rút tiền về ngân hàng 0.5%, thanh toán đơn hàng miễn phí.',
    category: 'Phí',
    keywords: ['phí', 'ví', 'nạp tiền', 'rút tiền', 'thanh toán', 'miễn phí']
  },
  {
    id: 5,
    question: 'Làm sao để bảo mật ví?',
    answer: 'Để bảo mật ví: đặt mật khẩu mạnh, bật xác thực 2 lớp, không sử dụng WiFi công cộng, thường xuyên kiểm tra lịch sử giao dịch.',
    category: 'Bảo mật',
    keywords: ['bảo mật', 'ví', 'mật khẩu', 'xác thực', 'an toàn', 'bảo vệ']
  }
];

// Dữ liệu FAQ cho Tonic Xu
const xuFaqData = [
  {
    id: 1,
    question: 'Tonic Xu là gì?',
    answer: 'Tonic Xu là hệ thống điểm thưởng của Tonic Store, cho phép bạn tích lũy điểm khi mua sắm và sử dụng để giảm giá cho các đơn hàng tiếp theo.',
    category: 'Giới thiệu',
    keywords: ['tonic xu', 'điểm thưởng', 'xu', 'tích lũy', 'giảm giá', 'thưởng']
  },
  {
    id: 2,
    question: 'Làm thế nào để tích lũy Tonic Xu?',
    answer: 'Bạn có thể tích lũy Tonic Xu thông qua: mua hàng (1 VND = 1 Xu), đánh giá sản phẩm (+10 Xu), chia sẻ sản phẩm (+5 Xu), mời bạn bè (+100 Xu).',
    category: 'Tích lũy',
    keywords: ['tích lũy', 'xu', 'mua hàng', 'đánh giá', 'chia sẻ', 'mời bạn']
  },
  {
    id: 3,
    question: 'Làm thế nào để sử dụng Tonic Xu?',
    answer: 'Để sử dụng Tonic Xu: thêm sản phẩm vào giỏ hàng → thanh toán → chọn "Sử dụng Tonic Xu" → nhập số Xu (tối đa 50% giá trị đơn hàng) → xác nhận.',
    category: 'Sử dụng',
    keywords: ['sử dụng', 'xu', 'thanh toán', 'giảm giá', 'đơn hàng', 'mua sắm']
  },
  {
    id: 4,
    question: 'Tonic Xu có thời hạn sử dụng không?',
    answer: 'Tonic Xu KHÔNG có thời hạn sử dụng, bạn có thể tích lũy và sử dụng Xu bất kỳ lúc nào mà không lo bị mất.',
    category: 'Thời hạn',
    keywords: ['thời hạn', 'xu', 'hết hạn', 'mất', 'tích lũy', 'sử dụng']
  },
  {
    id: 5,
    question: 'Tonic Xu có thể chuyển đổi thành tiền mặt không?',
    answer: 'KHÔNG, Tonic Xu không thể chuyển đổi thành tiền mặt hoặc rút ra ngoài. Xu chỉ có thể sử dụng để giảm giá đơn hàng trên Tonic Store.',
    category: 'Chuyển đổi',
    keywords: ['chuyển đổi', 'xu', 'tiền mặt', 'rút tiền', 'giảm giá', 'thanh toán']
  }
];

export const searchFAQs = async (req: Request, res: Response) => {
  try {
    const { q: query, limit = 20 } = req.query;
    
    if (!query || typeof query !== 'string') {
      return res.json({
        success: true,
        data: [],
        message: 'Vui lòng nhập từ khóa tìm kiếm'
      });
    }

    const searchTerm = query.toLowerCase().trim();
    
    // Tìm kiếm trong câu hỏi, câu trả lời và từ khóa
    const results = faqData.filter(faq => {
      const questionMatch = faq.question.toLowerCase().includes(searchTerm);
      const answerMatch = faq.answer.toLowerCase().includes(searchTerm);
      const keywordMatch = faq.keywords.some(keyword => 
        keyword.toLowerCase().includes(searchTerm)
      );
      
      return questionMatch || answerMatch || keywordMatch;
    })
    .map(faq => ({
      id: faq.id,
      question: faq.question,
      category: faq.category,
      answer: faq.answer.substring(0, 150) + '...', // Truncate for preview
      relevanceScore: calculateRelevanceScore(faq, searchTerm)
    }))
    .sort((a, b) => b.relevanceScore - a.relevanceScore) // Sort by relevance
    .slice(0, parseInt(limit as string));

    res.json({
      success: true,
      data: results,
      total: results.length,
      query: searchTerm
    });
  } catch (error) {
    console.error('Error searching FAQs:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi tìm kiếm FAQ'
    });
  }
};

export const getFAQSuggestions = async (req: Request, res: Response) => {
  try {
    const { q: query, limit = 5 } = req.query;
    
    if (!query || typeof query !== 'string' || query.length < 2) {
      return res.json({
        success: true,
        data: [],
        message: 'Nhập ít nhất 2 ký tự để tìm kiếm'
      });
    }

    const searchTerm = query.toLowerCase().trim();
    
    // Tìm kiếm gợi ý nhanh
    const suggestions = faqData
      .filter(faq => 
        faq.question.toLowerCase().includes(searchTerm) ||
        faq.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm))
      )
      .map(faq => ({
        id: faq.id,
        text: faq.question,
        category: faq.category
      }))
      .slice(0, parseInt(limit as string));

    res.json({
      success: true,
      data: suggestions,
      query: searchTerm
    });
  } catch (error) {
    console.error('Error getting FAQ suggestions:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy gợi ý FAQ'
    });
  }
};

// Helper function
function calculateRelevanceScore(faq: any, searchTerm: string): number {
  let score = 0;
  const term = searchTerm.toLowerCase();
  
  // Exact match in question gets highest score
  if (faq.question.toLowerCase().includes(term)) {
    score += 10;
  }
  
  // Match in answer gets medium score
  if (faq.answer.toLowerCase().includes(term)) {
    score += 5;
  }
  
  // Match in keywords gets low score
  faq.keywords.forEach((keyword: string) => {
    if (keyword.toLowerCase().includes(term)) {
      score += 2;
    }
  });
  
  return score;
}

// Search FAQs for Wallet
export const searchWalletFAQs = async (req: Request, res: Response) => {
  try {
    const { q: query, limit = 10 } = req.query;
    
    if (!query || typeof query !== 'string') {
      return res.json({
        success: true,
        data: [],
        message: 'Vui lòng nhập từ khóa tìm kiếm'
      });
    }

    const searchTerm = query.toLowerCase().trim();
    
    const results = walletFaqData.filter(faq => {
      const questionMatch = faq.question.toLowerCase().includes(searchTerm);
      const answerMatch = faq.answer.toLowerCase().includes(searchTerm);
      const keywordMatch = faq.keywords.some(keyword => 
        keyword.toLowerCase().includes(searchTerm)
      );
      
      return questionMatch || answerMatch || keywordMatch;
    })
    .map(faq => ({
      id: faq.id,
      question: faq.question,
      category: faq.category,
      answer: faq.answer.substring(0, 150) + '...',
      relevanceScore: calculateRelevanceScore(faq, searchTerm)
    }))
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, parseInt(limit as string));

    res.json({
      success: true,
      data: results,
      total: results.length,
      query: searchTerm
    });
  } catch (error) {
    console.error('Error searching wallet FAQs:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi tìm kiếm FAQ ví'
    });
  }
};

// Search FAQs for Xu
export const searchXuFAQs = async (req: Request, res: Response) => {
  try {
    const { q: query, limit = 10 } = req.query;
    
    if (!query || typeof query !== 'string') {
      return res.json({
        success: true,
        data: [],
        message: 'Vui lòng nhập từ khóa tìm kiếm'
      });
    }

    const searchTerm = query.toLowerCase().trim();
    
    const results = xuFaqData.filter(faq => {
      const questionMatch = faq.question.toLowerCase().includes(searchTerm);
      const answerMatch = faq.answer.toLowerCase().includes(searchTerm);
      const keywordMatch = faq.keywords.some(keyword => 
        keyword.toLowerCase().includes(searchTerm)
      );
      
      return questionMatch || answerMatch || keywordMatch;
    })
    .map(faq => ({
      id: faq.id,
      question: faq.question,
      category: faq.category,
      answer: faq.answer.substring(0, 150) + '...',
      relevanceScore: calculateRelevanceScore(faq, searchTerm)
    }))
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, parseInt(limit as string));

    res.json({
      success: true,
      data: results,
      total: results.length,
      query: searchTerm
    });
  } catch (error) {
    console.error('Error searching xu FAQs:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi tìm kiếm FAQ xu'
    });
  }
};