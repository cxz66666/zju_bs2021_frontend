import React, { createElement } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import styles from './index.less';

const EditableLinkGroup = (props) => {
  const { links } = props;
  return (
    <div className={styles.linkGroup}>
      {links.map((link) => (
        <Button
          style={{ marginLeft: 20 }}
          size="small"
          type="primary"
          ghost
          href={link.href}
          key={`linkGroup-item-${link.id || link.title}`}
        >
          <PlusOutlined /> {link.title}
        </Button>
      ))}
    </div>
  );
};

EditableLinkGroup.defaultProps = {
  links: [],
};
export default EditableLinkGroup;
