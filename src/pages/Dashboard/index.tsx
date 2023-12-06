import { PageContainer, QueryFilter, ProFormSelect } from '@ant-design/pro-components';
import { Card, Statistic, Result } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  Chart,
  LineAdvance,
  Coordinate,
  Interval,
  Tooltip,
  Axis,
  Interaction,
  getTheme,
} from 'bizcharts';
import {
  getStatBySubPlatform,
  listLv1,
  listLv2,
  listLv3,
  listLv4,
  listProduct,
} from '@/services/ant-design-pro/api';

const cols = {
  percent: {
    formatter: (val: any) => {
      const newVal = val * 100 + '%';
      return newVal;
    },
  },
};

const Dashboard: React.FC = () => {
  const [subPlatformStat, setSubPlatformStat] = useState<
    {
      _id: string;
      totalSales: number;
      totalSalesVolume: number;
    }[]
  >([]);
  const [lv1, setLv1] = useState<string[]>([]);
  const [lv2, setLv2] = useState<string[]>([]);
  const [lv3, setLv3] = useState<string[]>([]);
  const [lv4, setLv4] = useState<string[]>([]);
  const [lineXAxis, setLineXAxis] = useState<string[]>([]);
  const [chartData, setChartData] = useState<API.ProductListItem[] | undefined>([]);
  const [salesPieChartData, setSalesPieChartData] = useState<
    {
      subPlatform: string;
      sales: number;
      percent: number;
    }[]
  >([]);
  const [salesVolumePieChartData, setSalesVolumePieChartData] = useState<
    {
      subPlatform: string;
      salesVolume: number;
      percent: number;
    }[]
  >([]);

  const loadData = async () => {
    const subPlatformStatRes = await getStatBySubPlatform();
    setSubPlatformStat(subPlatformStatRes);
    const lv1List = await listLv1();
    setLv1(lv1List);
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
    setLv4(lv4List);
  };
  const genPieChartData = (data: API.ProductListItem[] | undefined) => {
    const pieDataObj = new Map();
    let allSales = 0;
    let allSalesVolume = 0;
    data?.forEach(({ subPlatform, sales, salesVolume }) => {
      allSales += sales;
      allSalesVolume += salesVolume;
      if (pieDataObj.has(subPlatform)) {
        pieDataObj.get(subPlatform).sales += sales;
        pieDataObj.get(subPlatform).salesVolume += salesVolume;
      } else {
        pieDataObj.set(subPlatform, {
          subPlatform,
          sales,
          salesVolume,
        });
      }
    });
    const salesPieDataList = [...pieDataObj.values()].map(({ subPlatform, sales }) => ({
      subPlatform,
      sales,
      percent: sales / allSales,
    }));
    const salesVolumePieDataList = [...pieDataObj.values()].map(({ subPlatform, salesVolume }) => ({
      subPlatform,
      salesVolume,
      percent: salesVolume / allSalesVolume,
    }));
    setSalesPieChartData(salesPieDataList);
    setSalesVolumePieChartData(salesVolumePieDataList);
  };

  const searchDetail = async (data: { [key: string]: string }) => {
    const res = await listProduct({ pageSize: 1000000, current: 1, ...data });
    setChartData(res.data?.sort((a, b) => +a.month - +b.month));
    const lineXAxis = [...new Set(res.data?.map((i) => i.month))].sort();
    setLineXAxis(lineXAxis);
    genPieChartData(res.data);
  };

  return (
    <PageContainer>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
          gap: 10,
          justifyContent: 'space-between',
          marginBottom: 10,
        }}
      >
        {subPlatformStat.map(({ _id, totalSales, totalSalesVolume }) => (
          <Card key={_id} size="small" title={_id} extra={null}>
            <Statistic title="总销量" value={totalSales} />
            <Statistic title="总销售额" value={totalSalesVolume} />
          </Card>
        ))}
      </div>
      <Card>
        <QueryFilter
          defaultCollapsed={false}
          split={false}
          labelWidth={100}
          onFinish={searchDetail}
        >
          <ProFormSelect
            name="lv1"
            label="Lv1类目名称"
            options={lv1}
            onChange={(value: string) => {
              if (value) {
                loadLv2(value);
              }
            }}
          />
          <ProFormSelect
            name="lv2"
            label="Lv2类目名称"
            options={lv2}
            onChange={(value: string) => {
              if (value) {
                loadLv3(value);
              }
            }}
          />
          <ProFormSelect
            name="lv3"
            label="Lv3类目名称"
            options={lv3}
            onChange={(value: string) => {
              if (value) {
                loadLv4(value);
              }
            }}
          />
          <ProFormSelect name="lv4" label="Lv4类目名称" options={lv4} />
        </QueryFilter>
        {chartData && chartData?.length > 0 ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '60% 40%', marginBottom: 40 }}>
              <Chart padding={[10, 20, 60, 50]} autoFit height={400} data={chartData}>
                <h3>201901-202304 销量图</h3>
                <LineAdvance
                  shape={['x', lineXAxis]}
                  point
                  area
                  position="month*sales"
                  color="subPlatform"
                />
              </Chart>
              <Chart
                height={400}
                data={salesPieChartData}
                scale={{
                  percent: {
                    formatter: (val: any) => {
                      const newVal = val * 100 + '%';
                      return newVal;
                    },
                  },
                }}
                autoFit
                onIntervalClick={(e: any) => {
                  e.target.cfg.element.getStates(); // 如果是选中，值为['selected'];取消选中，值为[]
                }}
                onGetG2Instance={(c: any) => {
                  console.log(c.getXY(salesPieChartData[0]));
                }}
              >
                <Coordinate type="theta" radius={0.75} />
                <Tooltip showTitle={false} />
                <Axis visible={false} />
                <Interval
                  position="percent"
                  adjust="stack"
                  color="subPlatform"
                  style={{
                    lineWidth: 1,
                    stroke: '#fff',
                  }}
                  label={[
                    'count',
                    {
                      // label 太长自动截断
                      layout: { type: 'limit-in-plot', cfg: { action: 'ellipsis' } },
                      content: (data) => {
                        return `${data.subPlatform}: ${data.percent * 100}%`;
                      },
                    },
                  ]}
                  state={{
                    selected: {
                      style: (t) => {
                        const res = getTheme().geometries.interval.rect.selected.style(t);
                        return { ...res, fill: 'red' };
                      },
                    },
                  }}
                />
                <Interaction type="element-single-selected" />
              </Chart>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '60% 40%', marginBottom: 40 }}>
              <Chart padding={[10, 20, 60, 50]} autoFit height={400} data={chartData}>
                <h3>201901-202304 销量额图</h3>
                <LineAdvance
                  shape={['x', lineXAxis]}
                  point
                  area
                  position="month*salesVolume"
                  color="subPlatform"
                />
              </Chart>
              <Chart
                height={400}
                data={salesVolumePieChartData}
                scale={cols}
                autoFit
                onIntervalClick={(e: any) => {
                  e.target.cfg.element.getStates(); // 如果是选中，值为['selected'];取消选中，值为[]
                }}
                onGetG2Instance={(c: any) => {
                  console.log(c.getXY(salesVolumePieChartData[0]));
                }}
              >
                <Coordinate type="theta" radius={0.75} />
                <Tooltip showTitle={false} />
                <Axis visible={false} />
                <Interval
                  position="percent"
                  adjust="stack"
                  color="subPlatform"
                  style={{
                    lineWidth: 1,
                    stroke: '#fff',
                  }}
                  label={[
                    'count',
                    {
                      // label 太长自动截断
                      layout: { type: 'limit-in-plot', cfg: { action: 'ellipsis' } },
                      content: (data) => {
                        return `${data.subPlatform}: ${data.percent * 100}%`;
                      },
                    },
                  ]}
                  state={{
                    selected: {
                      style: (t) => {
                        const res = getTheme().geometries.interval.rect.selected.style(t);
                        return { ...res, fill: 'red' };
                      },
                    },
                  }}
                />
                <Interaction type="element-single-selected" />
              </Chart>
            </div>
          </>
        ) : (
          <Result title="暂无数据" subTitle="请筛选后查询，查询条件具体到 Lv3 或 Lv4 类目" />
        )}
      </Card>
    </PageContainer>
  );
};

export default Dashboard;
