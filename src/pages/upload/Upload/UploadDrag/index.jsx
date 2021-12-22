import React from 'react';
import styles from './index.less';
import { Upload, message, notification } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
const { Dragger } = Upload;

export default (props) => {
  const props2 = {
    name: 'videos',
    multiple: false,
    action: '/api/upload/video',
    accept: '.mp4',
    data: {
      id: props?.id || 0,
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }

      if (status === 'done') {
        if (info.file.response.status != 'success') {
          notification.error({
            duration: 5,
            message: '上传失败',
            description: '请稍后重试',
          });
        } else {
          notification.success({
            duration: 5,
            message: '上传成功',
            description: `${info.file.name} 总共生成 ${info.file.response.data} 张图片`,
          });
        }
      } else if (status === 'error') {
        notification.error({
          duration: 4,
          message: '上传失败',
          description: '未知原因',
        });
      }

      if (props.refresh && info.fileList.every((r) => r.status == 'done')) {
        props.refresh();
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
