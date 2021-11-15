import { PageContainer } from '@ant-design/pro-layout';
import { useState, useEffect } from 'react';
import { Spin, Button, Row, Statistic } from 'antd';
import styles from './index.less';
import ListInfiniteLoad from './ListInfiniteLoad';
export default () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
  return (
    <PageContainer
      title="预览公共区域图片"
      content={
        <Row>
          <Statistic title="Status" value="Pending" />
          <Statistic
            title="Price"
            prefix="$"
            value={568.08}
            style={{
              margin: '0 32px',
            }}
          />
          <Statistic title="Balance" prefix="$" value={3345.08} />
        </Row>
      }
      className={styles.main}
    >
      <ListInfiniteLoad />
      <div
        style={{
          paddingTop: 100,
          textAlign: 'center',
        }}
      >
        <Spin spinning={loading} size="large" />
      </div>
    </PageContainer>
  );
};
