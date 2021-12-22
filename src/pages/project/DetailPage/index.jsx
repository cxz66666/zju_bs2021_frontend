import {
  DingdingOutlined,
  DownOutlined,
  EllipsisOutlined,
  InfoCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
  DownloadOutlined,
  RollbackOutlined,
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
  Tag,
  Tooltip,
  Empty,
  Modal,
  Select,
  message,
  notification,
  InputNumber,
  Progress,
} from 'antd';
import { GridContent, PageContainer, RouteContext } from '@ant-design/pro-layout';
import React, { Fragment, useState } from 'react';
import classNames from 'classnames';
import { useRequest, useAccess, Access, history } from 'umi';
import {
  queryAdvancedProfile,
  QueryProject,
  ChangeStatus,
  ChooseNumber,
  ChangeRegion,
  ChangeAnnotationType,
  DeleteProject,
} from './service';
import UploadPictureStyle from '../../upload/Upload/UploadPictureStyle';
import UploadDrag from '../../upload/Upload/UploadDrag';
import AlertDescription from '../../upload/Upload/AlertDescription';
import AlertDescriptionTwo from '../../upload/Upload/AlertDescriptionTwo';
import ListInfiniteLoad from '../../upload/List/ListInfiniteLoad';
import ReactImageAnnotate from 'react-image-annotate';
import { exportCOCO, exportVOC } from './export';
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
const mobileMenu = (dispatch) => (
  <Menu
    onClick={(item) => {
      console.log(item);
      dispatch(parseInt(item.key));
    }}
  >
    <Menu.Item key="4">
      <SyncOutlined spin />
      刷新
    </Menu.Item>
    <Menu.Item key="1">改变状态</Menu.Item>
    <Menu.Item key="2">删除</Menu.Item>
    <Menu.Item key="3">开始标记</Menu.Item>
    <Menu.Item key="5">审核</Menu.Item>
    <Menu.Item key="6">导出</Menu.Item>
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
            overlay={mobileMenu(dispatch)}
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
              icon={<SyncOutlined spin />}
              onClick={(e) => {
                dispatch(4);
              }}
            >
              刷新
            </Button>
            <Button
              onClick={(e) => {
                dispatch(1);
              }}
            >
              改变状态
            </Button>
            <Button onClick={(e) => dispatch(2)}>删除</Button>
            <Button onClick={(e) => dispatch(5)}>审核</Button>
            <Button onClick={(e) => dispatch(6)}>导出</Button>
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
        <Descriptions.Item label="图片数量">{project?.images.length}</Descriptions.Item>
        <Descriptions.Item label="标签">
          <>
            {project?.class.tags.map((r) => (
              <Tag color={'blue'} key={r.id}>
                {r.content}
              </Tag>
            ))}
          </>
        </Descriptions.Item>
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

  const [selectedImage, setSelectedImage] = useState(0);

  //是否提交的时候保存
  const [uploadOnSave, setUploadOnSave] = useState(false);
  const [reviewOnWork, setReviewOnWork] = useState(false);

  //选择导出是否展示
  const [chooseExportVisiable, setchooseExportVisiable] = useState(false);
  //选择导出的格式
  const [chooseExportType, setChooseExportType] = useState(1);

  const access = useAccess();
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
        if (!access.canAdmin) {
          message.error('您没有相应的权限');
          return;
        }
        setChangeStatusVisible(true);
        break;
      case 2:
        if (!access.canAdmin) {
          message.error('您没有相应的权限');
          return;
        }
        //delete this project
        confirmDelete();
        break;
      case 3:
        if (currentProject.images.length - currentProject.annotations.length || 0) {
          setChooseNumVisible(true);
        } else {
          message.info('任务已经全部分配完了哦');
        }
        break;

      case 4:
        message.info('刷新ing');
        runProject();
        break;
      case 5:
        if (!access.canAdmin) {
          message.error('您没有相应的权限');
          return;
        }
        if (currentProject.images.length != currentProject.annotations.length) {
          message.error('存在未标注完的任务，请标注完后再进行审核');
          return;
        }
        if (currentProject.type != 3) {
          message.error('当前项目状态不为等待审核，请先修改项目状态后再开始');
          return;
        }
        setSelectedImage(0);
        setImages(
          currentProject.annotations
            .filter((r) => r.type === 0)
            .map((r) => {
              return {
                ...r,
                regions: JSON.parse(r.regions ? r.regions : '[]') || [],
                pixelSize: JSON.parse(r.pixelSize ? r.pixelSize : '{}') || {},
              };
            }),
        );
        setUploadOnSave(false);
        setReviewOnWork(true);
        onTabChange('work');
        break;

      case 6:
        if (currentProject?.type != 4) {
          message.error('当前项目状态不为已完成，请先完成审核后再进行');
          return;
        }
        setchooseExportVisiable(true);
        break;
      default:
        message.error({
          duration: 4,
          content: '未知的类型',
        });
    }
  };
  const confirmDelete = () => {
    Modal.confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: '您确认要删除该任务吗，该操作不可逆',
      okText: '确认',
      cancelText: '取消',
      onOk: async (e) => {
        try {
          let res = await DeleteProject(props.match.params.id);
          console.log(res);

          if (res.status != 'success') {
            notification.error({
              duration: 4,
              message: '删除失败',
              description: '任务删除失败，请查看控制台获取报错信息',
            });
          } else {
            notification.success({
              duration: 4,
              message: '删除成功',
            });
            history.push(`/project/list`);
            return;
          }
        } catch (error) {
          notification.error({
            duration: 4,
            message: '删除失败',
            description: error,
          });
        }
      },
    });
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
          content: '',
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

  const onCeModalOk = async () => {
    if (loadingProject || !currentProject) {
      message.error({
        duration: 4,
        content: '项目内容获取失败，请刷新重试',
      });
      return;
    }
    try {
      switch (chooseExportType) {
        case 1:
          exportCOCO(currentProject);
          break;
        case 2:
          exportVOC(currentProject);
          break;
        default:
          message.info('开发中');
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onCeModalCancel = () => {
    setchooseExportVisiable(false);
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
        setSelectedImage(0);
        setImages(
          ans.data.data.map((r) => {
            return {
              ...r,
              regions: JSON.parse(r.regions ? r.regions : '[]') || [],
              pixelSize: JSON.parse(r.pixelSize ? r.pixelSize : '{}') || {},
            };
          }),
        );
        setReviewOnWork(false);
        setUploadOnSave(true);
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
  const sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
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
      </GridContent>
    </div>
  );
  //查看某一个标注的内容，注意是只有一个，传进去的参数为一个annotation对象
  const onClickViewAnnotation = (annotation) => {
    setSelectedImage(0);
    setImages(
      [annotation].map((r) => {
        return {
          ...r,
          regions: JSON.parse(r.regions ? r.regions : '[]') || [],
          pixelSize: JSON.parse(r.pixelSize ? r.pixelSize : '{}') || {},
        };
      }),
    );
    if (access.canAdmin && annotation.type === 0) {
      setReviewOnWork(true);
    } else {
      setReviewOnWork(false);
    }
    setUploadOnSave(true);
    onTabChange('work');
  };
  const image = (
    <ListInfiniteLoad
      key="123"
      id={currentProject?.id ? currentProject.id : 0}
      map={currentProject?.annotationMap ? currentProject.annotationMap : {}}
      onClickView={onClickViewAnnotation}
    />
  );
  const upload = (
    <div className={styles.main}>
      <GridContent>
        <AlertDescription />
        <UploadPictureStyle
          id={currentProject?.id ? currentProject.id : 0}
          refresh={async (e) => {
            // await sleep(1000);
            // runProject();
          }}
        />
        <AlertDescriptionTwo />
        <UploadDrag
          id={currentProject?.id ? currentProject.id : 0}
          refresh={async (e) => {
            // await sleep(1000);
            // runProject();
          }}
        />
      </GridContent>
    </div>
  );
  const handleNext = () => {
    if (selectedImage === Images.length - 1) {
      message.info('已经是最后一个了');
      return;
    }
    setSelectedImage(selectedImage + 1);
  };
  const handlePrev = () => {
    if (selectedImage === 0) return;
    setSelectedImage(selectedImage - 1);
  };

  const work = (
    <div className={styles.main}>
      <div>
        共计：{Images.length || 0}, 当前:{selectedImage + 1}, 当前图片状态:
        {Images[selectedImage]?.type === 0 ? (
          <Tag color="blue">正在标记</Tag>
        ) : (
          <Tag color="red">审核通过</Tag>
        )}
        ，进度:
        <Button
          style={{ float: 'right', margin: 20 }}
          icon={<RollbackOutlined />}
          type="primary"
          shape="round"
          onClick={(e) => {
            onTabChange('image');
          }}
        >
          返回图片页
        </Button>
        {reviewOnWork ? (
          <Button
            style={{ float: 'right', margin: 20 }}
            shape="round"
            icon={<DownloadOutlined />}
            type="primary"
            onClick={async (e) => {
              let res = await ChangeAnnotationType({ ids: [Images[selectedImage].id], type: 3 });
              if (res.status != 'success') {
                message.error(res.msg);
              } else {
                message.success('修改成功');
                handleNext();
              }
            }}
          >
            通过
          </Button>
        ) : null}
      </div>
      <div>
        <Progress percent={(100 * (selectedImage + 1)) / Images.length} />
      </div>
      <ReactImageAnnotate
        labelImages
        hideClone
        hideSettings
        enabledTools={['select', 'create-point', 'create-box', 'create-polygon']}
        selectedImage={selectedImage}
        onNextImage={handleNext}
        onPrevImage={handlePrev}
        taskDescription={currentProject?.description || '缺少简述'}
        regionClsList={currentProject?.class?.tags.map((r) => r.content) || []}
        regionTagList={[]}
        images={Images}
        onExit={async (e) => {
          if (!uploadOnSave) {
            message.info('该页面保存操作无效！');
            return;
          }
          console.log(e);
          let data = e.images.map((r) => {
            return {
              id: r.id,
              regions: JSON.stringify(r.regions),
              pixelSize: JSON.stringify(r.pixelSize),
            };
          });
          try {
            //保存当前的region，注意需要将uploadOnSave设置为true时候才可以进行修改
            let ans = await ChangeRegion({ data: data });
            if (ans.status != 'success') {
              notification.error({
                duration: 4,
                description: '保存失败，请重试',
                message: '保存失败',
              });
            } else {
              notification.success({
                duration: 4,
                message: '保存成功',
              });
            }
          } catch (error) {
            notification.error({
              duration: 4,
              description: error,
              message: '保存失败',
            });
          }
          runProject();
          onTabChange('image');
        }}
      />
    </div>
  );
  const publicImage = (
    <ListInfiniteLoad key="456" id={0} pid={currentProject?.id ? currentProject.id : 0} />
  );
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
      {!loadingProject && chooseExportVisiable && (
        <Modal
          title="选择导出格式"
          visible={chooseExportVisiable}
          onOk={onCeModalOk}
          onCancel={onCeModalCancel}
        >
          <Select
            value={chooseExportType}
            onChange={(e) => setChooseExportType(e)}
            style={{ width: 150 }}
          >
            <Select.Option value={1}>COCO object格式</Select.Option>
            <Select.Option value={2}>VOC object格式</Select.Option>
          </Select>
        </Modal>
      )}
    </>
  );
};

export default DetailPage;
