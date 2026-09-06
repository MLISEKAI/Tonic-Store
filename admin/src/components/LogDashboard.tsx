import React, { useState, useEffect, useCallback } from 'react';
import { Card, Table, Tag, Button, Space, Statistic, Row, Col, Tabs, Alert, Badge, Tooltip } from 'antd';
import {
  ReloadOutlined,
  ClearOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  DatabaseOutlined,
  ApiOutlined,
  LineChartOutlined,
} from '@ant-design/icons';
import { logService, LogEntry, EndpointStats, CacheStats, PerformanceSuggestion } from '../services/logService';

const LogDashboard: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [endpoints, setEndpoints] = useState<EndpointStats[]>([]);
  const [cacheStats, setCacheStats] = useState<CacheStats | null>(null);
  const [suggestions, setSuggestions] = useState<PerformanceSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [logsRes, endpointsRes, statsRes, perfRes] = await Promise.all([
        logService.getLogs({ limit: 200 }),
        logService.getEndpoints(),
        logService.getStats(),
        logService.getPerformance(),
      ]);
      setLogs(logsRes.logs);
      setEndpoints(endpointsRes.endpoints);
      setCacheStats(statsRes.requestCache);
      setSuggestions(perfRes.suggestions);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchAll, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchAll]);

  const handleClear = async () => {
    await logService.clearLogs();
    fetchAll();
  };

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = { GET: 'green', POST: 'blue', PUT: 'orange', DELETE: 'red', PATCH: 'purple' };
    return colors[method] || 'default';
  };

  const getStatusColor = (status: number) => {
    if (status >= 500) return 'error';
    if (status >= 400) return 'warning';
    if (status >= 300) return 'processing';
    return 'success';
  };

  const logColumns = [
    {
      title: 'Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      render: (v: string) => new Date(v).toLocaleTimeString('vi-VN'),
    },
    {
      title: 'Method',
      dataIndex: 'method',
      key: 'method',
      width: 80,
      render: (m: string) => <Tag color={getMethodColor(m)}>{m}</Tag>,
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'statusCode',
      key: 'statusCode',
      width: 80,
      render: (s: number) => <Tag color={getStatusColor(s)}>{s}</Tag>,
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      width: 120,
      sorter: (a: LogEntry, b: LogEntry) => a.duration - b.duration,
      render: (d: number) => (
        <Tooltip title={`${(d / 1000).toFixed(3)}s`}>
          <span style={{ color: d > 1000 ? '#ff4d4f' : d > 200 ? '#faad14' : '#52c41a', fontWeight: 600 }}>
            {d.toFixed(0)}ms
          </span>
        </Tooltip>
      ),
    },
    {
      title: 'Cache',
      dataIndex: 'cacheStatus',
      key: 'cache',
      width: 80,
      render: (c: string) => {
        if (!c || c === 'N/A') return <Tag>-</Tag>;
        return <Tag color={c === 'HIT' ? 'success' : 'warning'}>{c}</Tag>;
      },
    },
    {
      title: 'Trace ID',
      dataIndex: 'traceId',
      key: 'traceId',
      width: 120,
      render: (id: string) => <Tooltip title={id}><span style={{fontSize:11}}>{id.slice(0,8)}...</span></Tooltip>,
    },
  ];

  const endpointColumns = [
    {
      title: 'Endpoint',
      dataIndex: 'endpoint',
      key: 'endpoint',
      ellipsis: true,
    },
    {
      title: 'Requests',
      dataIndex: 'count',
      key: 'count',
      width: 100,
      sorter: (a: EndpointStats, b: EndpointStats) => a.count - b.count,
    },
    {
      title: 'Avg (ms)',
      dataIndex: 'avgDuration',
      key: 'avgDuration',
      width: 100,
      sorter: (a: EndpointStats, b: EndpointStats) => a.avgDuration - b.avgDuration,
      render: (d: number) => (
        <span style={{ color: d > 200 ? '#ff4d4f' : '#52c41a', fontWeight: 600 }}>{d.toFixed(0)}</span>
      ),
    },
    {
      title: 'Max (ms)',
      dataIndex: 'maxDuration',
      key: 'maxDuration',
      width: 100,
      render: (d: number) => (
        <span style={{ color: d > 500 ? '#ff4d4f' : '#faad14' }}>{d.toFixed(0)}</span>
      ),
    },
    {
      title: 'Errors',
      dataIndex: 'errors',
      key: 'errors',
      width: 80,
      render: (e: number) => e > 0 ? <Badge count={e} style={{ backgroundColor: '#ff4d4f' }} /> : <span>0</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (s: string) => <Tag color={s === 'SLOW' ? 'error' : 'success'}>{s}</Tag>,
    },
  ];

  const slowCount = endpoints.filter(e => e.status === 'SLOW').length;
  const avgResponse = endpoints.length > 0
    ? endpoints.reduce((sum, e) => sum + e.avgDuration, 0) / endpoints.length
    : 0;

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>
          <LineChartOutlined /> API Performance Logs
        </h2>
        <Space>
          <Button
            type={autoRefresh ? 'primary' : 'default'}
            icon={<ThunderboltOutlined />}
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? 'Tự động: ON' : 'Tự động: OFF'}
          </Button>
          <Button icon={<ReloadOutlined />} onClick={fetchAll} loading={loading}>Refresh</Button>
          <Button icon={<ClearOutlined />} onClick={handleClear} danger>Xóa log</Button>
        </Space>
      </div>

      {/* Stats Cards */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Tổng requests"
              value={logs.length}
              prefix={<ApiOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Avg Response"
              value={avgResponse.toFixed(0)}
              suffix="ms"
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: avgResponse > 200 ? '#ff4d4f' : '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Slow Endpoints (>200ms)"
              value={slowCount}
              prefix={<WarningOutlined />}
              valueStyle={{ color: slowCount > 0 ? '#ff4d4f' : '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Cache Hit Rate"
              value={cacheStats?.hitRate || '0%'}
              prefix={<DatabaseOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {slowCount > 0 && (
        <Alert
          message={`${slowCount} endpoint có response time > 200ms cần tối ưu`}
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Tabs defaultActiveKey="logs" items={[
        {
          key: 'logs',
          label: <span><ApiOutlined /> Request Logs</span>,
          children: (
            <Card size="small">
              <Table
                columns={logColumns}
                dataSource={[...logs].reverse()}
                rowKey="traceId"
                size="small"
                pagination={{ pageSize: 20, showSizeChanger: true }}
                scroll={{ x: 900 }}
              />
            </Card>
          ),
        },
        {
          key: 'endpoints',
          label: <span><ThunderboltOutlined /> Endpoints</span>,
          children: (
            <Card size="small">
              <Table
                columns={endpointColumns}
                dataSource={endpoints}
                rowKey="endpoint"
                size="small"
                pagination={false}
                scroll={{ x: 700 }}
              />
            </Card>
          ),
        },
        {
          key: 'suggestions',
          label: <span><WarningOutlined /> Tối ưu ({suggestions.length})</span>,
          children: (
            <Card size="small">
              {suggestions.length === 0 ? (
                <Alert message="Không có gợi ý tối ưu nào. Tất cả endpoint đều < 200ms" type="success" showIcon />
              ) : (
                <Table
                  dataSource={suggestions}
                  rowKey="endpoint"
                  size="small"
                  pagination={false}
                  columns={[
                    { title: 'Endpoint', dataIndex: 'endpoint', key: 'endpoint', ellipsis: true },
                    {
                      title: 'Duration',
                      dataIndex: 'currentDuration',
                      key: 'duration',
                      width: 100,
                      render: (d: number) => <span style={{color:'#ff4d4f',fontWeight:600}}>{d.toFixed(0)}ms</span>,
                    },
                    {
                      title: 'Priority',
                      dataIndex: 'priority',
                      key: 'priority',
                      width: 100,
                      render: (p: string) => <Tag color={p === 'high' ? 'error' : p === 'medium' ? 'warning' : 'default'}>{p.toUpperCase()}</Tag>,
                    },
                    { title: 'Issue', dataIndex: 'issue', key: 'issue', ellipsis: true },
                    { title: 'Suggestion', dataIndex: 'suggestion', key: 'suggestion', ellipsis: true },
                  ]}
                />
              )}
            </Card>
          ),
        },
        {
          key: 'cache',
          label: <span><DatabaseOutlined /> Cache Stats</span>,
          children: (
            <Card size="small">
              <Row gutter={16}>
                <Col span={6}><Statistic title="Hits" value={cacheStats?.hits || 0} valueStyle={{color:'#52c41a'}} /></Col>
                <Col span={6}><Statistic title="Misses" value={cacheStats?.misses || 0} valueStyle={{color:'#faad14'}} /></Col>
                <Col span={6}><Statistic title="Errors" value={cacheStats?.errors || 0} valueStyle={{color:'#ff4d4f'}} /></Col>
                <Col span={6}><Statistic title="Hit Rate" value={cacheStats?.hitRate || '0%'} /></Col>
              </Row>
            </Card>
          ),
        },
      ]} />
    </div>
  );
};

export default LogDashboard;
