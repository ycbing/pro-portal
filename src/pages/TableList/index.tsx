import { listProduct } from '@/services/ant-design-pro/api';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import React, { useRef } from 'react';

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: 'Lv1类目名称',
      dataIndex: 'lv1',
    },
    {
      title: 'Lv2类目名称',
      dataIndex: 'lv2',
    },
    {
      title: 'Lv3类目名称',
      dataIndex: 'lv3',
    },
    {
      title: 'Lv4类目名称',
      dataIndex: 'lv4',
    },
    {
      title: '子平台',
      dataIndex: 'subPlatform',
    },
    {
      title: '时间',
      dataIndex: 'dateTime',
    },
    {
      title: '月',
      dataIndex: 'month',
    },
    {
      title: '销量',
      dataIndex: 'sales',
    },
    {
      title: '销售额',
      dataIndex: 'salesVolume',
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.RuleListItem, API.PageParams>
        headerTitle="数据表格"
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={false}
        request={listProduct}
        columns={columns}
      />
    </PageContainer>
  );
};

export default TableList;
