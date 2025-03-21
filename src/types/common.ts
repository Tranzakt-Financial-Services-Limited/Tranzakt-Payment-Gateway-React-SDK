export type PaginatedData<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
};

export type ApiError = {
  status: number;
  message: string;
  type: string;
  errors: string[];
};

export type Bank = {
  id: string;
  name: string;
  code: string;
  logo: string;
};
