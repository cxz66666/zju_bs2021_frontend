import { PageContainer } from '@ant-design/pro-layout';
import { useState, useEffect } from 'react';
import { Spin, Row, Col } from 'antd';
import styles from './index.less';
import UploadPictureStyle from './UploadPictureStyle';
import UploadDrag from './UploadDrag';
export default () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
  return (
    <PageContainer content="这是一个新页面，从这里进行开发！" className={styles.main}>
      <UploadPictureStyle />

      <div
        style={{
          marginTop: 200,
        }}
      >
        <UploadDrag />
      </div>

      <div
        style={{
          paddingTop: 100,
          textAlign: 'center',
        }}
      >
        <Row gutter={[16, 16]}>
          <Col span={12} />
          <Col span={12} />
        </Row>
        <Spin spinning={loading} size="large" />
      </div>
    </PageContainer>
  );
};
