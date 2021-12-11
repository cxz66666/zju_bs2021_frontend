import {
  ModalForm,
  ProFormSelect,
  ProFormDateTimePicker,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { Form, Input, Popover, Row, Col, Select, Progress, Modal } from 'antd';
import styles from '../style.less';
import { Button, Result } from 'antd';
import { useState, useEffect } from 'react';
const { Option } = Select;
const InputGroup = Input.Group;

const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <span>强度：强</span>
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <span>强度：中</span>
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <span>强度：太短</span>
    </div>
  ),
};
const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 20,
      offset: 4,
    },
  },
};
const OperationModal = (props) => {
  const { done, visible, current, onDone, onSubmit } = props;
  const [popover, setPopover] = useState(false);
  const confirmDirty = false;
  const [form] = Form.useForm();
  let interval;

  useEffect(
    () => () => {
      clearInterval(interval);
    },
    [interval],
  );

  const getPasswordStatus = () => {
    const value = form.getFieldValue('userSecret');

    if (value && value.length > 9) {
      return 'ok';
    }

    if (value && value.length > 5) {
      return 'pass';
    }

    return 'poor';
  };
  const checkConfirm = (_, value) => {
    const promise = Promise;
    console.log(value, form.getFieldsValue(true));
    if (value && value !== form.getFieldValue('userSecret')) {
      return promise.reject('两次输入的密码不匹配!');
    }

    return promise.resolve();
  };
  const checkPassword = (_, value) => {
    const promise = Promise; // 没有值的情况

    if (!value) {
      setVisible(!!value);
      return promise.reject('请输入密码!');
    } // 有值的情况

    if (!visible) {
      setVisible(!!value);
    }

    setPopover(!popover);

    if (value.length < 6) {
      return promise.reject('');
    }

    if (value && confirmDirty) {
      form.validateFields(['confirm']);
    }

    return promise.resolve();
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    </Form.Item>
  );
  const renderPasswordProgress = () => {
    const value = form.getFieldValue('userSecret');
    const passwordStatus = getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };
  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      title={'添加用户'}
      className={styles.standardListForm}
      width={640}
      closable
      onOk={onDone}
      onCancel={onDone}
    >
      {!done ? (
        <>
          <Form
            {...formItemLayout}
            form={form}
            onFinish={onSubmit}
            initialValues={{
              ...current,
              prefix: '86',
            }}
            scrollToFirstError
          >
            <Form.Item
              name="userEmail"
              label="邮箱"
              rules={[
                {
                  required: true,
                  message: '请输入邮箱地址!',
                },
                {
                  type: 'email',
                  message: '邮箱地址格式错误!',
                },
              ]}
            >
              <Input size="large" placeholder="邮箱" />
            </Form.Item>
            <Popover
              getPopupContainer={(node) => {
                if (node && node.parentNode) {
                  return node.parentNode;
                }

                return node;
              }}
              content={
                visible && (
                  <div
                    style={{
                      padding: '4px 0',
                    }}
                  >
                    {passwordStatusMap[getPasswordStatus()]}
                    {renderPasswordProgress()}
                    <div
                      style={{
                        marginTop: 10,
                      }}
                    >
                      <span>请至少输入 6 个字符。请不要使用容易被猜到的密码。</span>
                    </div>
                  </div>
                )
              }
              overlayStyle={{
                width: 240,
              }}
              placement="right"
              visible={visible}
            >
              <Form.Item
                name="userSecret"
                label="密码"
                className={
                  form.getFieldValue('userSecret') &&
                  form.getFieldValue('userSecret').length > 0 &&
                  styles.password
                }
                rules={[
                  {
                    validator: checkPassword,
                  },
                ]}
              >
                <Input size="large" type="password" placeholder="至少6位密码，区分大小写" />
              </Form.Item>
            </Popover>
            <Form.Item
              name="confirm"
              label="确认密码"
              rules={[
                {
                  required: true,
                  message: '请输入密码',
                },
                {
                  validator: checkConfirm,
                },
              ]}
            >
              <Input size="large" type="password" placeholder="确认密码" />
            </Form.Item>

            <Form.Item
              name="userName"
              label="用户名"
              tooltip="该用户名和邮箱同时为唯一标识符，请谨慎选择"
              rules={[{ required: true, message: '请输入你的用户名', whitespace: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="userPhone"
              label="手机号"
              rules={[
                { required: true, message: '请输入手机号' },
                {
                  type: '',
                },
              ]}
            >
              <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item {...tailFormItemLayout}>
              <Button size="large" type="primary" htmlType="submit">
                <span>注册</span>
              </Button>
            </Form.Item>
          </Form>
        </>
      ) : (
        <Result
          status="success"
          title="操作成功"
          subTitle="一系列的信息描述，很短同样也可以带标点。"
          extra={
            <Button type="primary" onClick={onDone}>
              知道了
            </Button>
          }
          className={styles.formResult}
        />
      )}
    </Modal>
  );
};

export default OperationModal;
