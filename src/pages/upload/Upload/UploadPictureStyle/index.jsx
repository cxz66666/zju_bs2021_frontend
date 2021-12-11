import React from 'react';
import styles from './index.less';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

export default (props) => {
  const props2 = {
    action: '/api/upload/image',
    listType: 'picture',
    className: 'upload-list-inline',
    beforeUpload: (file) => {
      if (file.type !== 'image/png' && file.type != 'image/jpeg') {
        message.error(`${file.name} is not a image file`);
      }
      return file.type === 'image/png' || file.type == 'image/jpeg' ? true : Upload.LIST_IGNORE;
    },
    name: 'images',
    data: {
      id: props?.id || 0,
    },
    multiple: true,
    accept: '.jpg,.png,.jpeg',
    onPreview: async (file) => {
      let src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });

      const image = new Image();
      image.src = src;
      const imgWindow = window.open(src);
      imgWindow.document.write(image.outerHTML);
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }

      if (props.refresh && info.fileList.every((r) => r.status == 'done')) {
        props.refresh();
      }
    },
  };
  return (
    <div className={styles.container}>
      <div id="components-upload-demo-picture-style">
        <div>
          <br />
          <Upload {...props2}>
            <Button>
              <UploadOutlined /> Upload
            </Button>
          </Upload>
        </div>
      </div>
    </div>
  );
};
