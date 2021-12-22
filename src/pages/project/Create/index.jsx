import { CloseCircleOutlined } from '@ant-design/icons';
import { Card, Col, Popover, Row, message, Select, notification } from 'antd';
import { useState, useRef, useEffect } from 'react';
import ProForm, {
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
  ProFormTimePicker,
} from '@ant-design/pro-form';
import ProTable, { EditableProTable } from '@ant-design/pro-table';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { SubmitForm, QueryTags, QueryUsers } from './service';
import { useRequest, history } from 'umi';

import styles from './style.less';
const fieldLabels = {
  name: '项目名称',
  description: '详细描述',
  classId: '标记类名',
  userId: '添加协作者',
};

const Create = () => {
  const [error, setError] = useState([]);
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    ref.current?.reload();
  }, [userData]);
  const getErrorInfo = (errors) => {
    const errorCount = errors.filter((item) => item.errors.length > 0).length;

    if (!errors || errorCount === 0) {
      return null;
    }

    const scrollToField = (fieldKey) => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);

      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };

    const errorList = errors.map((err) => {
      if (!err || err.errors.length === 0) {
        return null;
      }

      const key = err.name[0];
      return (
        <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
          <CloseCircleOutlined className={styles.errorIcon} />
          <div className={styles.errorMessage}>{err.errors[0]}</div>
          <div className={styles.errorField}>{fieldLabels[key]}</div>
        </li>
      );
    });

    return (
      <span className={styles.errorIcon}>
        <Popover
          title="表单校验信息"
          content={errorList}
          overlayClassName={styles.errorPopover}
          trigger="click"
          getPopupContainer={(trigger) => {
            if (trigger && trigger.parentNode) {
              return trigger.parentNode;
            }

            return trigger;
          }}
        >
          <CloseCircleOutlined />
        </Popover>
        {errorCount}
      </span>
    );
  };

  const onFinish = async (values) => {
    if (userData.length === 0) {
      message.error({
        duration: 4,
        content: '至少选择一名协作者',
      });
      return;
    }
    console.log(values);
    setError([]);
    let userList = userData.map((r) => {
      return r.userId;
    });
    values.userList = userList;
    try {
      let res = await SubmitForm(values);
      if (res.status != 'success') {
        notification.error({
          duration: 4,
          message: '创建错误',
          content: '创建任务失败，请联系系统管理员',
        });
        return;
      }

      //submit success
      message.success('提交成功,跳转中');
      //TODO
      history.push('/project/detail/' + res.data.id);
    } catch (error) {
      notification.error({
        duration: 4,
        message: '创建错误',
        content: error,
      });
    }
  };
  const { data: currentTag, loading: loadingTag } = useRequest(() => {
    return QueryTags();
  });
  const { data: currentUser, loading: loadingUser } = useRequest(() => {
    return QueryUsers();
  });
  const onFinishFailed = (errorInfo) => {
    setError(errorInfo.errorFields);
  };
  const ref = useRef();
  const columns = [
    {
      title: '成员姓名',
      dataIndex: 'userName',
      key: 'userName',
      width: '20%',
    },
    {
      title: '邮箱',
      dataIndex: 'userEmail',
      key: 'userEmail',
      width: '20%',
    },
    {
      title: '手机',
      dataIndex: 'userPhone',
      key: 'userPhone',
      width: '40%',
    },
    {
      title: '操作',
      key: 'action',
      valueType: 'option',
      render: (_, record, index, action) => {
        return [
          <a
            key="delete"
            onClick={() => {
              setUserData(userData.filter((r) => r.userId != record.userId));
            }}
          >
            删除
          </a>,
        ];
      },
    },
  ];
  return (
    <>
      {loadingTag | loadingUser ? null : (
        <ProForm
          layout="vertical"
          hideRequiredMark
          submitter={{
            render: (props, dom) => {
              return (
                <FooterToolbar>
                  {getErrorInfo(error)}
                  {dom}
                </FooterToolbar>
              );
            },
          }}
          initialValues={{}}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <PageContainer content="从这里开始创建一个任务">
            <Card title="任务管理" className={styles.card} bordered={false}>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <ProFormText
                    label={fieldLabels.name}
                    name="name"
                    rules={[
                      {
                        required: true,
                        max: 20,
                        message: '请输入',
                      },
                    ]}
                  />
                </Col>
                <Col
                  xl={{
                    span: 6,
                    offset: 2,
                  }}
                  lg={{
                    span: 8,
                  }}
                  md={{
                    span: 12,
                  }}
                  sm={24}
                >
                  <ProFormText
                    label={fieldLabels.description}
                    name="description"
                    rules={[
                      {
                        required: true,
                        max: 50,
                        message: '请选择',
                      },
                    ]}
                  />
                </Col>
                <Col
                  xl={{
                    span: 8,
                    offset: 2,
                  }}
                  lg={{
                    span: 10,
                  }}
                  md={{
                    span: 24,
                  }}
                  sm={24}
                >
                  <ProFormSelect
                    allowClear
                    autoClearSearchValue
                    label={fieldLabels.classId}
                    name="classId"
                    rules={[
                      {
                        required: true,
                        message: '请选择类名',
                      },
                    ]}
                    options={currentTag}
                  />
                </Col>
              </Row>
            </Card>
            <Card title="成员管理" bordered={false}>
              <Row gutter={16}>
                <Col
                  xl={{
                    span: 8,
                  }}
                  lg={{
                    span: 10,
                  }}
                  md={{
                    span: 24,
                  }}
                  sm={24}
                >
                  <ProFormSelect
                    label={fieldLabels.userId}
                    allowClear={true}
                    autoClearSearchValue={true}
                    mode="tags"
                    options={
                      currentUser
                        ? currentUser.map((r) => {
                            return {
                              label: r.userName,
                              value: JSON.stringify(r),
                            };
                          })
                        : [
                            {
                              label: '未找到用户',
                              value: null,
                            },
                          ]
                    }
                    onChange={(e) => {
                      let t = e.map((r) => {
                        return JSON.parse(r);
                      });
                      setUserData(t);
                    }}
                  />
                </Col>
              </Row>
              <ProTable
                search={false}
                request={(params, sorter, filter) => {
                  // 表单搜索项会从 params 传入，传递给后端接口。
                  return Promise.resolve({
                    data: userData,
                    success: true,
                  });
                }}
                actionRef={ref}
                columns={columns}
                rowKey="key"
              />
            </Card>
          </PageContainer>
        </ProForm>
      )}
    </>
  );
};

export default Create;
