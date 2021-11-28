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
  message,
  notification,
  InputNumber,
} from 'antd';
import { GridContent, PageContainer, RouteContext } from '@ant-design/pro-layout';
import React, { Fragment, useState } from 'react';
import classNames from 'classnames';
import { useRequest } from 'umi';
import { queryAdvancedProfile, QueryProject, ChangeStatus, ChooseNumber } from './service';
import UploadPictureStyle from '../../upload/Upload/UploadPictureStyle';
import UploadDrag from '../../upload/Upload/UploadDrag';
import AlertDescription from '../../upload/Upload/AlertDescription';
import AlertDescriptionTwo from '../../upload/Upload/AlertDescriptionTwo';
import ListInfiniteLoad from '../../upload/List/ListInfiniteLoad';
import ReactImageAnnotate from 'react-image-annotate';

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
  <Menu
    onClick={(item, key) => {
      console.log(item, key);
    }}
  >
    <Menu.Item key="1">改变状态</Menu.Item>
    <Menu.Item key="2">删除</Menu.Item>
    <Menu.Item key="3">开始标记</Menu.Item>
  </Menu>
);
const action = (dispatch) => (
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
            <Button
              onClick={(e) => {
                dispatch(1);
              }}
            >
              改变状态
            </Button>
            <Button onClick={(e) => dispatch(2)}>删除</Button>
          </ButtonGroup>
          <Button onClick={(e) => dispatch(3)} type="primary">
            开始标记
          </Button>
        </Fragment>
      );
    }}
  </RouteContext.Consumer>
);
const extra = (project) => (
  <div className={styles.moreInfo}>
    <Statistic title="状态" value={ProjectStatus[project?.type]} />
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

const DetailPage = (props) => {
  const [tabStatus, seTabStatus] = useState({
    tabActiveKey: 'detail',
  });
  const [chooseNumVisible, setChooseNumVisible] = useState(false);
  const [choosedNumber, setChoosedNumber] = useState(1);
  const [changeStatusVisible, setChangeStatusVisible] = useState(false);
  const [Images, setImages] = useState([]);
  const [projectStatus, changeProjectStatus] = useState(1);
  const { data = {}, loading } = useRequest(queryAdvancedProfile);
  const { advancedOperation1, advancedOperation2, advancedOperation3 } = data;
  const {
    data: currentProject,
    run: runProject,
    loading: loadingProject,
  } = useRequest(
    () => {
      return QueryProject(props.match.params.id);
    },
    {
      onSuccess: (data, parma) => {
        if (!data) {
          message.error({
            duration: 4,
            content: '获取项目详情失败，请稍后重试',
          });
          return;
        }
        //注意修改当前的status状态
        changeProjectStatus(data.type);
      },
      onError: (error, parma) => {
        message.error({
          duration: 4,
          content: '获取项目详情失败，请稍后重试',
        });
      },
    },
  );
  const dispatch = (type) => {
    switch (type) {
      case 1:
        setChangeStatusVisible(true);
        break;
      case 2:
        //delete this project
        message.info({
          duration: 4,
          content: '点击删除',
        });
        break;
      case 3:
        if (currentProject.images.length - currentProject.annotations.length || 0) {
          setChooseNumVisible(true);
        } else {
          message.info('已经全部分配完了哦');
        }
        break;
      default:
        message.error({
          duration: 4,
          content: '未知的类型',
        });
    }
  };

  const onTabChange = (tabActiveKey) => {
    seTabStatus({ ...tabStatus, tabActiveKey });
  };

  const onCsModalOk = async () => {
    if (loadingProject || !currentProject) {
      message.error({
        duration: 4,
        content: '项目内容获取失败，请刷新重试',
      });
      return;
    }
    if (currentProject.type == projectStatus) {
      message.warn({
        duration: 4,
        content: '目前状态已经最新，无需更改',
      });
      return;
    }
    try {
      let res = await ChangeStatus(currentProject.id, { type: projectStatus });
      if (res.status == 'success') {
        notification.success({
          duration: 4,
          message: '修改成功',
          content: '修改成功',
        });
      } else {
        notification.error({
          duration: 4,
          message: '项目内容获取失败，请刷新重试',
          content: res.msg,
        });
      }
      setChangeStatusVisible(false);

      runProject();
    } catch (error) {
      notification.error({
        duration: 4,
        message: '项目内容获取失败，请刷新重试',
        content: res.msg,
      });
    }
  };

  const onCsModalCancel = () => {
    setChangeStatusVisible(false);
  };

  const onSnModalOk = async () => {
    if (
      choosedNumber == 0 ||
      choosedNumber > currentProject.images.length - currentProject.annotations.length
    ) {
      message.error('数量错误');
      return;
    }
    try {
      let ans = await ChooseNumber(currentProject.id, { num: choosedNumber });
      if (ans.status != 'success') {
        message.error(ans.msg);
      } else if (ans.data.number === 0) {
        message.warning('没有未完成的标注任务了');
      } else {
        setImages(
          ans.data.data.map((r) => {
            return {
              ...r,
              regions: JSON.parse(r.regions ? r.regions : '[]') || [],
            };
          }),
        );
        onTabChange('work');
      }
      setChooseNumVisible(false);
    } catch (error) {
      console.log(error);
      message.error('可能是网络错误');
      setChooseNumVisible(false);
    }
  };
  const onSnModalCancel = () => {
    setChooseNumVisible(false);
  };
  const detail = (
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
          title="参与者信息"
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
            <Descriptions.Item label="任务图片总数">
              {currentProject?.images.length}
            </Descriptions.Item>
            <Descriptions.Item label="标注总数">
              {currentProject?.annotations.length}
            </Descriptions.Item>
          </Descriptions>
          <Card type="inner" title="协作者完成情况">
            {currentProject?.workers ? (
              <>
                {currentProject.workers.map((r) => {
                  return (
                    <>
                      <Descriptions
                        style={{
                          marginBottom: 16,
                        }}
                        title={r.UserName}
                      >
                        <Descriptions.Item label="ID">{r.UserId}</Descriptions.Item>
                        <Descriptions.Item label="邮箱">{r.UserEmail}</Descriptions.Item>
                        <Descriptions.Item label="手机号">{r.UserPhone}</Descriptions.Item>
                        <Descriptions.Item label="提交标记数量">
                          {currentProject.annotations.reduce(
                            (a, v) => (v.workerId === r.UserId ? a + 1 : a),
                            0,
                          )}
                        </Descriptions.Item>
                      </Descriptions>
                      <Divider
                        style={{
                          margin: '16px 0',
                        }}
                      />
                    </>
                  );
                })}
              </>
            ) : null}
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
      </GridContent>
    </div>
  );
  const image = <ListInfiniteLoad id={currentProject?.id ? currentProject.id : 0} />;
  const upload = (
    <div className={styles.main}>
      <GridContent>
        <AlertDescription />
        <UploadPictureStyle id={currentProject?.id ? currentProject.id : 0} />
        <AlertDescriptionTwo />
        <UploadDrag id={currentProject?.id ? currentProject.id : 0} />
      </GridContent>
    </div>
  );

  const work = (
    <div className={styles.main}>
      <ReactImageAnnotate
        labelImages
        taskDescription={currentProject?.description || '缺少简述'}
        regionClsList={currentProject?.class?.tags.map((r) => r.content) || []}
        regionTagList={[]}
        images={Images}
        onExit={(e) => {
          console.log(e);
        }}
        hideSettings
        hideClone
      />
    </div>
  );
  const publicImage = <ListInfiniteLoad id={0} pid={currentProject?.id ? currentProject.id : 0} />;
  const content = {
    image: image,
    detail: detail,
    upload: upload,
    publicImage: publicImage,
    work: work,
  };
  return (
    <>
      {loadingProject ? null : (
        <PageContainer
          title={'项目名称：' + currentProject?.name}
          extra={action(dispatch)}
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
            {
              key: 'upload',
              tab: '上传图片',
              disabled: currentProject?.type === 1 ? false : true,
            },
            {
              key: 'publicImage',
              tab: '公共图片区',
              disabled: currentProject?.type === 1 ? false : true,
            },
          ]}
        >
          {content[tabStatus.tabActiveKey]}
        </PageContainer>
      )}

      {!loadingProject && changeStatusVisible && (
        <Modal
          title="改变状态"
          visible={changeStatusVisible}
          onOk={onCsModalOk}
          onCancel={onCsModalCancel}
        >
          <Select
            value={projectStatus}
            onChange={(e) => changeProjectStatus(e)}
            style={{ width: 150 }}
          >
            <Select.Option value={1}>已经创建</Select.Option>
            <Select.Option value={2}>正在开工</Select.Option>
            <Select.Option value={3}>等待审核</Select.Option>
            <Select.Option value={4}>已完成</Select.Option>
          </Select>
        </Modal>
      )}
      {!loadingProject && chooseNumVisible && (
        <Modal
          title="选择此次的数量"
          visible={chooseNumVisible}
          onOk={onSnModalOk}
          onCancel={onSnModalCancel}
        >
          <div>范围:1~{currentProject.images.length - currentProject.annotations.length || 0}</div>
          <InputNumber
            min={1}
            max={currentProject.images.length - currentProject.annotations.length || 0}
            value={choosedNumber}
            onChange={setChoosedNumber}
          />
        </Modal>
      )}
    </>
  );
};

export default DetailPage;
