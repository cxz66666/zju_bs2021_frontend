import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, List, Typography, Row, Col, message, Tag } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { useRequest, useAccess, Access, history } from 'umi';
import { queryList } from './service';
import styles from './style.less';
const { Paragraph } = Typography;

const ListCardList = () => {
  const { data: listData, loading } = useRequest(() => {
    return queryList({
      pageSize: 10000,
      current: 0,
    });
  });

  const ProjectType = (type) => {
    if (!type) {
      return <Tag color="red">未知类型</Tag>;
    }
    switch (type) {
      case 1:
        return <Tag color="green">已经创建</Tag>;
      case 2:
        return <Tag color="blue">正在开工</Tag>;
      case 3:
        return <Tag color="purple">等待审核</Tag>;
      case 4:
        return <Tag color="gold">已完工</Tag>;
      default:
        return <Tag color="blue">未使用</Tag>;
    }
  };
  const list = listData?.data || [];
  const projectNum = listData?.number || 0;
  const participateNum = listData?.joined || 0;
  const Info = ({ title, value, bordered }) => (
    <div className={styles.headerInfo}>
      <span>{title}</span>
      <p>{value}</p>
      {bordered && <em />}
    </div>
  );
  const DetailNum = (
    <Card bordered={false}>
      <Row>
        <Col sm={8} xs={24}>
          <Info title="总项目数" value={projectNum} bordered />
        </Col>
        <Col sm={8} xs={24}>
          <Info title="我参与的项目数" value={participateNum} bordered />
        </Col>
        <Col sm={8} xs={24}>
          <Info title="" value="" />
        </Col>
      </Row>
    </Card>
  );
  const content = (
    <div className={styles.pageHeaderContent}>
      <p>
        这里是各个标记任务的内容，如果您已被管理员分配了标记任务，在该页面可以选择任务并查看详情。
      </p>
      {loading ? null : DetailNum}
    </div>
  );
  const extraContent = (
    <div className={styles.extraImg}>
      <img
        alt="这是一个标题"
        src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png"
      />
    </div>
  );
  const access = useAccess();
  const nullData = {};
  return (
    <PageContainer content={content} extraContent={extraContent}>
      <div className={styles.cardList}>
        <List
          rowKey="id"
          loading={loading}
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 4,
            xxl: 4,
          }}
          dataSource={[nullData, ...list]}
          renderItem={(item) => {
            if (item && item.id) {
              return (
                <List.Item key={item.id}>
                  <Card
                    hoverable
                    className={styles.card}
                    actions={[
                      <Button
                        danger={item.type === 1}
                        key="toDetail"
                        type="link"
                        onClick={(e) => {
                          if (item.type === 1 && !access.canAdmin) {
                            message.error('该项目暂未开放，请联系项目管理员开放该项目');
                            return;
                          }

                          history.push('/project/detail/' + item.id);
                        }}
                      >
                        查看详情
                      </Button>,
                      <Button
                        key="wait"
                        type="text"
                        onClick={(e) => {
                          message.info('该功能正在开发中');
                        }}
                      >
                        待定
                      </Button>,
                    ]}
                  >
                    <Card.Meta
                      avatar={
                        <img
                          alt=""
                          className={styles.cardAvatar}
                          src="https://i.loli.net/2021/10/27/kJWcOx3RA6GwFEV.jpg"
                        />
                      }
                      title={
                        <>
                          <a href={'/project/detail/' + item.id}>{item.name} </a>
                          {'   '}
                          {ProjectType(item.type)}
                        </>
                      }
                      description={
                        <>
                          <div className={styles.cardInfo}>
                            <div>
                              <p>图片数量</p>
                              <p>{item.imagesNum}</p>
                            </div>
                            <div>
                              <p>标注数量</p>
                              <p>{item.annotationNum}</p>
                            </div>
                            <div>
                              <p>参与人数</p>
                              <p>{item.workerNum}</p>
                            </div>
                          </div>
                          <Paragraph
                            className={styles.item}
                            ellipsis={{
                              rows: 3,
                            }}
                          >
                            {item.description}
                          </Paragraph>
                        </>
                      }
                    />
                  </Card>
                </List.Item>
              );
            }

            return (
              <List.Item>
                <Button
                  type="dashed"
                  className={styles.newButton}
                  onClick={(e) => {
                    if (access.canAdmin) {
                      history.push(`/project/create`);
                      return;
                    }
                    message.error('对不起，您没有相应的权限');
                  }}
                >
                  <PlusOutlined /> 新增产品
                </Button>
              </List.Item>
            );
          }}
        />
      </div>
    </PageContainer>
  );
};

export default ListCardList;
