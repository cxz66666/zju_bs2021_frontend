import React from 'react';
import styles from './index.less';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
const { Dragger } = Upload;

export default (props) => {
  const props2 = {
    name: 'file',
    multiple: true,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',

    onChange(info) {
      const { status } = info.file;

      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }

      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  return (
    <div className={styles.container}>
      <div id="components-upload-demo-drag">
        <Dragger {...props2}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到该区域内</p>
          <p className="ant-upload-hint">
            注意请不要在此处上传图片文件！请在上方上传图片处进行图片上传
          </p>
        </Dragger>
      </div>
    </div>
  );
};
