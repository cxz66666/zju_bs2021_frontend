import React from 'react';
import styles from './index.less';
import { Alert } from 'antd';
export default () => (
  <div className={styles.container}>
    <div id="components-alert-demo-description">
      <div
        style={{
          marginTop: 200,
        }}
      >
        <Alert
          message="上传视频"
          description="目前只支持mp4格式的视频上传，请确保上传的视频格式正确"
          type="warning"
        />
      </div>
    </div>
  </div>
);
