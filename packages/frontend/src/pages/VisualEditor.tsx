import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Panel,
  type Node,
  type Edge,
  type OnConnect,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  MessageSquare, MousePointerClick, FileText, List, ArrowRightLeft,
  Code, Database, GitBranch, Plus, Save, ArrowLeft, Trash2,
  Type, PanelLeft, Settings, Zap
} from 'lucide-react';
import axios from 'axios';

const BLOCK_TYPES = [
  { type: 'text', label: 'Simple Text', icon: Type, color: 'bg-blue-500' },
  { type: 'quickReplies', label: 'Quick Replies', icon: MousePointerClick, color: 'bg-green-500' },
  { type: 'buttons', label: 'Buttons', icon: MousePointerClick, color: 'bg-purple-500' },
  { type: 'attachment', label: 'Attachment', icon: FileText, color: 'bg-orange-500' },
  { type: 'list', label: 'List', icon: List, color: 'bg-pink-500' },
  { type: 'capture', label: 'Capture Input', icon: MessageSquare, color: 'bg-cyan-500' },
  { type: 'condition', label: 'Condition', icon: ArrowRightLeft, color: 'bg-yellow-500' },
  { type: 'apiCall', label: 'API Call', icon: Code, color: 'bg-red-500' },
  { type: 'setVariable', label: 'Set Variable', icon: Database, color: 'bg-indigo-500' },
  { type: 'gotoFlow', label: 'Go to Flow', icon: GitBranch, color: 'bg-teal-500' },
];

const defaultNodeData: Record<string, Record<string, unknown>> = {
  text: { content: 'Hello!' },
  quickReplies: { content: 'Choose an option:', options: ['Option 1', 'Option 2'] },
  buttons: { content: 'What would you like to do?', buttons: [{ label: 'Button', action: 'postback' }] },
  attachment: { url: '', type: 'image' },
  list: { elements: [{ title: 'Item', subtitle: 'Description' }] },
  capture: { variableName: 'user_input', prompt: 'Please enter your response:' },
  condition: { variable: '', operator: 'equals', value: '' },
  apiCall: { url: '', method: 'GET', headers: {}, body: {} },
  setVariable: { variableName: '', value: '' },
  gotoFlow: { flowId: '' },
};

function getNodeIcon(type: string) {
  const block = BLOCK_TYPES.find((b) => b.type === type);
  return block ? block.icon : Type;
}

function getNodeColor(type: string) {
  const block = BLOCK_TYPES.find((b) => b.type === type);
  return block ? block.color : 'bg-gray-500';
}

function CustomNode({ data }: { data: { type: string; label: string; content?: string } }) {
  const Icon = getNodeIcon(data.type);
  const color = getNodeColor(data.type);

  return (
    <div className="bg-gray-800 border border-gray-600 rounded-lg shadow-lg min-w-[200px]">
      <div className={`flex items-center gap-2 px-3 py-2 ${color} rounded-t-lg`}>
        <Icon size={14} className="text-white" />
        <span className="text-white text-sm font-medium">{data.label}</span>
      </div>
      {data.content && (
        <div className="px-3 py-2 text-gray-300 text-xs max-w-[250px] truncate">
          {data.content}
        </div>
      )}
    </div>
  );
}

const nodeTypes = { custom: CustomNode };

export default function VisualEditor() {
  const { botId } = useParams();
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [flows, setFlows] = useState<any[]>([]);
  const [activeFlow, setActiveFlow] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [showPanel, setShowPanel] = useState(true);
  const [nodeFormData, setNodeFormData] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!botId) return;
    axios.get(`/api/bots/${botId}/flows`).then(({ data }) => {
      setFlows(data);
      if (data.length > 0) {
        setActiveFlow(data[0].id);
        loadFlowNodes(data[0].id);
      }
    });
  }, [botId]);

  const loadFlowNodes = async (flowId: string) => {
    try {
      const { data } = await axios.get(`/api/flows/${flowId}`);
      const rfNodes: Node[] = (data.nodes || []).map((n: any) => ({
        id: n.id,
        type: 'custom',
        position: { x: n.positionX, y: n.positionY },
        data: { type: n.type, label: getBlockLabel(n.type), ...JSON.parse(n.data || '{}') },
      }));
      const rfEdges: Edge[] = (data.connections || []).map((c: any) => ({
        id: c.id,
        source: c.sourceNodeId,
        target: c.targetNodeId,
        label: c.label || undefined,
        markerEnd: { type: MarkerType.ArrowClosed, width: 15, height: 15, color: '#6b7280' },
        style: { stroke: '#6b7280' },
      }));
      setNodes(rfNodes);
      setEdges(rfEdges);
    } catch {
      setNodes([]);
      setEdges([]);
    }
  };

  const getBlockLabel = (type: string) => {
    const block = BLOCK_TYPES.find((b) => b.type === type);
    return block?.label || type;
  };

  const onConnect: OnConnect = useCallback(
    async (connection) => {
      const newEdge = {
        ...connection,
        markerEnd: { type: MarkerType.ArrowClosed, width: 15, height: 15, color: '#6b7280' },
        style: { stroke: '#6b7280' },
      };
      setEdges((eds) => addEdge(newEdge, eds));
      if (activeFlow) {
        try {
          await axios.post('/api/flows/connections', {
            sourceNodeId: connection.source,
            targetNodeId: connection.target,
          });
        } catch {}
      }
    },
    [activeFlow, setEdges]
  );

  const addNode = async (type: string) => {
    const id = `node_${Date.now()}`;
    const newNode: Node = {
      id,
      type: 'custom',
      position: { x: 250 + Math.random() * 200, y: 200 + Math.random() * 200 },
      data: { type, label: getBlockLabel(type), ...defaultNodeData[type] },
    };
    setNodes((nds) => [...nds, newNode]);
    setSelectedNode(newNode);
    setNodeFormData({ ...defaultNodeData[type] });
    setShowPanel(true);

    if (activeFlow) {
      try {
        await axios.post('/api/flows/nodes', {
          flowId: activeFlow,
          type,
          positionX: newNode.position.x,
          positionY: newNode.position.y,
          data: JSON.stringify(defaultNodeData[type]),
        });
      } catch {}
    }
  };

  const onNodeClick = (_: any, node: Node) => {
    setSelectedNode(node);
    const { type, label, ...rest } = node.data;
    setNodeFormData(rest);
    setShowPanel(true);
  };

  const saveNodeData = async () => {
    if (!selectedNode || !activeFlow) return;
    setSaving(true);
    try {
      await axios.patch(`/api/flows/nodes/${selectedNode.id}`, {
        data: JSON.stringify(nodeFormData),
      });
      setNodes((nds) =>
        nds.map((n) =>
          n.id === selectedNode.id
            ? { ...n, data: { ...n.data, ...nodeFormData } }
            : n
        )
      );
    } catch {}
    setSaving(false);
  };

  const deleteNode = async () => {
    if (!selectedNode) return;
    try {
      await axios.delete(`/api/flows/nodes/${selectedNode.id}`);
    } catch {}
    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
    setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
    setSelectedNode(null);
  };

  const createFlow = async () => {
    const label = prompt('Flow name:');
    if (!label || !botId) return;
    try {
      const { data } = await axios.post('/api/flows', { label, botId });
      setFlows((prev) => [...prev, data]);
      setActiveFlow(data.id);
      setNodes([]);
      setEdges([]);
    } catch {}
  };

  const handleNodesChange = async (changes: any[]) => {
    onNodesChange(changes);
    if (!activeFlow) return;
    for (const change of changes) {
      if (change.type === 'position' && change.position) {
        try {
          await axios.patch(`/api/flows/nodes/${change.id}`, {
            positionX: change.position.x,
            positionY: change.position.y,
          });
        } catch {}
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Flow tabs */}
      <div className="flex items-center bg-gray-800 border-b border-gray-700 px-3 py-1.5 gap-2">
        <button
          onClick={() => navigate('/bots')}
          className="text-gray-400 hover:text-white mr-2"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex gap-1 overflow-x-auto">
          {flows.map((flow) => (
            <button
              key={flow.id}
              onClick={() => {
                setActiveFlow(flow.id);
                loadFlowNodes(flow.id);
              }}
              className={`px-3 py-1 rounded text-sm whitespace-nowrap ${
                activeFlow === flow.id
                  ? 'bg-teal-600 text-white'
                  : 'text-gray-400 hover:bg-gray-700'
              }`}
            >
              {flow.label}
              {flow.isStart && <span className="ml-1 text-xs opacity-70">(start)</span>}
            </button>
          ))}
        </div>
        <button
          onClick={createFlow}
          className="flex items-center gap-1 px-2 py-1 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded"
        >
          <Plus size={14} /> Flow
        </button>
      </div>

      <div className="flex-1 flex">
        {/* Block palette */}
        <div className="w-48 bg-gray-800 border-r border-gray-700 p-2 overflow-y-auto shrink-0">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">Blocks</h3>
          <div className="space-y-1">
            {BLOCK_TYPES.map((block) => (
              <button
                key={block.type}
                onClick={() => addNode(block.type)}
                className="flex items-center gap-2 w-full px-2 py-1.5 rounded text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition"
              >
                <div className={`w-2 h-2 rounded ${block.color}`} />
                {block.label}
              </button>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div ref={reactFlowWrapper} className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            defaultEdgeOptions={{
              type: 'default',
              markerEnd: { type: MarkerType.ArrowClosed, width: 15, height: 15, color: '#6b7280' },
              style: { stroke: '#6b7280' },
            }}
          >
            <Background color="#374151" gap={16} />
            <Controls className="bg-gray-800 border-gray-700 [&>button]:bg-gray-700 [&>button]:border-gray-600 [&>button]:text-gray-300" />
            <MiniMap
              nodeColor={(node) => {
                const type = node.data?.type || 'text';
                const block = BLOCK_TYPES.find((b) => b.type === type);
                return block ? '#14b8a6' : '#6b7280';
              }}
              maskColor="rgba(0,0,0,0.3)"
              className="bg-gray-800 border-gray-700"
            />
            <Panel position="top-left" className="!static">
              {nodes.length === 0 && (
                <div className="bg-gray-800/90 border border-gray-700 rounded-lg p-4 text-center">
                  <Zap size={24} className="mx-auto text-gray-500 mb-2" />
                  <p className="text-gray-400 text-sm">Click a block type from the palette to start building</p>
                </div>
              )}
            </Panel>
          </ReactFlow>
        </div>

        {/* Configuration panel */}
        {showPanel && selectedNode && (
          <div className="w-72 bg-gray-800 border-l border-gray-700 overflow-y-auto shrink-0">
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <Settings size={16} className="text-gray-400" />
                <span className="text-sm font-medium text-white">{getBlockLabel(selectedNode.data.type)}</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={deleteNode} className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-red-400">
                  <Trash2 size={14} />
                </button>
                <button onClick={() => setShowPanel(false)} className="p-1 rounded hover:bg-gray-700 text-gray-400">
                  <PanelLeft size={14} />
                </button>
              </div>
            </div>

            <div className="p-3 space-y-3">
              {selectedNode.data.type === 'text' && (
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Message Content</label>
                  <textarea
                    value={(nodeFormData.content as string) || ''}
                    onChange={(e) => setNodeFormData({ ...nodeFormData, content: e.target.value })}
                    className="w-full rounded border border-gray-600 bg-gray-700 px-2 py-1.5 text-white text-sm focus:border-teal-500 focus:outline-none"
                    rows={4}
                  />
                </div>
              )}

              {selectedNode.data.type === 'quickReplies' && (
                <>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Message</label>
                    <textarea
                      value={(nodeFormData.content as string) || ''}
                      onChange={(e) => setNodeFormData({ ...nodeFormData, content: e.target.value })}
                      className="w-full rounded border border-gray-600 bg-gray-700 px-2 py-1.5 text-white text-sm focus:border-teal-500 focus:outline-none"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Options (comma-separated)</label>
                    <input
                      type="text"
                      value={((nodeFormData.options as string[]) || []).join(', ')}
                      onChange={(e) => setNodeFormData({ ...nodeFormData, options: e.target.value.split(',').map((s: string) => s.trim()) })}
                      className="w-full rounded border border-gray-600 bg-gray-700 px-2 py-1.5 text-white text-sm focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </>
              )}

              {selectedNode.data.type === 'capture' && (
                <>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Variable Name</label>
                    <input
                      type="text"
                      value={(nodeFormData.variableName as string) || ''}
                      onChange={(e) => setNodeFormData({ ...nodeFormData, variableName: e.target.value })}
                      className="w-full rounded border border-gray-600 bg-gray-700 px-2 py-1.5 text-white text-sm focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Prompt</label>
                    <input
                      type="text"
                      value={(nodeFormData.prompt as string) || ''}
                      onChange={(e) => setNodeFormData({ ...nodeFormData, prompt: e.target.value })}
                      className="w-full rounded border border-gray-600 bg-gray-700 px-2 py-1.5 text-white text-sm focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </>
              )}

              {selectedNode.data.type === 'condition' && (
                <>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Variable</label>
                    <input
                      type="text"
                      value={(nodeFormData.variable as string) || ''}
                      onChange={(e) => setNodeFormData({ ...nodeFormData, variable: e.target.value })}
                      className="w-full rounded border border-gray-600 bg-gray-700 px-2 py-1.5 text-white text-sm focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Operator</label>
                    <select
                      value={(nodeFormData.operator as string) || 'equals'}
                      onChange={(e) => setNodeFormData({ ...nodeFormData, operator: e.target.value })}
                      className="w-full rounded border border-gray-600 bg-gray-700 px-2 py-1.5 text-white text-sm focus:border-teal-500 focus:outline-none"
                    >
                      <option value="equals">Equals</option>
                      <option value="contains">Contains</option>
                      <option value="starts_with">Starts With</option>
                      <option value="is_empty">Is Empty</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Value</label>
                    <input
                      type="text"
                      value={(nodeFormData.value as string) || ''}
                      onChange={(e) => setNodeFormData({ ...nodeFormData, value: e.target.value })}
                      className="w-full rounded border border-gray-600 bg-gray-700 px-2 py-1.5 text-white text-sm focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </>
              )}

              {selectedNode.data.type === 'apiCall' && (
                <>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">URL</label>
                    <input
                      type="text"
                      value={(nodeFormData.url as string) || ''}
                      onChange={(e) => setNodeFormData({ ...nodeFormData, url: e.target.value })}
                      className="w-full rounded border border-gray-600 bg-gray-700 px-2 py-1.5 text-white text-sm focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Method</label>
                    <select
                      value={(nodeFormData.method as string) || 'GET'}
                      onChange={(e) => setNodeFormData({ ...nodeFormData, method: e.target.value })}
                      className="w-full rounded border border-gray-600 bg-gray-700 px-2 py-1.5 text-white text-sm focus:border-teal-500 focus:outline-none"
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                    </select>
                  </div>
                </>
              )}

              {selectedNode.data.type === 'setVariable' && (
                <>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Variable Name</label>
                    <input
                      type="text"
                      value={(nodeFormData.variableName as string) || ''}
                      onChange={(e) => setNodeFormData({ ...nodeFormData, variableName: e.target.value })}
                      className="w-full rounded border border-gray-600 bg-gray-700 px-2 py-1.5 text-white text-sm focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Value</label>
                    <input
                      type="text"
                      value={(nodeFormData.value as string) || ''}
                      onChange={(e) => setNodeFormData({ ...nodeFormData, value: e.target.value })}
                      className="w-full rounded border border-gray-600 bg-gray-700 px-2 py-1.5 text-white text-sm focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </>
              )}

              {(selectedNode.data.type === 'text' || selectedNode.data.type === 'quickReplies' ||
                selectedNode.data.type === 'buttons' || selectedNode.data.type === 'capture' ||
                selectedNode.data.type === 'condition' || selectedNode.data.type === 'apiCall' ||
                selectedNode.data.type === 'setVariable') && (
                <button
                  onClick={saveNodeData}
                  disabled={saving}
                  className="w-full bg-teal-600 text-white py-1.5 rounded text-sm hover:bg-teal-700 disabled:opacity-50 flex items-center justify-center gap-1"
                >
                  <Save size={14} /> {saving ? 'Saving...' : 'Save'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
