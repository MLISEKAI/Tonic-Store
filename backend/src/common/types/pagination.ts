export interface PageOptionsDto {
  search_text?: string;
  page?: number;
  limit?: number;
  cursor?: string;
}

export interface PaginationMeta {
  item_count: number;
  total_items: number;
  items_per_page: number;
  total_pages: number;
  current_page: number;
}

export interface PaginationResponse<T = any> {
  items: T[];
  meta: PaginationMeta;
}

export interface CursorPaginationMeta {
  next_cursor: string | null;
  has_more: boolean;
}

export interface CursorPaginationResponse<T = any> {
  items: T[];
  meta: CursorPaginationMeta;
}

export function parsePageOptions(query: any): Required<PageOptionsDto> {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit) || 10));
  const search_text = query.search_text || '';
  const cursor = query.cursor || '';
  return { search_text, page, limit, cursor };
}

export function calculatePagination(total: number, limit: number, page: number): PaginationMeta {
  const totalItems = +total;
  const itemsPerPage = +limit;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  return {
    item_count: +itemsPerPage,
    total_items: +totalItems,
    items_per_page: +itemsPerPage,
    total_pages: +totalPages,
    current_page: +page,
  };
}

export function mappingPagination<T>(
  items: T[],
  total: number,
  limit: number,
  page: number,
): PaginationResponse<T> {
  return { items, meta: calculatePagination(total, limit, page) };
}

export function mappingCursorPagination<T>(
  items: T[],
  hasMore: boolean,
  nextCursor: string | null,
): CursorPaginationResponse<T> {
  return { items, meta: { next_cursor: nextCursor, has_more: hasMore } };
}

export function encodeCursor(createdAt: string, id?: string): string {
  return Buffer.from(JSON.stringify({ created_at: createdAt, id })).toString('base64');
}

export function decodeCursor(cursor: string): { created_at: string; id?: string } | null {
  try {
    return JSON.parse(Buffer.from(cursor, 'base64').toString());
  } catch {
    return null;
  }
}