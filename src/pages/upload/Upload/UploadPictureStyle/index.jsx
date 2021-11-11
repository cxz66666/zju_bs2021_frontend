import React from 'react';
import styles from './index.less';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
const fileList = [
  {
    uid: '-1',
    name: 'xxx.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    uid: '-2',
    name: 'yyy.png',
    status: 'error',
  },
];
const props2 = {
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  listType: 'picture',
  defaultFileList: [...fileList],
  className: 'upload-list-inline',
  beforeUpload: (file) => {
    if (file.type !== 'image/png' && file.type != 'image/jpeg') {
      message.error(`${file.name} is not a image file`);
    }
    return file.type === 'image/png' || file.type == 'image/jpeg' ? true : Upload.LIST_IGNORE;
  },
  multiple: true,
};
export default () => (
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
