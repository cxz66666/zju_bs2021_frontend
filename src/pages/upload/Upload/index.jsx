import { PageContainer } from '@ant-design/pro-layout';
import { useState, useEffect } from 'react';
import { Spin, Row, Col } from 'antd';
import styles from './index.less';
import UploadPictureStyle from './UploadPictureStyle';
import UploadDrag from './UploadDrag';
import AlertDescription from './AlertDescription';
import AlertDescriptionTwo from './AlertDescriptionTwo';
export default (props) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
  return (
    <PageContainer
      content="在此处上传的图片会统一保存到公共图片区域，上传后可以在图片查看中查看"
      className={styles.main}
    >
      <AlertDescription />
      <UploadPictureStyle id={props?.id ? props.id : 0} />
      <AlertDescriptionTwo />

      <UploadDrag id={props?.id ? props.id : 0} />

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
