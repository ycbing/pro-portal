import {
  listProduct,
  listLv1,
  listLv2,
  listLv3,
  listLv4,
  listSubPlatform,
} from '@/services/ant-design-pro/api';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import React, { useRef, useEffect, useState } from 'react';

const transformedObject = (arr: string[]) => {
  const newObject = arr.reduce((acc: { [key: string]: any }, key) => {
    acc[key] = { text: key };
    return acc;
  }, {});
  return newObject;
};

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [lv1, setLv1] = useState<string[]>([]);
  const [lv2, setLv2] = useState<string[]>([]);
  const [lv3, setLv3] = useState<string[]>([]);
  const [lv4, setLv4] = useState<string[]>([]);
  const [subPlatform, setSubPlatform] = useState<string[]>([]);

  const loadData = async () => {
    const lv1List = await listLv1();
    setLv1(lv1List);
    const subPlatformList = await listSubPlatform();
    setSubPlatform(subPlatformList);
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadLv2 = async (lv1: string) => {
    const lv2List = await listLv2(lv1);
    setLv2(lv2List);
  };

  const loadLv3 = async (lv2: string) => {
    const lv3List = await listLv3(lv2);
    setLv3(lv3List);
  };

  const loadLv4 = async (lv3: string) => {
    const lv4List = await listLv4(lv3);
    setLv3(lv4List);
  };

  const columns: ProColumns<API.ProductListItem>[] = [
    {
      title: 'Lv1类目名称',
      dataIndex: 'lv1',
      valueType: 'select',
      valueEnum: transformedObject(lv1),
      fieldProps: {
        onChange: (value: string) => {
          setLv2([]);
          setLv3([]);
          setLv4([]);
          if (value) {
            loadLv2(value);
          }
        },
      },
    },
    {
      title: 'Lv2类目名称',
      dataIndex: 'lv2',
      valueType: 'select',
      valueEnum: transformedObject(lv2),
      fieldProps: {
        onChange: (value: string) => {
          setLv3([]);
          setLv4([]);
          if (value) {
            loadLv3(value);
          }
        },
      },
    },
    {
      title: 'Lv3类目名称',
      dataIndex: 'lv3',
      valueType: 'select',
      valueEnum: transformedObject(lv3),
      fieldProps: {
        onChange: (value: string) => {
          setLv4([]);
          if (value) {
            loadLv4(value);
          }
        },
      },
    },
    {
      title: 'Lv4类目名称',
      dataIndex: 'lv4',
      valueType: 'select',
      valueEnum: transformedObject(lv4),
    },
    {
      title: '子平台',
      dataIndex: 'subPlatform',
      valueType: 'select',
      valueEnum: transformedObject(subPlatform),
    },
    {
      title: '时间',
      dataIndex: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '月',
      dataIndex: 'month',
      hideInSearch: true,
    },
    {
      title: '销量',
      dataIndex: 'sales',
      hideInSearch: true,
    },
    {
      title: '销售额',
      dataIndex: 'salesVolume',
      hideInSearch: true,
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.ProductListItem, API.PageParams>
        headerTitle="数据表格"
        actionRef={actionRef}
        rowKey="_id"
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
