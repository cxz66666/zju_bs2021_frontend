import React from 'react';
import styles from './index.less';
import {
  Form,
  Select,
  InputNumber,
  Switch,
  Radio,
  Slider,
  Button,
  Upload,
  Rate,
  Checkbox,
  Row,
  Col,
  Input,
} from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { querySetting, updateSetting } from '../service';
import { useRequest } from 'umi';
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const normFile = (e) => {
  console.log('Upload event:', e);

  if (Array.isArray(e)) {
    return e;
  }

  return e && e.fileList;
};

const Demo = () => {
  const onFinish = async (values) => {
    console.log('Received values of form: ', values);
    try {
      let res = await updateSetting(values);
      if (res.status != 'success') {
        notification.error({
          duration: 4,
          message: '更新失败',
          description: '请自行排查http请求',
        });
      } else {
        notification.success({
          duration: 4,
          message: '更新成功',
        });
        return;
      }
    } catch (error) {
      notification.error({
        duration: 4,
        message: '更新失败',
        description: res.msg,
      });
    }
    refreshSetting();
  };
  const [form] = Form.useForm();
  const {
    data: settings,
    run: refreshSetting,
    loading: loadingSetting,
  } = useRequest(() => {
    return querySetting();
  });
  return (
    <>
      {loadingSetting ? null : (
        <Form
          name="validate_other"
          {...formItemLayout}
          onFinish={onFinish}
          initialValues={{ ...settings }}
        >
          <Form.Item name="type" label="存储类型">
            <Radio.Group>
              <Radio value={1}>后端本地存储</Radio>
              <Radio value={2}>OSS存储</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="backendPath" label="后端存储路径" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="region" label="OSS区域" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="accessKeyId" label="AccessKeyId" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="accessKeySecret" label="AccessKeySecret" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="bucket" label="Bucket" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="ossPath" label="OSS路径" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              span: 12,
              offset: 6,
            }}
          >
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Form.Item>
        </Form>
      )}
    </>
  );
};

export default () => (
  <div className={styles.container}>
    <div id="components-form-demo-validate-other">
      <Demo />
    </div>
  </div>
);
