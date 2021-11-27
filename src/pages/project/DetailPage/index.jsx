import {
  DingdingOutlined,
  DownOutlined,
  EllipsisOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Statistic,
  Descriptions,
  Divider,
  Dropdown,
  Menu,
  Popover,
  Steps,
  Table,
  Tooltip,
  Empty,
  Modal,
  Select,
} from 'antd';
import { GridContent, PageContainer, RouteContext } from '@ant-design/pro-layout';
import React, { Fragment, useState } from 'react';
import classNames from 'classnames';
import { useRequest } from 'umi';
import { queryAdvancedProfile, QueryProject } from './service';
import moment from 'moment';

import styles from './style.less';
const { Step } = Steps;
const ProjectStatus = {
  1: '已经创建',
  2: '正在开工',
  3: '等待审核',
  4: '已完工',
};
const ButtonGroup = Button.Group;
const mobileMenu = (
  <Menu>
    <Menu.Item key="1">改变状态</Menu.Item>
    <Menu.Item key="2">删除</Menu.Item>
  </Menu>
);
const action = (
  <RouteContext.Consumer>
    {({ isMobile }) => {
      if (isMobile) {
        return (
          <Dropdown.Button
            type="primary"
            icon={<DownOutlined />}
            overlay={mobileMenu}
            placement="bottomRight"
          >
            选择操作
          </Dropdown.Button>
        );
      }

      return (
        <Fragment>
          <ButtonGroup>
            <Button>改变状态</Button>
            <Button>删除</Button>
          </ButtonGroup>
          <Button type="primary">保留操作</Button>
        </Fragment>
      );
    }}
  </RouteContext.Consumer>
);
const extra = (project) => (
  <div className={styles.moreInfo}>
    <Statistic title="状态" value={ProjectStatus[project.type]} />
  </div>
);
const description = (project) => (
  <RouteContext.Consumer>
    {({ isMobile }) => (
      <Descriptions className={styles.headerList} size="small" column={isMobile ? 1 : 2}>
        <Descriptions.Item label="项目ID">{project?.id}</Descriptions.Item>
        <Descriptions.Item label="创建人">{project?.creator?.UserName}</Descriptions.Item>
        <Descriptions.Item label="项目简述">{project?.description}</Descriptions.Item>
        <Descriptions.Item label="创建时间">
          {moment(project?.createdTime).format('llll')}
        </Descriptions.Item>

        <Descriptions.Item label="参与者数">{project?.workers.length}</Descriptions.Item>
        <Descriptions.Item label="标注数">{project?.annotations.length}</Descriptions.Item>
      </Descriptions>
    )}
  </RouteContext.Consumer>
);
const desc1 = (project) => (
  <div className={classNames(styles.textSecondary, styles.stepDescription)}>
    <Fragment>
      {project?.creator.UserName}
      <DingdingOutlined
        style={{
          marginLeft: 8,
        }}
      />
    </Fragment>
    <div>{moment(project?.createdTime).format('ll')}</div>
  </div>
);
const desc2 = (project) => (
  <div className={styles.stepDescription}>
    <Fragment>
      {project?.creator.UserName}
      <DingdingOutlined
        style={{
          color: '#00A0E9',
          marginLeft: 8,
        }}
      />
    </Fragment>
  </div>
);
const popoverContent = (
  <div
    style={{
      width: 160,
    }}
  >
    吴加号
    <span
      className={styles.textSecondary}
      style={{
        float: 'right',
      }}
    >
      <Badge
        status="default"
        text={
          <span
            style={{
              color: 'rgba(0, 0, 0, 0.45)',
            }}
          >
            未响应
          </span>
        }
      />
    </span>
    <div
      className={styles.textSecondary}
      style={{
        marginTop: 4,
      }}
    >
      耗时：2小时25分钟
    </div>
  </div>
);

const customDot = (dot, { status }) => {
  if (status === 'process') {
    return (
      <Popover placement="topLeft" arrowPointAtCenter content={popoverContent}>
        <span>{dot}</span>
      </Popover>
    );
  }

  return dot;
};

const operationTabList = [
  {
    key: 'tab1',
    tab: '操作日志一',
  },
  {
    key: 'tab2',
    tab: '操作日志二',
  },
  {
    key: 'tab3',
    tab: '操作日志三',
  },
];
const columns = [
  {
    title: '操作类型',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '操作人',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '执行结果',
    dataIndex: 'status',
    key: 'status',
    render: (text) => {
      if (text === 'agree') {
        return <Badge status="success" text="成功" />;
      }

      return <Badge status="error" text="驳回" />;
    },
  },
  {
    title: '操作时间',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
  },
  {
    title: '备注',
    dataIndex: 'memo',
    key: 'memo',
  },
];

const DetailPage = (props) => {
  const [tabStatus, seTabStatus] = useState({
    operationKey: 'tab1',
    tabActiveKey: 'detail',
  });

  const [changeStatusVisible, setChangeStatusVisible] = useState(false);
  const { data = {}, loading } = useRequest(queryAdvancedProfile);
  const { advancedOperation1, advancedOperation2, advancedOperation3 } = data;
  const {
    data: currentProject,
    run: runProject,
    loading: loadingProject,
  } = useRequest(() => {
    return QueryProject(props.match.params.id);
  });
  const contentList = {
    tab1: (
      <Table
        pagination={false}
        loading={loading}
        dataSource={advancedOperation1}
        columns={columns}
      />
    ),
    tab2: (
      <Table
        pagination={false}
        loading={loading}
        dataSource={advancedOperation2}
        columns={columns}
      />
    ),
    tab3: (
      <Table
        pagination={false}
        loading={loading}
        dataSource={advancedOperation3}
        columns={columns}
      />
    ),
  };

  const onTabChange = (tabActiveKey) => {
    seTabStatus({ ...tabStatus, tabActiveKey });
  };

  const onOperationTabChange = (key) => {
    seTabStatus({ ...tabStatus, operationKey: key });
  };

  return (
    <>
      {loadingProject ? null : (
        <PageContainer
          title={'项目名称：' + currentProject?.name}
          extra={action}
          className={styles.pageHeader}
          content={description(currentProject)}
          extraContent={extra(currentProject)}
          tabActiveKey={tabStatus.tabActiveKey}
          onTabChange={onTabChange}
          tabList={[
            {
              key: 'detail',
              tab: '详情',
            },
            {
              key: 'image',
              tab: '图片',
            },
          ]}
        >
          <div className={styles.main}>
            <GridContent>
              <Card
                title="流程进度"
                style={{
                  marginBottom: 24,
                }}
              >
                <RouteContext.Consumer>
                  {({ isMobile }) => (
                    <Steps
                      direction={isMobile ? 'vertical' : 'horizontal'}
                      progressDot={customDot}
                      current={(currentProject?.type - 1) | 0}
                    >
                      <Step title="已经创建" description={desc1(currentProject)} />
                      <Step title="正在开工" description={desc2(currentProject)} />
                      <Step title="等待审核" />
                      <Step title="已完成" />
                    </Steps>
                  )}
                </RouteContext.Consumer>
              </Card>
              <Card
                title="用户信息"
                style={{
                  marginBottom: 24,
                }}
                bordered={false}
              >
                <Descriptions
                  style={{
                    marginBottom: 24,
                  }}
                >
                  <Descriptions.Item label="用户姓名">付小小</Descriptions.Item>
                  <Descriptions.Item label="会员卡号">32943898021309809423</Descriptions.Item>
                  <Descriptions.Item label="身份证">3321944288191034921</Descriptions.Item>
                  <Descriptions.Item label="联系方式">18112345678</Descriptions.Item>
                  <Descriptions.Item label="联系地址">
                    曲丽丽 18100000000 浙江省杭州市西湖区黄姑山路工专路交叉路口
                  </Descriptions.Item>
                </Descriptions>
                <Descriptions
                  style={{
                    marginBottom: 24,
                  }}
                  title="信息组"
                >
                  <Descriptions.Item label="某某数据">725</Descriptions.Item>
                  <Descriptions.Item label="该数据更新时间">2017-08-08</Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <span>
                        某某数据
                        <Tooltip title="数据说明">
                          <InfoCircleOutlined
                            style={{
                              color: 'rgba(0, 0, 0, 0.43)',
                              marginLeft: 4,
                            }}
                          />
                        </Tooltip>
                      </span>
                    }
                  >
                    725
                  </Descriptions.Item>
                  <Descriptions.Item label="该数据更新时间">2017-08-08</Descriptions.Item>
                </Descriptions>
                <h4
                  style={{
                    marginBottom: 16,
                  }}
                >
                  信息组
                </h4>
                <Card type="inner" title="多层级信息组">
                  <Descriptions
                    style={{
                      marginBottom: 16,
                    }}
                    title="组名称"
                  >
                    <Descriptions.Item label="负责人">林东东</Descriptions.Item>
                    <Descriptions.Item label="角色码">1234567</Descriptions.Item>
                    <Descriptions.Item label="所属部门">XX公司 - YY部</Descriptions.Item>
                    <Descriptions.Item label="过期时间">2017-08-08</Descriptions.Item>
                    <Descriptions.Item label="描述">
                      这段描述很长很长很长很长很长很长很长很长很长很长很长很长很长很长...
                    </Descriptions.Item>
                  </Descriptions>
                  <Divider
                    style={{
                      margin: '16px 0',
                    }}
                  />
                  <Descriptions
                    style={{
                      marginBottom: 16,
                    }}
                    title="组名称"
                    column={1}
                  >
                    <Descriptions.Item label="学名">
                      Citrullus lanatus (Thunb.) Matsum. et
                      Nakai一年生蔓生藤本；茎、枝粗壮，具明显的棱。卷须较粗..
                    </Descriptions.Item>
                  </Descriptions>
                  <Divider
                    style={{
                      margin: '16px 0',
                    }}
                  />
                  <Descriptions title="组名称">
                    <Descriptions.Item label="负责人">付小小</Descriptions.Item>
                    <Descriptions.Item label="角色码">1234568</Descriptions.Item>
                  </Descriptions>
                </Card>
              </Card>
              <Card
                title="用户近半年来电记录"
                style={{
                  marginBottom: 24,
                }}
                bordered={false}
              >
                <Empty />
              </Card>
              <Card
                className={styles.tabsCard}
                bordered={false}
                tabList={operationTabList}
                onTabChange={onOperationTabChange}
              >
                {contentList[tabStatus.operationKey]}
              </Card>
            </GridContent>
          </div>
        </PageContainer>
      )}

      {loadingProject && changeStatusVisible && (
        <Modal
          title="改变状态"
          visible={changeStatusVisible}
          onOk={this.onCsModalOk}
          onCancel={this.onCsModalCancel}
        >
          <Select
            defaultValue={
              this.state.changeState.status === -1
                ? this.props.fixupDetails.status
                : this.state.changeState.status
            }
            onChange={this.onCsModalSelectChange}
            style={{ width: 150 }}
          >
            <Select.Option value={1}>已经创建</Select.Option>
            <Select.Option value={2}>正在开工</Select.Option>
            <Select.Option value={3}>等待审核</Select.Option>
            <Select.Option value={4}>已完成</Select.Option>
          </Select>
        </Modal>
      )}
    </>
  );
};

export default DetailPage;
