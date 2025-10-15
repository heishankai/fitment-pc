// 通用响应类型定义
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  code: number;
  message?: string | null;
}

export type DrawerTitleType = 'add' | 'edit' | 'detail';
