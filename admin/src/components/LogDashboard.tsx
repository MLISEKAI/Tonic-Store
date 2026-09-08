import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, Table, Tag, Button, Space, Statistic, Row, Col, Tabs, Alert, Badge, Tooltip, message as antMessage } from 'antd';
import {
  ReloadOutlined,
  ClearOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  DatabaseOutlined,
  ApiOutlined,
  LineChartOutlined,
  CopyOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { logService, LogEntry, EndpointStats, CacheStats, PerformanceSuggestion } from '../services/logService';

const LogDashboard: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [endpoints, setEndpoints] = useState<EndpointStats[]>([]);
  const [cacheStats, setCacheStats] = useState<CacheStats | null>(null);
  const [suggestions, setSuggestions] = useState<PerformanceSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterMethod, setFilterMethod] = useState<string | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);

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

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      antMessage.success(`Đã copy ${label} vào clipboard`);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        antMessage.success(`Đã copy ${label} vào clipboard`);
      } catch {
        antMessage.error('Copy thất bại');
      }
      document.body.removeChild(ta);
    }
  };

  const formatLogEntry = (l: LogEntry) => {
    return `[${new Date(l.timestamp).toISOString()}] ${l.method} ${l.url} | Status: ${l.statusCode} | Duration: ${l.duration.toFixed(2)}ms | Cache: ${l.cacheStatus || 'N/A'} | Trace: ${l.traceId}`;
  };

  const downloadLogs = () => {
    const text = filteredLogs.map(formatLogEntry).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `api-logs-${new Date().toISOString()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    antMessage.success(`Đã download ${filteredLogs.length} log entries`);
  };

  const copyAllLogs = () => {
    const text = filteredLogs.map(formatLogEntry).join('\n');
    copyToClipboard(text, `${filteredLogs.length} log entries`);
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

  const filteredLogs = useMemo(() => {
    return logs.filter(l => {
      if (searchText) {
        const t = searchText.toLowerCase();
        if (
          !l.url.toLowerCase().includes(t) &&
          !l.method.toLowerCase().includes(t) &&
          !l.traceId.toLowerCase().includes(t) &&
          !(l.statusCode?.toString().includes(t))
        ) return false;
      }
      if (filterMethod && l.method !== filterMethod) return false;
      if (filterStatus) {
        if (filterStatus === '2xx' && l.statusCode < 200) return false;
        if (filterStatus === '3xx' && (l.statusCode < 300 || l.statusCode >= 400)) return false;
        if (filterStatus === '4xx' && (l.statusCode < 400 || l.statusCode >= 500)) return false;
        if (filterStatus === '5xx' && l.statusCode < 500) return false;
      }
      return true;
    });
  }, [logs, searchText, filterMethod, filterStatus]);

  const logColumns = [
    {
      title: 'Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 110,
      render: (v: string) => (
        <Tooltip title={new Date(v).toISOString()}>
          <span style={{ fontSize: 12 }}>{new Date(v).toLocaleTimeString('vi-VN')}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Method',
      dataIndex: 'method',
      key: 'method',
      width: 75,
      render: (m: string) => <Tag color={getMethodColor(m)}>{m}</Tag>,
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      ellipsis: true,
      render: (url: string) => (
        <Tooltip title={url}>
          <span style={{ fontSize: 12, fontFamily: 'monospace' }}>{url}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'statusCode',
      key: 'statusCode',
      width: 70,
      render: (s: number) => <Tag color={getStatusColor(s)}>{s}</Tag>,
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
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
      width: 70,
      render: (c: string) => {
        if (!c || c === 'N/A') return <Tag>-</Tag>;
        return <Tag color={c === 'HIT' ? 'success' : 'warning'}>{c}</Tag>;
      },
    },
    {
      title: 'Trace ID',
      dataIndex: 'traceId',
      key: 'traceId',
      width: 110,
      render: (id: string) => (
        <Tooltip title={`Click để copy: ${id}`}>
          <span
            onClick={() => copyToClipboard(id, 'trace ID')}
            style={{ fontSize: 11, cursor: 'pointer', fontFamily: 'monospace' }}
          >
            {id.slice(0, 8)}...
          </span>
        </Tooltip>
      ),
    },
    {
      title: 'Copy',
      key: 'copy',
      width: 60,
      render: (_: any, log: LogEntry) => (
        <Tooltip title="Copy log entry">
          <Button
            size="small"
            type="text"
            icon={<CopyOutlined />}
            onClick={() => copyToClipboard(formatLogEntry(log), 'log entry')}
          />
        </Tooltip>
      ),
    },
  ];

  const endpointColumns = [
    {
      title: 'Endpoint',
      dataIndex: 'endpoint',
      key: 'endpoint',
      ellipsis: true,
      render: (ep: string) => (
        <Tooltip title={ep}>
          <span style={{ fontSize: 12, fontFamily: 'monospace' }}>{ep}</span>
        </Tooltip>
      ),
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
    {
      title: 'Copy',
      key: 'copy',
      width: 60,
      render: (_: any, ep: EndpointStats) => (
        <Tooltip title="Copy endpoint stats">
          <Button
            size="small"
            type="text"
            icon={<CopyOutlined />}
            onClick={() => copyToClipboard(
              `${ep.endpoint} | Requests: ${ep.count} | Avg: ${ep.avgDuration.toFixed(2)}ms | Max: ${ep.maxDuration.toFixed(2)}ms | Errors: ${ep.errors} | Status: ${ep.status}`,
              'endpoint stats'
            )}
          />
        </Tooltip>
      ),
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
        <Space wrap>
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
              styles={{ content: { color: avgResponse > 200 ? '#ff4d4f' : '#52c41a' } }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Slow Endpoints (>200ms)"
              value={slowCount}
              prefix={<WarningOutlined />}
              styles={{ content: { color: slowCount > 0 ? '#ff4d4f' : '#52c41a' } }}
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
          title={`${slowCount} endpoint có response time > 200ms cần tối ưu`}
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Tabs defaultActiveKey="logs" items={[
        {
          key: 'logs',
          label: <span><ApiOutlined /> Request Logs ({filteredLogs.length})</span>,
          children: (
            <Card size="small">
              <div style={{ marginBottom: 12, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="Tìm theo URL, method, trace ID..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: 4,
                    fontSize: 13,
                    minWidth: 240,
                  }}
                />
                <select
                  value={filterMethod || ''}
                  onChange={(e) => setFilterMethod(e.target.value || undefined)}
                  style={{ padding: '6px 12px', border: '1px solid #d9d9d9', borderRadius: 4 }}
                >
                  <option value="">Tất cả method</option>
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                  <option value="PATCH">PATCH</option>
                </select>
                <select
                  value={filterStatus || ''}
                  onChange={(e) => setFilterStatus(e.target.value || undefined)}
                  style={{ padding: '6px 12px', border: '1px solid #d9d9d9', borderRadius: 4 }}
                >
                  <option value="">Tất cả status</option>
                  <option value="2xx">2xx (Success)</option>
                  <option value="3xx">3xx (Redirect)</option>
                  <option value="4xx">4xx (Client Error)</option>
                  <option value="5xx">5xx (Server Error)</option>
                </select>
                <Button icon={<CopyOutlined />} onClick={copyAllLogs}>
                  Copy tất cả ({filteredLogs.length})
                </Button>
                <Button icon={<DownloadOutlined />} onClick={downloadLogs}>
                  Download
                </Button>
              </div>
              <Table
                columns={logColumns}
                dataSource={[...filteredLogs].reverse()}
                rowKey="traceId"
                size="small"
                pagination={{ pageSize: 20, showSizeChanger: true }}
                scroll={{ x: 1000 }}
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
                scroll={{ x: 800 }}
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
                <Alert title="Không có gợi ý tối ưu nào. Tất cả endpoint đều < 200ms" type="success" showIcon />
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
                <Col span={6}><Statistic title="Hits" value={cacheStats?.hits || 0} styles={{content:{color:'#52c41a'}}} /></Col>
                <Col span={6}><Statistic title="Misses" value={cacheStats?.misses || 0} styles={{content:{color:'#faad14'}}} /></Col>
                <Col span={6}><Statistic title="Errors" value={cacheStats?.errors || 0} styles={{content:{color:'#ff4d4f'}}} /></Col>
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
