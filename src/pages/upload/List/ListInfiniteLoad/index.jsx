import React from 'react';
import styles from './index.less';
import { List, message, Avatar, Spin, notification, Card, Popover, Tag } from 'antd';
import { fetchListData } from './service';
import InfiniteScroll from 'react-infinite-scroller';
import DetailCard from '../DetailCard';
const fakeDataUrl = 'https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo';
const Meta = Card.Meta;
class InfiniteListExample extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      loading: false,
      hasMore: true,
      total: 0,
      pageSize: 20,
      current: 1,
    };
  }

  componentDidMount = async () => {
    try {
      let res = await this.fetchData();
      console.log(res);
      if (res.status === 'success') {
        this.setState({
          data: res.data.data,
          total: res.data.total,
          current: this.state.current + 1,
        });
      } else {
        notification.error({
          duration: 4,
          message: '数据加载失败',
          description: '数据加载失败，请稍后重试',
        });
      }
    } catch (error) {
      notification.error({
        duration: 4,
        message: '数据加载失败',
        description: '数据加载失败，请稍后重试',
      });
    }
  };

  fetchData = () =>
    new Promise((resolve, reject) => {
      fetchListData(
        this.props.id,
        { current: this.state.current, pageSize: this.state.pageSize },
        {
          contentType: 'application/json',
        },
      ).then((r) => resolve(r));
    });

  handleInfiniteOnLoad = async () => {
    let { data } = this.state;
    this.setState({
      loading: true,
    });

    try {
      let res = await this.fetchData();

      console.log(res);
      if (res.status === 'success') {
        this.setState({
          data: this.state.data.concat(res.data.data),
          total: res.data.total,
          current: this.state.current + 1,
          loading: false,
          hasMore: res.data.data.length < this.state.pageSize ? false : true,
        });
        if (res.data.data.length < this.state.pageSize) {
          notification.warning({
            duration: 5,
            description: '已经到底了',
          });
        }
        console.log(this.state.data.concat(res.data.data));
      } else {
        notification.error({
          duration: 4,
          message: '数据加载失败',
          description: '数据加载失败，请稍后重试',
        });
        this.setState({
          loading: false,
          data: [],
        });
      }
    } catch (error) {
      notification.error({
        duration: 4,
        message: '数据加载失败',
        description: '数据加载失败，请稍后重试',
      });
      this.setState({
        loading: false,
        data: [],
      });
    }
  };
  annotationType = (annotation) => {
    if (!annotation) {
      return <Tag color="red">暂未标记</Tag>;
    }
    switch (annotation.type) {
      case 0:
        return <Tag color="green">已经标记</Tag>;
      case 1:
        return <Tag color="blue">未使用</Tag>;
      case 2:
        return <Tag color="purple">已经审核</Tag>;
      case 3:
        return <Tag color="gold">已接受</Tag>;
      default:
        return <Tag color="blue">未使用</Tag>;
    }
  };
  render() {
    // console.log(this.props.map);
    return (
      <div className="demo-infinite-container">
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={this.handleInfiniteOnLoad}
          hasMore={!this.state.loading && this.state.hasMore}
        >
          <List
            dataSource={this.state.data}
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 3,
              lg: 4,
              xl: 5,
              xxl: 6,
            }}
            renderItem={(item) => {
              // console.log(item);
              return (
                <List.Item key={item.id}>
                  <Popover
                    placement="bottomLeft"
                    content={
                      <DetailCard
                        id={this.props.id || 0}
                        pid={this.props.pid || 0}
                        item={item}
                        onClickView={this.props.onClickView}
                        annotation={
                          this.props.map && this.props.map[item.id] != undefined
                            ? this.props.map[item.id]
                            : undefined
                        }
                      />
                    }
                  >
                    <Card
                      hoverable
                      cover={
                        <img alt={item.name} src={item.url} style={{ objectFit: 'contain' }} />
                      }
                    >
                      <Meta
                        title={item.name}
                        description={
                          <div>
                            {item.creatorName + ' ' + item.uploadTime + ' '}
                            {this.props.map && this.annotationType(this.props.map[item.id])}
                          </div>
                        }
                        style={{
                          fontSize: 12,
                        }}
                      />
                    </Card>
                  </Popover>
                </List.Item>
              );
            }}
          >
            {this.state.loading && this.state.hasMore && (
              <div className="demo-loading-container">
                <Spin />
              </div>
            )}
          </List>
        </InfiniteScroll>
      </div>
    );
  }
}

export default (props) => (
  <div className={styles.container}>
    <div id="components-list-demo-infinite-load">
      <InfiniteListExample
        id={props?.id ? props.id : 0}
        pid={props?.pid ? props.pid : 0}
        map={props?.map ? props.map : undefined}
        onClickView={props.onClickView}
      />
    </div>
  </div>
);
