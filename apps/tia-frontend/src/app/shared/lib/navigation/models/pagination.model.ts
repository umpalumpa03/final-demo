export interface PaginationConfig {
    showEllipsis?: boolean;
    maxVisiblePages?: number;
    previousLabel?: string;
    nextLabel?: string;
}

export const PAGINATION_DEFAULT_CONFIG: PaginationConfig = {
    showEllipsis: true,
    maxVisiblePages: 7,
};

export const ELLIPSIS = 'ellipsis' as const;