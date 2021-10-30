import {
  AlipayCircleOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import { Alert, message, notification, Tabs } from 'antd';
import React, { useState } from 'react';
import { ProFormCaptcha, ProFormCheckbox, ProFormText, LoginForm } from '@ant-design/pro-form';
import { useIntl, history, FormattedMessage, SelectLang, useModel, Link } from 'umi';
import Footer from '@/components/Footer';
import { login } from '@/services/ant-design-pro/api';
import { getFakeCaptcha } from '@/services/ant-design-pro/login';
import styles from './index.less';

const LoginMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login = () => {
  const [userLoginState, setUserLoginState] = useState({});
  const [type, setType] = useState('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const intl = useIntl();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();

    if (userInfo) {
      await setInitialState((s) => ({ ...s, currentUser: userInfo }));
    }
  };

  const handleSubmit = async (values) => {
    try {
      // 登录
      const msg = await login({ ...values, type });

      if (msg.status === 'success') {
        const defaultLoginSuccessMessage = '登陆成功';
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        /** 此方法会跳转到 redirect 参数所在的位置 */

        if (!history) return;
        const { query } = history.location;
        const { redirect } = query;
        history.push(redirect || '/');
        return;
      }

      console.log(msg); // 如果失败去设置用户错误信息

      setUserLoginState(msg);
      message.error(msg.msg || '账号或密码错误');
    } catch (error) {
      const defaultLoginFailureMessage = '登录失败，请重试';
      message.error(defaultLoginFailureMessage);
    }
  };

  const { status, msg, type: loginType } = userLoginState;
  return (
    <div className={styles.container}>
      <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang />}
      </div>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src="/logo.svg" />}
          title="Annotation OL"
          subTitle="Annotation OL是32舍最好用的图片标注网站"
          initialValues={{
            autoLogin: true,
          }}
          actions={[
            <FormattedMessage id="123" key="loginWith" defaultMessage="其他登录方式" />,
            <AlipayCircleOutlined
              key="AlipayCircleOutlined"
              className={styles.icon}
              onClick={(e) => message.info('暂时不支持该登陆方式，敬请期待')}
            />,
            <TaobaoCircleOutlined
              key="TaobaoCircleOutlined"
              className={styles.icon}
              onClick={(e) => message.info('暂时不支持该登陆方式，敬请期待')}
            />,
            <WeiboCircleOutlined
              key="WeiboCircleOutlined"
              className={styles.icon}
              onClick={(e) => '暂时不支持该登陆方式，敬请期待'}
            />,
          ]}
          onFinish={async (values) => {
            await handleSubmit(values);
          }}
        >
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane key="account" tab="用户名登录" />
            <Tabs.TabPane key="email" tab="邮箱登录" />
          </Tabs>

          {status === 'error' && loginType === 'account' && (
            <LoginMessage content={msg || '用户名或密码错误'} />
          )}
          {type === 'account' && (
            <>
              <ProFormText
                name="account"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder="用户名"
                rules={[
                  {
                    required: true,
                    message: <FormattedMessage id="23" defaultMessage="请输入用户名!" />,
                  },
                ]}
              />
              <ProFormText.Password
                name="secret"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder="密码"
                rules={[
                  {
                    required: true,
                    message: <FormattedMessage id="23" defaultMessage="请输入密码！" />,
                  },
                ]}
              />
            </>
          )}

          {status === 'error' && loginType === 'email' && (
            <LoginMessage content={msg || '邮箱或密码错误'} />
          )}
          {type === 'email' && (
            <>
              <ProFormText
                name="email"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder="邮箱"
                rules={[
                  {
                    required: true,
                    message: <FormattedMessage id="23" defaultMessage="请输入用户名!" />,
                  },
                ]}
              />
              <ProFormText.Password
                name="secret"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder="密码"
                rules={[
                  {
                    required: true,
                    message: <FormattedMessage id="23" defaultMessage="请输入密码！" />,
                  },
                ]}
              />
            </>
          )}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />
            </ProFormCheckbox>
            <div
              style={{
                float: 'right',
              }}
            >
              <Link to="/user/register" style={{ marginRight: 12 }}>
                <FormattedMessage id="pages.login.createAccount" defaultMessage="创建用户" />
              </Link>
              <a>
                <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码" />
              </a>
            </div>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
