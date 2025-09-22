import { ENDPOINTS, handleResponse } from '../api';

export interface FAQSuggestion {
  id: number;
  text: string;
  category: string;
}

export interface FAQSearchResult {
  id: number;
  question: string;
  category: string;
  answer: string;
  relevanceScore: number;
}

export const HelpCenterService = {
  // Tìm kiếm FAQ
  async searchFAQs(query: string, limit: number = 10): Promise<{
    success: boolean;
    data: FAQSearchResult[];
    total: number;
    query: string;
  }> {
    const response = await fetch(`${ENDPOINTS.HELP_CENTER.SEARCH}?q=${encodeURIComponent(query)}&limit=${limit}`);
    return handleResponse(response);
  },

  // Lấy gợi ý FAQ cho autocomplete
  async getSuggestions(query: string, limit: number = 5): Promise<{
    success: boolean;
    data: FAQSuggestion[];
    query: string;
  }> {
    const response = await fetch(`${ENDPOINTS.HELP_CENTER.SUGGESTIONS}?q=${encodeURIComponent(query)}&limit=${limit}`);
    return handleResponse(response);
  }
};