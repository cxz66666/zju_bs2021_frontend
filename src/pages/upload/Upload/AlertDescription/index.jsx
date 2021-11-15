import React from 'react';
import styles from './index.less';
import { Alert } from 'antd';
export default () => (
  <div className={styles.container}>
    <div id="components-alert-demo-description">
      <div>
        <Alert
          message="上传图片"
          description="目前只支持png.jpg.jpeg格式的图片上传，请选择适合的图片"
          type="info"
        />
      </div>
    </div>
  </div>
);
