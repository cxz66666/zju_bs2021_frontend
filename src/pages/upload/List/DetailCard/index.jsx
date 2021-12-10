import React from 'react';

import ProDescriptions from '@ant-design/pro-descriptions';
import { message } from 'antd';
import { AddToProject } from './service';

class ProDescription extends React.Component {
  render() {
    const { item, pid } = this.props;
    return (
      <ProDescriptions
        bordered={true}
        title="详细属性"
        dataSource={{
          id: item.id,
          creatorName: item.creatorName,
          name: item.name,
          projectId: item.projectId,
          uploadTime: item.uploadTime,
        }}
        columns={[
          {
            title: '图片ID',
            key: 'id',
            dataIndex: 'id',
            ellipsis: true,
            copyable: true,
          },
          {
            title: '创建者',
            key: 'creatorName',
            dataIndex: 'creatorName',
            ellipsis: true,
          },
          {
            title: '项目ID',
            key: 'projectId',
            dataIndex: 'projectId',
          },
          {
            title: '上传时间',
            key: 'uploadTime',
            dataIndex: 'uploadTime',
            valueType: 'date',
          },
          {
            title: '图片名',
            key: 'name',
            dataIndex: 'name',
          },
          {
            title: '操作',
            valueType: 'option',
            dataIndex: 'id',

            render: (imageId) => [
              <a
                onClick={async () => {
                  if ((pid || 0) > 0 && (this.props.id || 0) === 0) {
                    try {
                      let res = await AddToProject({
                        imageId: imageId,
                        projectId: pid,
                      });
                      if (res.status != 'success') {
                        message.error(res.msg);
                      } else {
                        message.success('添加成功');
                      }
                    } catch (error) {
                      console.log(error);
                      message.error('添加失败');
                    }
                  } else if (this.props.annotation) {
                    this.props.onClickView(this.props.annotation);
                  } else {
                    message.warning('暂不支持该操作');
                  }
                }}
                rel="noopener noreferrer"
                key="link"
              >
                {(this.props.pid || 0) > 0 && (this.props.id || 0) === 0 ? '添加到本项目' : '查看'}
              </a>,
              <a
                onClick={() => {
                  message.warning('暂不支持该操作');
                }}
                rel="noopener noreferrer"
                key="warning"
              >
                删除
              </a>,
              <a
                onClick={() => {
                  message.warning('暂不支持该操作');
                }}
                rel="noopener noreferrer"
                key="view"
              >
                标记
              </a>,
            ],
          },
        ]}
      >
        <ProDescriptions.Item label="url" valueType="text">
          {item.url}
        </ProDescriptions.Item>
      </ProDescriptions>
    );
  }
}
export default ProDescription;
