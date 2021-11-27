import React from 'react';
import styles from './index.less';
import { List, message, Avatar, Spin, notification, Card, Popover } from 'antd';
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

  componentDidMount() {
    try {
      this.fetchData((res) => {
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
      });
    } catch (error) {
      notification.error({
        duration: 4,
        message: '数据加载失败',
        description: '数据加载失败，请稍后重试',
      });
    }
  }

  fetchData = (callback) => {
    fetchListData(
      { current: this.state.current, pageSize: this.state.pageSize },
      {
        contentType: 'application/json',
      },
    ).then((r) => callback(r));
  };
  handleInfiniteOnLoad = () => {
    let { data } = this.state;
    this.setState({
      loading: true,
    });

    try {
      this.fetchData((res) => {
        console.log(res);
        if (res.status === 'success') {
          this.setState({
            data: this.state.data.concat(res.data.data),
            total: res.data.total,
            current: this.state.current + 1,
            loading: false,
          });
          if (res.data.data.length < this.state.pageSize) {
            notification.warning({
              duration: 5,
              description: '已经到底了',
            });
            this.setState({ hasMore: false });
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
      });
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

  render() {
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
              console.log(item);
              return (
                <List.Item key={item.id}>
                  <Popover placement="bottomLeft" content={<DetailCard item={item} />}>
                    <Card
                      hoverable
                      cover={
                        <img alt={item.name} src={item.url} style={{ objectFit: 'contain' }} />
                      }
                    >
                      <Meta
                        title={item.name}
                        description={item.creatorName + ' ' + item.uploadTime}
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

export default () => (
  <div className={styles.container}>
    <div id="components-list-demo-infinite-load">
      <InfiniteListExample />
    </div>
  </div>
);
