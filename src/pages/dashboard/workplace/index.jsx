import { Avatar, Card, Col, List, Skeleton, Row, Statistic } from 'antd';
import { Radar } from '@ant-design/charts';
import { Link, useRequest, useModel } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import moment from 'moment';
import EditableLinkGroup from './components/EditableLinkGroup';
import styles from './style.less';
import { queryProjectNotice, queryActivities, fakeChartData } from './service';
const links = [
  {
    title: '创建tag',
    href: '/tag/tag-list',
  },
  {
    title: '上传图片',
    href: '/upload/image',
  },
];

const PageHeaderContent = ({ currentUser }) => {
  const loading = currentUser && Object.keys(currentUser).length;

  if (!loading) {
    return (
      <Skeleton
        avatar
        paragraph={{
          rows: 1,
        }}
        active
      />
    );
  }

  return (
    <div className={styles.pageHeaderContent}>
      <div className={styles.avatar}>
        <Avatar
          size="large"
          src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
        />
      </div>
      <div className={styles.content}>
        <div className={styles.contentTitle}>
          早安，
          {currentUser.userName}
          ，祝你满绩每一天！
        </div>
        <div>
          {currentUser.userEmail} |{currentUser.userPhone}
        </div>
      </div>
    </div>
  );
};

const ExtraContent = (props) => (
  <div className={styles.extraContent}>
    <div className={styles.statItem}>
      <Statistic title="项目总数" value={props.data?.proejcts ? props.data.proejcts.length : 0} />
    </div>
    <div className={styles.statItem}>
      <Statistic
        title="团队排名"
        value={1}
        suffix={`/  ${props.data?.totalUser ? props.data.totalUser : 0}`}
      />
    </div>
    <div className={styles.statItem}>
      <Statistic
        title="参与项目"
        value={props.data?.participateNum ? props.data.participateNum : 0}
      />
    </div>
  </div>
);

const Workplace = () => {
  const {
    initialState: { currentUser: currentUser },
    loading,
    refresh,
    setInitialState,
  } = useModel('@@initialState');

  const { loading: projectLoading, data: projectNotice = {} } = useRequest(queryProjectNotice);
  const { loading: activitiesLoading, data: activities = [] } = queryActivities();
  const data = fakeChartData();
  console.log(data);
  const renderActivities = (item) => {
    const events = item.template.split(/@\{([^{}]*)\}/gi).map((key) => {
      if (item[key]) {
        return (
          <a href={item[key].link} key={item[key].name}>
            {item[key].name}
          </a>
        );
      }

      return key;
    });
    return (
      <List.Item key={item.id}>
        <List.Item.Meta
          avatar={<Avatar src={item.user.avatar} />}
          title={
            <span>
              <a className={styles.username}>{item.user.name}</a>
              &nbsp;
              <span className={styles.event}>{events}</span>
            </span>
          }
          description={
            <span className={styles.datetime} title={item.updatedAt}>
              {moment(item.updatedAt).fromNow()}
            </span>
          }
        />
      </List.Item>
    );
  };

  return (
    <>
      {loading || projectLoading ? null : (
        <PageContainer
          content={<PageHeaderContent currentUser={currentUser} />}
          extraContent={<ExtraContent data={projectNotice} />}
        >
          <Row gutter={24}>
            <Col xl={16} lg={24} md={24} sm={24} xs={24}>
              <Card
                className={styles.projectList}
                style={{
                  marginBottom: 24,
                }}
                title="进行中的项目"
                bordered={false}
                extra={<Link to="/project/list">全部项目</Link>}
                loading={projectLoading}
                bodyStyle={{
                  padding: 0,
                }}
              >
                {projectNotice.proejcts.map((item) => (
                  <Card.Grid className={styles.projectGrid} key={item.id}>
                    <Card
                      bodyStyle={{
                        padding: 0,
                      }}
                      bordered={false}
                    >
                      <Card.Meta
                        title={
                          <div className={styles.cardTitle}>
                            <Avatar
                              size="small"
                              src={
                                'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'
                              }
                            />
                            <Link to={'/project/detail/' + item.id}>{item.name}</Link>
                          </div>
                        }
                        description={item.description}
                      />
                      <div className={styles.projectItemContent}>
                        <Link to={'/project/detail/' + item.id}>
                          {'图片总数' + item.images.length}
                        </Link>
                        {item.createdTime && (
                          <span className={styles.datetime} title={item.createdTime}>
                            {moment(item.createdTime).fromNow()}
                          </span>
                        )}
                      </div>
                    </Card>
                  </Card.Grid>
                ))}
              </Card>
              <Card
                bodyStyle={{
                  padding: 0,
                }}
                bordered={false}
                className={styles.activeCard}
                title="动态（静态数据）"
                loading={activitiesLoading}
              >
                <List
                  loading={activitiesLoading}
                  renderItem={(item) => renderActivities(item)}
                  dataSource={activities}
                  className={styles.activitiesList}
                  size="large"
                />
              </Card>
            </Col>
            <Col xl={8} lg={24} md={24} sm={24} xs={24}>
              <Card
                style={{
                  marginBottom: 24,
                }}
                title="快速开始 / 便捷导航"
                bordered={false}
                bodyStyle={{
                  padding: 0,
                }}
              >
                <EditableLinkGroup links={links} />
              </Card>
              <Card
                style={{
                  marginBottom: 24,
                }}
                bordered={false}
                title="工作指数（静态数据）"
                loading={data?.radarData?.length === 0}
              >
                <div className={styles.chart}>
                  <Radar
                    height={343}
                    data={data?.radarData || []}
                    angleField="label"
                    seriesField="name"
                    radiusField="value"
                    area={{
                      visible: false,
                    }}
                    point={{
                      visible: true,
                    }}
                    legend={{
                      position: 'bottom-center',
                    }}
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </PageContainer>
      )}
    </>
  );
};

export default Workplace;
