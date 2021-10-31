import { Tag, Input, Tooltip, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React from 'react';
class EditableTagGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputVisible: false,
      inputValue: '',
    };
  }

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    if (inputValue.length === 0) {
      return;
    }
    let { tags } = this.props;
    tags = tags || [];
    if (
      tags.some((element, index, array) => {
        return element.content == inputValue;
      })
    ) {
      notification.info({
        duration: 3,
        description: '元素' + inputValue + '已经存在',
        message: '添加失败',
      });
      return;
    }

    console.log('input为', inputValue);
    this.props.addTag(inputValue);
    this.setState({ inputVisible: false, inputValue: '' });
  };

  saveInputRef = (input) => {
    this.input = input;
  };

  render() {
    const { inputVisible, inputValue, editInputIndex, editInputValue } = this.state;
    const { tags } = this.props;
    return (
      <>
        {tags?.map((tag, index) => {
          const isLongTag = tag.content.length > 20;

          const tagElem = (
            <Tag
              color="red"
              className="edit-tag"
              key={tag.id}
              closable={true}
              onClose={() => this.props.removeTag(tag.id)}
            >
              <span>{isLongTag ? `${tag.content.slice(0, 20)}...` : tag.content}</span>
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={tag.content} key={tag.id}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        })}
        {inputVisible && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            className="tag-input"
            value={inputValue}
            onChange={this.handleInputChange}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && (
          <Tag className="site-tag-plus" onClick={this.showInput}>
            <PlusOutlined /> New Tag
          </Tag>
        )}
      </>
    );
  }
}

export default EditableTagGroup;
