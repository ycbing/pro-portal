import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Row, Col, Card, Statistic } from 'antd';
import React from 'react';
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

// 数据源
const data = [
  {
    month: 'Jan',
    city: 'Tokyo',
    temperature: 7,
  },
  {
    month: 'Jan',
    city: 'London',
    temperature: 3.9,
  },
  {
    month: 'Feb',
    city: 'Tokyo',
    temperature: 13,
  },
  {
    month: 'Feb',
    city: 'London',
    temperature: 4.2,
  },
  {
    month: 'Mar',
    city: 'Tokyo',
    temperature: 16.5,
  },
  {
    month: 'Mar',
    city: 'London',
    temperature: 5.7,
  },
  {
    month: 'Apr',
    city: 'Tokyo',
    temperature: 14.5,
  },
  {
    month: 'Apr',
    city: 'London',
    temperature: 8.5,
  },
  {
    month: 'May',
    city: 'Tokyo',
    temperature: 10,
  },
  {
    month: 'May',
    city: 'London',
    temperature: 11.9,
  },
  {
    month: 'Jun',
    city: 'Tokyo',
    temperature: 7.5,
  },
  {
    month: 'Jun',
    city: 'London',
    temperature: 15.2,
  },
  {
    month: 'Jul',
    city: 'Tokyo',
    temperature: 9.2,
  },
  {
    month: 'Jul',
    city: 'London',
    temperature: 17,
  },
  {
    month: 'Aug',
    city: 'Tokyo',
    temperature: 14.5,
  },
  {
    month: 'Aug',
    city: 'London',
    temperature: 16.6,
  },
  {
    month: 'Sep',
    city: 'Tokyo',
    temperature: 9.3,
  },
  {
    month: 'Sep',
    city: 'London',
    temperature: 14.2,
  },
  {
    month: 'Oct',
    city: 'Tokyo',
    temperature: 8.3,
  },
  {
    month: 'Oct',
    city: 'London',
    temperature: 10.3,
  },
  {
    month: 'Nov',
    city: 'Tokyo',
    temperature: 8.9,
  },
  {
    month: 'Nov',
    city: 'London',
    temperature: 5.6,
  },
  {
    month: 'Dec',
    city: 'Tokyo',
    temperature: 5.6,
  },
  {
    month: 'Dec',
    city: 'London',
    temperature: 9.8,
  },
];

const newData = [
  { item: '事例一', count: 40, percent: 0.4 },
  { item: '事例二', count: 21, percent: 0.21 },
  { item: '事例三', count: 17, percent: 0.17 },
  {
    item: '事例四xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxYYYY',
    count: 13,
    percent: 0.13,
  },
  { item: '事例五', count: 9, percent: 0.09 },
];

const cols = {
  percent: {
    formatter: (val: any) => {
      const newVal = val * 100 + '%';
      return newVal;
    },
  },
};

const Dashboard: React.FC = () => {
  return (
    <PageContainer>
      <Row gutter={16}>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Active"
              value={11.28}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Active"
              value={11.28}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Active"
              value={11.28}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Idle"
              value={9.3}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowDownOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>
      <Chart padding={[10, 20, 50, 40]} autoFit height={300} data={data}>
        <h1>1111</h1>
        <LineAdvance shape="smooth" point area position="month*temperature" color="city" />
      </Chart>
      <Chart
        height={400}
        data={newData}
        scale={cols}
        autoFit
        onIntervalClick={(e: any) => {
          e.target.cfg.element.getStates(); // 如果是选中，值为['selected'];取消选中，值为[]
        }}
        onGetG2Instance={(c: any) => {
          console.log(c.getXY(newData[0]));
        }}
      >
        <Coordinate type="theta" radius={0.75} />
        <Tooltip showTitle={false} />
        <Axis visible={false} />
        <Interval
          position="percent"
          adjust="stack"
          color="item"
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
                return `${data.item}: ${data.percent * 100}%`;
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
    </PageContainer>
  );
};

export default Dashboard;
