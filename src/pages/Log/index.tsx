import { log } from '@/services/ant-design-pro/api'
import { PageContainer, ProTable, ProColumns, FooterToolbar, ProDescriptions, ProDescriptionsItemProps } from '@ant-design/pro-components';
import React, { useRef, useState } from 'react';
import type { ActionType } from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Drawer, Tag } from 'antd';

/**
 * 每个单独的卡片，为了复用样式抽成了组件
 * @param param0
 * @returns
 */

const Log: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  // const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.LogListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.LogListItem[]>([]);

  const intl = useIntl();

  const columns: ProColumns<API.LogListItem>[] = [
    {
      title: <FormattedMessage id="pages.searchTable.id" defaultMessage="ID" />,
      dataIndex: 'id',
      tip: 'Id is unique key',
    },
    {
      title: (
        <FormattedMessage 
          id="pages.searchTable.slug"
          defaultMessage="Slug"
        />
      ),
      dataIndex: 'slug',
      render: (dom, entity) => {
        return (
          <a 
          onClick={() => {
            setCurrentRow(entity);
            setShowDetail(true);
          }}>{dom}</a>
        )
      }
    },
    {
      title: <FormattedMessage id="pages.searchTable.createdBy" defaultMessage="Created by" />,
      dataIndex: 'created_by',
      render: (_, entity) => {
        return (
          <span>{entity.username}&nbsp;<small>{`(id:${entity.user_id})`}</small></span>
        )
      }
    },
    {
      title: <FormattedMessage id="pages.searchTable.model" defaultMessage="Model" />,
      dataIndex: 'model',
      render: (dom) => {
        return (
          <Tag>{dom}</Tag>
        )
      }
    },
    {
      title: <FormattedMessage id="pages.searchTable.detail" defaultMessage="Detail" />,
      dataIndex: 'detail',
    },
    {
      title: <FormattedMessage id="pages.searchTable.createdAt" defaultMessage="Created at" />,
      dataIndex: 'created_at',
      valueType: 'dateTime'
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.LogListItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="id"
        search={{labelWidth: 120,}}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {handleModalOpen(true)}}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>
        ]}
        request={log}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
        />
        {selectedRowsState?.length > 0 && (
          <FooterToolbar
            extra={
              <div>
                <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />&nbsp;
                <a style={{fontWeight: 600}}>{selectedRowsState.length}</a>&nbsp;
                <FormattedMessage id="pages.searchTable.item" defaultMessage="Item" />
                {/* &nbsp;&nbsp;
                <span>
                  <FormattedMessage id="pages.searchTable.totalServiceCalls" defaultMessage="Total number of service calls" />&nbsp;
                  {selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)}&nbsp;
                  <FormattedMessage id="pages.searchTable.tenThousand" defaultMessage="10 000" />
                </span> */}
              </div>
            }
          >
            <Button>
              <FormattedMessage id="pages.searchTable.batchDeletion" defaultMessage="Batch deletion" />
            </Button>
          </FooterToolbar>
        )}
        {/*  */}
        <Drawer
          width={400}
          open={showDetail}
          onClose={() => {
            setCurrentRow(undefined);
            setShowDetail(false);
          }}
          closable={true}
          title={`ID:${currentRow?.id} - ${currentRow?.slug}`}
        >
          {currentRow?.id && (
            <ProDescriptions<API.LogListItem>
              column={2}
              request={async () => ({
                data: currentRow || {},
              })}
              params={{
                id: currentRow?.id
              }}
              columns={columns as ProDescriptionsItemProps<API.LogListItem>[]}
            />
          )}
        </Drawer>
    </PageContainer>
  );
};

export default Log;
