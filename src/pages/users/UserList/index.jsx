import React, { useState } from 'react';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  Dropdown,
  Input,
  List,
  Menu,
  Modal,
  notification,
  Progress,
  Radio,
  Row,
  Tag,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { useRequest } from 'umi';
import moment from 'moment';
import OperationModal from './components/OperationModal';
import { Register, ListUser, DeleteUser, ChangeRole, QueryNum } from './service';
import styles from './style.less';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

const Info = ({ title, value, bordered }) => (
  <div className={styles.headerInfo}>
    <span>{title}</span>
    <p>{value}</p>
    {bordered && <em />}
  </div>
);

const ListContent = ({ data: { userType, userPhone } }) => (
  <div className={styles.listContent}>
    <div className={styles.listContentItem}>
      {userType == 1 ? (
        <Tag color="blue">普通用户</Tag>
      ) : userType == 2 ? (
        <Tag color="green">管理员用户</Tag>
      ) : (
        <Tag color="red">系统管理员</Tag>
      )}
    </div>
    <div className={styles.listContentItem}>
      <span>手机号</span>
      <p>{userPhone}</p>
    </div>
  </div>
);

export const UserList = () => {
  const [done, setDone] = useState(false);
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(undefined);
  const {
    data: listData,
    run: refreshList,
    loading: listLoading,
    mutate,
  } = useRequest(() => {
    return ListUser();
  });

  const list = listData?.data || [];
  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    pageSize: 10,
    total: list.length,
  };

  const showEditModal = (item) => {
    setVisible(true);
    setCurrent(item);
  };

  const deleteItem = async (id) => {
    try {
      let msg = await DeleteUser({ id });
      if (msg.status == 'success') {
        notification.success({
          duration: 4,
          message: '删除成功',
          description: '删除成功',
        });
      } else {
        notification.error({
          duration: 4,
          message: '删除失败',
          description: '用户已经参与了项目，不可进行删除',
        });
      }
      await refreshList();
      await refreshNum();
    } catch (error) {
      notification.error({
        duration: 4,
        message: '删除失败',
        description: msg.msg,
      });
    }
  };

  const MoreHandler = async (key, currentItem) => {
    if (key === 'changeType') {
      try {
        let msg = await ChangeRole({
          userId: currentItem.userId || -1,
          userType: currentItem.userType > 1 ? 1 : 2,
        });
        if (msg.status == 'success') {
          notification.success({
            duration: 4,
            message: '更改成功',
            description: '更改成功',
          });
        } else {
          notification.error({
            duration: 4,
            message: '更改失败',
            description: '修改失败，请联系系统管理员',
          });
        }
        await refreshList();
        await refreshNum();
      } catch (error) {
        notification.error({
          duration: 4,
          message: '更改失败',
          description: msg.msg,
        });
      }
      return;
    }
  };
  const {
    data: currentNum,
    run: refreshNum,
    loading: loadingNum,
  } = useRequest(() => {
    return QueryNum();
  });

  const extraContent = (
    <div className={styles.extraContent}>
      <RadioGroup defaultValue="all">
        <RadioButton value="all">全部</RadioButton>
        <RadioButton value="admin">管理员</RadioButton>
        <RadioButton value="normal">普通用户</RadioButton>
      </RadioGroup>
      <Search className={styles.extraContentSearch} placeholder="请输入" onSearch={() => ({})} />
    </div>
  );

  const MoreBtn = ({ item }) => (
    <Dropdown
      overlay={
        <Menu onClick={({ key }) => MoreHandler(key, item)}>
          <Menu.Item key="changeType">
            {item.userType == 1 ? '提升为管理员' : '改为普通用户'}
          </Menu.Item>
        </Menu>
      }
    >
      <a>
        更多 <DownOutlined />
      </a>
    </Dropdown>
  );

  const handleDone = () => {
    setDone(false);
    setVisible(false);
    setCurrent({});
  };

  const handleSubmit = async (values) => {
    //注意这里要取消cookie，否则register会带着cookie返回
    values.noCookie = true;
    try {
      let res = await Register(values);
      if (res.status != 'success') {
        notification.error({
          duration: 4,
          message: '增加失败',
          description: '添加用户失败，请自行排查http请求',
        });
      } else {
        notification.success({
          duration: 4,
          message: '增加成功',
        });
        setDone(true);
        refreshList();
        refreshNum();
      }
    } catch (error) {
      console.log(error);
      notification.error({
        duration: 4,
        message: '增加失败',
        description: error,
      });
    }
  };

  return (
    <div>
      <PageContainer>
        <div className={styles.standardList}>
          {loadingNum ? null : (
            <Card bordered={false}>
              <Row>
                <Col sm={8} xs={24}>
                  <Info title="总用户" value={currentNum.total} bordered />
                </Col>
                <Col sm={8} xs={24}>
                  <Info title="普通用户" value={currentNum.normal} bordered />
                </Col>
                <Col sm={8} xs={24}>
                  <Info title="管理员用户" value={currentNum.admin} />
                </Col>
              </Row>
            </Card>
          )}

          <Card
            className={styles.listCard}
            bordered={false}
            title="用户列表"
            style={{
              marginTop: 24,
            }}
            bodyStyle={{
              padding: '0 32px 40px 32px',
            }}
            extra={extraContent}
          >
            <List
              size="large"
              rowKey="id"
              loading={listLoading}
              pagination={paginationProps}
              dataSource={list}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <a
                      key="edit"
                      onClick={(e) => {
                        e.preventDefault();
                        deleteItem(item.userId || -1);
                      }}
                    >
                      删除
                    </a>,
                    <MoreBtn key="more" item={item} />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src="https://i.loli.net/2021/10/27/kJWcOx3RA6GwFEV.jpg"
                        shape="square"
                        size="large"
                      />
                    }
                    title={item.userName}
                    description={item.userEmail}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
      </PageContainer>
      <Button
        type="dashed"
        onClick={() => {
          setVisible(true);
        }}
        style={{
          width: '100%',
          marginBottom: 8,
        }}
      >
        <PlusOutlined />
        添加
      </Button>
      <OperationModal
        done={done}
        visible={visible}
        current={current}
        onDone={handleDone}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
export default UserList;
