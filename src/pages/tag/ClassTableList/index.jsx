import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, message, Input, Drawer, Tag, Form, Popconfirm } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import ProDescriptions from '@ant-design/pro-descriptions';
import { rule, addRule, updateRule, removeRule, addTag, removeTag } from './service';
import EditableTagGroup from './components/EditableTagGroup';

/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields) => {
  const hide = message.loading('正在添加');

  try {
    await addRule({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};
/**
 * 更新节点
 *
 * @param fields
 */

const handleUpdate = async (fields, currentRow) => {
  const hide = message.loading('正在配置');

  try {
    await updateRule({ ...currentRow, ...fields });
    hide();
    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};
/**
 * 删除节点
 *
 * @param selectedRows
 */

const handleRemove = async (selectedRows) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;

  try {
    await removeRule({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};
const handleClassRemove = async (classId) => {
  const hide = message.loading('正在删除');
  if (!classId) {
    return true;
  }
  try {
    await removeRule({
      id: classId,
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 24, offset: 0 },
  },
};
const TableList = () => {
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState(false);

  /** 分布更新窗口的弹窗 */

  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const actionRef = useRef();
  const [currentRow, setCurrentRow] = useState();
  const [selectedRowsState, setSelectedRows] = useState([]);

  //正在修改的行的配置
  const [editRowState, setEditRowState] = useState({});

  const updateFormRef = useRef();
  const updateFormOnFill = (record) => {
    setEditRowState({
      id: record.id,
      className: record.className,
      description: record.description,
    });
    updateFormRef?.current?.setFieldsValue(editRowState);
  };
  //删除tag 通过tagid
  const handleTagRemove = async (tagId) => {
    message.info({
      content: '正在删除',
      duration: 3,
    });
    if (!tagId) {
      return true;
    }
    try {
      await removeTag({
        tagId: tagId,
      });
      message.success({
        content: '删除成功，正在刷新',
        duration: 3,
      });
      actionRef.current.reload();
      return true;
    } catch (error) {
      message.error({
        content: '添加失败，请重试',
        duration: 3,
      });
      return false;
    }
  };

  const handleTagCreate = async (content) => {
    message.info({
      content: '正在添加',
      duration: 3,
    });

    if (!currentRow?.id) {
      return true;
    }
    try {
      await addTag({
        classId: currentRow.id,
        content: content,
      });
      message.success({
        content: '添加成功，正在刷新',
        duration: 3,
      });
      actionRef.current.reload();
      return true;
    } catch (error) {
      message.error({
        content: '添加失败，请重试',
        duration: 3,
      });
      return false;
    }
  };
  const addTags = (
    <Form.List
      name="tags"
      rules={[
        {
          validator: async (_, names) => {
            if (!names || names.length < 2) {
              return Promise.reject(new Error('At least 2 tags'));
            }
          },
        },
      ]}
    >
      {(fields, { add, remove }, { errors }) => (
        <>
          {fields.map((field, index) => (
            <Form.Item
              {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
              label={index === 0 ? 'Tags' : ''}
              required={false}
              key={field.key}
            >
              <Form.Item
                {...field}
                validateTrigger={['onChange', 'onBlur']}
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Please input tag's name or delete this field.",
                  },
                ]}
                noStyle
              >
                <Input placeholder="tag name" style={{ width: '60%' }} />
              </Form.Item>
              {fields.length > 1 ? (
                <MinusCircleOutlined
                  className="dynamic-delete-button"
                  onClick={() => remove(field.name)}
                />
              ) : null}
            </Form.Item>
          ))}
          <Form.Item>
            <Button
              type="dashed"
              onClick={() => add()}
              style={{ width: '50%' }}
              icon={<PlusOutlined />}
            >
              Add Tag
            </Button>
            <Form.ErrorList errors={errors} />
          </Form.Item>
        </>
      )}
    </Form.List>
  );
  /** 国际化配置 */

  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'textarea',
      render: (dom, record) => {
        return (
          <Tag color="cyan" key={record.id}>
            {dom}
          </Tag>
        );
      },
      // width: 48,
    },
    {
      title: '类型名',
      dataIndex: 'className',
      tip: '类型名并未设置唯一，请自行根据需要进行设置',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '描述',
      search: false,
      dataIndex: 'description',
      valueType: 'textarea',
    },
    {
      title: '创建者',
      seach: false,
      dataIndex: 'creatorName',
      valueType: 'labels',
      renderFormItem: (_, { defaultRender }) => {
        return defaultRender(_);
      },
      render: (dom, record) => {
        return (
          <Tag color="gold" key={record.id}>
            {dom}
          </Tag>
        );
      },
    },
    {
      title: '包含tag数量',
      dataIndex: 'tags',
      search: false,
      hideInForm: true,
      renderText: (tags) => `${tags.length}`,
    },
    {
      title: '创建时间时间',
      sorter: true,
      dataIndex: 'createTime',
      search: false,
      valueType: 'dateTime',
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        return defaultRender(item);
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalVisible(true);
            updateFormOnFill(record);
          }}
        >
          修改
        </a>,

        <Popconfirm
          key="delete"
          placement="top"
          title={'确定要删除吗'}
          onConfirm={async () => {
            let res = await handleClassRemove(record.id);
            if (res) {
              actionRef.current.reload();
            }
          }}
          okText="Yes"
          cancelText="No"
        >
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={async (
          // 第一个参数 params 查询表单和 params 参数的结合
          // 第一个参数中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
          params,
          sort,
          filter,
        ) => {
          console.log(params);
          // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
          // 如果需要转化参数可以在这里进行修改
          const msg = await rule(params);
          console.log(msg);
          return {
            data: msg.data.data,
            // success 请返回 true，
            // 不然 table 会停止解析数据，即使有数据
            success: msg.data.success,
            // 不传会使用 data 的长度，如果是分页一定要传
            total: msg.data.total,
          };
        }}
        columns={columns}
      />
      <ModalForm
        title="新建tag类"
        width="400px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (value) => {
          console.log(value);
          const success = await handleAdd(value);

          if (success) {
            handleModalVisible(false);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          label="类型名"
          rules={[
            {
              required: true,
              message: '规则名称为必填项',
            },
            {
              type: 'string',
              message: '必须输入字符串',
            },
            {
              max: 30,
              message: '长度最多为30',
            },
          ]}
          width="md"
          placeholder="请输入类型名"
          name="className"
        />
        <ProFormTextArea
          label="简单描述"
          width="md"
          name="description"
          placeholder="请输入简要描述"
          rules={[
            {
              required: true,
              message: '规则名称为必填项',
            },
            {
              type: 'string',
              message: '必须输入字符串',
            },
            {
              max: 40,
              message: '长度最多为40',
            },
          ]}
        />
        {addTags}
      </ModalForm>

      <ModalForm
        title="修改tag类"
        width="400px"
        formRef={updateFormRef}
        visible={updateModalVisible}
        onVisibleChange={handleUpdateModalVisible}
        onFinish={async (value) => {
          console.log(value);
          const success = await handleUpdate(value);

          if (success) {
            handleUpdateModalVisible(false);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText hidden name="id" />
        <ProFormText
          label="类型名"
          rules={[
            {
              required: true,
              message: '规则名称为必填项',
            },
            {
              type: 'string',
              message: '必须输入字符串',
            },
            {
              max: 30,
              message: '长度最多为30',
            },
          ]}
          width="md"
          placeholder="请输入类型名"
          name="className"
        />
        <ProFormTextArea
          label="简单描述"
          width="md"
          name="description"
          placeholder="请输入简要描述"
          rules={[
            {
              required: true,
              message: '规则名称为必填项',
            },
            {
              type: 'string',
              message: '必须输入字符串',
            },
            {
              max: 40,
              message: '长度最多为40',
            },
          ]}
        />
      </ModalForm>

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.className && (
          <ProDescriptions
            column={2}
            title={currentRow?.className}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.className,
            }}
            columns={columns}
          />
        )}
        <EditableTagGroup
          tags={currentRow?.tags}
          removeTag={handleTagRemove}
          addTag={handleTagCreate}
        />
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
