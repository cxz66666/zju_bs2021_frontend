import { useIntl } from 'umi';
import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';
export default () => {
  const intl = useIntl();
  const defaultMessage = "ChenXuzheng, power by ant design pro"
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'Ant Design Pro',
          title: 'Ant Design Pro',
          href: 'https://pro.ant.design',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/cxz66666/zju_bs2021_frontend',
          blankTarget: true,
        },
        {
          key: 'raynor.top',
          title: 'raynor.top',
          href: 'https://raynor.top',
          blankTarget: true,
        },
      ]}
    />
  );
};
