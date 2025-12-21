import type { ColumnsType } from 'antd/es/table';
import { Tag } from 'antd';

// 工价列表表格列定义（主工价，包含验收状态）
export const mainPriceListColumns: ColumnsType<any> = [
  {
    title: '工价ID',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: '工种ID',
    dataIndex: 'work_kind_id',
    width: 80,
  },
  {
    title: '工种',
    dataIndex: ['work_kind', 'work_kind_name'],
    width: 100,
  },
  {
    title: '工价标题',
    dataIndex: 'work_title',
    width: 150,
    ellipsis: true,
  },
  {
    title: '单价',
    dataIndex: 'work_price',
    width: 100,
    render: (text: string) => `¥${text}`,
  },
  {
    title: '单位ID',
    dataIndex: ['labour_cost', 'id'],
    width: 80,
  },
  {
    title: '单位',
    dataIndex: ['labour_cost', 'labour_cost_name'],
    width: 100,
  },
  {
    title: '数量',
    dataIndex: 'quantity',
    width: 80,
  },
  {
    title: '小计',
    dataIndex: 'work_price',
    width: 100,
    render: (text: string, record: any) => {
      const total = Number(text) * Number(record.quantity);
      return `¥${total.toFixed(2)}`;
    },
  },
  {
    title: '最低价',
    dataIndex: 'minimum_price',
    width: 100,
    render: (text: string, record: any) => {
      if (record.is_set_minimum_price === '1' && text) {
        return `¥${text}`;
      }
      return '-';
    },
  },
  {
    title: '是否设置最低价',
    dataIndex: 'is_set_minimum_price',
    width: 120,
    render: (text: string) => (
      <Tag color={text === '1' ? 'success' : 'default'}>
        {text === '1' ? '是' : '否'}
      </Tag>
    ),
  },
  {
    title: '验收状态',
    dataIndex: 'is_accepted',
    width: 120,
    render: (text: boolean | undefined) => {
      if (text === undefined) return '-';
      return (
        <Tag color={text ? 'success' : 'default'}>
          {text ? '已验收' : '未验收'}
        </Tag>
      );
    },
  },
  {
    title: '分配的工匠',
    dataIndex: 'assigned_craftsman_id',
    width: 200,
    render: (craftsmanId: number | undefined, record: any) => {
      if (!craftsmanId) return '-';
      // 显示工匠信息（昵称和手机号）
      if (record.assigned_craftsman) {
        return (
          <Tag color="blue">
            {record.assigned_craftsman.nickname} (
            {record.assigned_craftsman.phone})
          </Tag>
        );
      }
      // 向后兼容：如果没有工匠详细信息，只显示ID
      return <Tag color="blue">已分配 (ID: {craftsmanId})</Tag>;
    },
  },
  {
    title: '支付状态',
    dataIndex: 'is_paid',
    width: 100,
    render: (isPaid: boolean | undefined) => {
      if (isPaid === undefined) return '-';
      return (
        <Tag color={isPaid ? 'success' : 'default'}>
          {isPaid ? '已支付' : '未支付'}
        </Tag>
      );
    },
  },
];

// 工价列表表格列定义（子工价，不包含验收状态）
export const subPriceListColumns: ColumnsType<any> = [
  {
    title: '工价ID',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: '工种ID',
    dataIndex: 'work_kind_id',
    width: 80,
  },
  {
    title: '工种',
    dataIndex: ['work_kind', 'work_kind_name'],
    width: 100,
  },
  {
    title: '工价标题',
    dataIndex: 'work_title',
    width: 150,
    ellipsis: true,
  },
  {
    title: '单价',
    dataIndex: 'work_price',
    width: 100,
    render: (text: string) => `¥${text}`,
  },
  {
    title: '单位ID',
    dataIndex: ['labour_cost', 'id'],
    width: 80,
  },
  {
    title: '单位',
    dataIndex: ['labour_cost', 'labour_cost_name'],
    width: 100,
  },
  {
    title: '数量',
    dataIndex: 'quantity',
    width: 80,
  },
  {
    title: '小计',
    dataIndex: 'work_price',
    width: 100,
    render: (text: string, record: any) => {
      const total = Number(text) * Number(record.quantity);
      return `¥${total.toFixed(2)}`;
    },
  },
  {
    title: '最低价',
    dataIndex: 'minimum_price',
    width: 100,
    render: (text: string, record: any) => {
      if (record.is_set_minimum_price === '1' && text) {
        return `¥${text}`;
      }
      return '-';
    },
  },
  {
    title: '是否设置最低价',
    dataIndex: 'is_set_minimum_price',
    width: 120,
    render: (text: string) => (
      <Tag color={text === '1' ? 'success' : 'default'}>
        {text === '1' ? '是' : '否'}
      </Tag>
    ),
  },
  {
    title: '支付状态',
    dataIndex: 'is_paid',
    width: 100,
    render: (isPaid: boolean | undefined) => {
      if (isPaid === undefined) return '-';
      return (
        <Tag color={isPaid ? 'success' : 'default'}>
          {isPaid ? '已支付' : '未支付'}
        </Tag>
      );
    },
  },
];
