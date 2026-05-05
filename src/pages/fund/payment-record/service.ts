import request, { exportFile } from '@/utils/request';

const toDateString = (value: any): string | undefined => {
  if (!value) return undefined;
  if (typeof value === 'string') return value.slice(0, 10);
  if (typeof value?.format === 'function') return value.format('YYYY-MM-DD');
  return undefined;
};

const buildPaymentRecordQuery = (params: any) => {
  const { payment_time, current, ...rest } = params ?? {};
  const [startDate, endDate] = payment_time ?? [];
  return {
    ...rest,
    pageIndex: rest.pageIndex ?? current ?? 1,
    start_date: toDateString(startDate),
    end_date: toDateString(endDate),
  };
};

/**
 * 分页查询业主付款明细
 */
export const getPaymentRecordPageService = async (params: any) => {
  const query = buildPaymentRecordQuery(params);

  const res: any = await request.post('/payment-record/page', query);
  const pageData = res?.data ?? {};

  return {
    success: res?.success !== false,
    data: Array.isArray(pageData?.data) ? pageData.data : [],
    total: Number(pageData?.total) || 0,
    pageIndex: Number(pageData?.pageIndex) || query.pageIndex,
    pageSize: Number(pageData?.pageSize) || query.pageSize,
    pageTotal: Number(pageData?.pageTotal) || 0,
  };
};

/**
 * 按查询条件导出业主付款明细
 */
export const exportPaymentRecordPageService = async (params?: any) => {
  return await exportFile(
    '/payment-record/export',
    buildPaymentRecordQuery(params),
  );
};

/**
 * 按查询条件导出辅材付款明细
 */
export const exportMaterialPaymentDetailsService = async (params?: any) => {
  return await exportFile(
    '/payment-record/export-material-details',
    buildPaymentRecordQuery(params),
  );
};
