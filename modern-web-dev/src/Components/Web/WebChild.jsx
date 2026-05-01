import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { LASTFM_CONFIG } from '../../Services/LastFm/config';

export default function WebGraph({ data, connectionType }) {
  const svgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [draggedNode, setDraggedNode] = useState(null);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [hoveredGroup, setHoveredGroup] = useState(null);
  const animationRef = useRef(null);

  // Fetch avatar from Last.fm user.getinfo
  const fetchAvatar = async (lastfmUsername) => {
    try {
      const response = await fetch(
        `${LASTFM_CONFIG.BASE_URL}?method=user.getinfo&user=${lastfmUsername}&api_key=${LASTFM_CONFIG.API_KEY}&format=json`
      );
      const json = await response.json();
      return json.user?.image?.[2]?.['#text'] || null;
    } catch {
      return null;
    }
  };

  // Initialize nodes with random positions and fetch avatars
  useEffect(() => {
    if (data.nodes.length === 0) return;

    const width = window.innerWidth - 400;
    const height = 600;

    // Initialize nodes with positions
    const initializedNodes = data.nodes.map((node, index) => {
      const angle = (index / data.nodes.length) * 2 * Math.PI;
      const radius = Math.min(width, height) * 0.25;
      return {
        ...node,
        x: width / 2 + Math.cos(angle) * radius + (Math.random() - 0.5) * 50,
        y: height / 2 + Math.sin(angle) * radius + (Math.random() - 0.5) * 50,
        vx: 0,
        vy: 0
      };
    });

    // Initialize links - store as plain IDs
    const initializedLinks = data.links.map(link => ({
      source: typeof link.source === 'object' ? link.source.id || link.source.objectId : link.source,
      target: typeof link.target === 'object' ? link.target.id || link.target.objectId : link.target,
      type: link.type,
      items: link.items,
      strength: link.strength
    }));

    setNodes(initializedNodes);
    setLinks(initializedLinks);
    console.log('Initialized links:', initializedLinks);
    console.log('Initialized nodes:', initializedNodes.map(n => n.id));
    setDimensions({ width: Math.max(800, width), height });
  }, [data]);

  // Fetch avatars for all nodes
  useEffect(() => {
    if (nodes.length === 0) return;

    const fetchAvatars = async () => {
      const updatedNodes = await Promise.all(
        nodes.map(async (node) => {
          if (node.lastfmUsername && !node.avatarUrl) {
            const avatarUrl = await fetchAvatar(node.lastfmUsername);
            return { ...node, avatarUrl };
          }
          return node;
        })
      );
      setNodes(updatedNodes);
    };

    fetchAvatars();
  }, [nodes.length]);

  // Force-directed graph simulation
  useEffect(() => {
    if (nodes.length === 0) return;

    const simulate = () => {
      setNodes(prevNodes => {
        const newNodes = prevNodes.map(node => ({ ...node }));
        const width = dimensions.width;
        const height = dimensions.height;

        // Apply forces
        newNodes.forEach((node, i) => {
          // Center force
          node.vx += (width / 2 - node.x) * 0.01;
          node.vy += (height / 2 - node.y) * 0.01;

          // Repulsion between all nodes
          newNodes.forEach((other, j) => {
            if (i === j) return;
            const dx = node.x - other.x;
            const dy = node.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = 1000 / (distance * distance);
            node.vx += (dx / distance) * force;
            node.vy += (dy / distance) * force;
          });
        });

        // Link attraction
        links.forEach(link => {
          const sourceIndex = newNodes.findIndex(n => n.id === link.source || n.id === link.source?.id);
          const targetIndex = newNodes.findIndex(n => n.id === link.target || n.id === link.target?.id);
          
          if (sourceIndex !== -1 && targetIndex !== -1) {
            const source = newNodes[sourceIndex];
            const target = newNodes[targetIndex];
            const dx = target.x - source.x;
            const dy = target.y - source.y;
            const distance = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = (distance - 100) * 0.05;
            
            source.vx += (dx / distance) * force;
            source.vy += (dy / distance) * force;
            target.vx -= (dx / distance) * force;
            target.vy -= (dy / distance) * force;
          }
        });

        // Apply velocity with damping
        return newNodes.map(node => ({
          ...node,
          x: node.x + node.vx * 0.5,
          y: node.y + node.vy * 0.5,
          vx: node.vx * 0.8,
          vy: node.vy * 0.8
        }));
      });

      animationRef.current = requestAnimationFrame(simulate);
    };

    animationRef.current = requestAnimationFrame(simulate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [nodes.length, links.length, dimensions]);

  const handleMouseDown = (node) => (e) => {
    e.preventDefault();
    setDraggedNode(node);
  };

  const handleMouseMove = useCallback((e) => {
    if (!draggedNode || !svgRef.current) return;
    
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setNodes(prev => prev.map(node => 
      node.id === draggedNode.id 
        ? { ...node, x, y, vx: 0, vy: 0 }
        : node
    ));
  }, [draggedNode]);

  const handleMouseUp = () => {
    setDraggedNode(null);
  };

  const getConnectionLabel = (type) => {
    switch (type) {
      case 'tracks': return 'Shared Songs';
      case 'artists': return 'Similar Artists';
      case 'albums': return 'Shared Albums';
      case 'tags': return 'Similar Genres';
      default: return 'Connected';
    }
  };

  // Get label text for a link
  const getLinkLabel = (link) => {
    if (!link.items || link.items.length === 0) return null;
    const firstItem = link.items[0];
    if (link.type === 'tracks' && firstItem.artist) {
      return `${firstItem.name} - ${firstItem.artist}`;
    }
    return firstItem.name;
  };

  return (
    <div className="webGraph relative">
      <svg
        ref={svgRef}
        width="100%"
        height={dimensions.height}
        className="bg-card rounded-lg border"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="groupGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Links */}
        <g className="links">
          {links.map((link, index) => {
            const sourceNode = nodes.find(n => n.id === link.source);
            const targetNode = nodes.find(n => n.id === link.target);
            
            if (!sourceNode || !targetNode) {
              console.log('Missing node for link:', link, 'nodes:', nodes.map(n => n.id));
              return null;
            }

            const isHovered = hoveredLink === index;

            return (
              <g key={`link-${index}`}>
                {/* Main line - gets thicker on hover */}
                <line
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke={isHovered ? "#2563eb" : "#888"}
                  strokeWidth={isHovered ? 4 : 2}
                  strokeLinecap="round"
                  className="transition-all duration-150"
                />
                
                {/* Invisible wider hit area for hover */}
                <line
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke="transparent"
                  strokeWidth={20}
                  className="cursor-pointer"
                  onClick={() => setSelectedNode({ 
                    ...link, 
                    sourceNode, 
                    targetNode 
                  })}
                  onMouseEnter={() => setHoveredLink(index)}
                  onMouseLeave={() => setHoveredLink(null)}
                />
              </g>
            );
          })}
        </g>

        {/* Nodes */}
        <g className="nodes">
          {nodes.map((node) => {
            // Get initials from name
            const getInitials = (name) => {
              if (!name) return '?';
              const parts = name.split(' ');
              if (parts.length >= 2) {
                return (parts[0][0] + parts[1][0]).toUpperCase();
              }
              return name.charAt(0).toUpperCase();
            };
            
            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                className="cursor-pointer"
                onClick={() => setSelectedNode(node)}
                onMouseDown={handleMouseDown(node)}
              >
                {/* Outer glow for current user */}
                {node.isCurrentUser && (
                  <circle
                    r={38}
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    strokeOpacity={0.6}
                    filter="url(#glow)"
                  />
                )}
                
                {/* Node circle with white background */}
                <circle
                  r={node.isCurrentUser ? 32 : 28}
                  fill="white"
                  stroke={node.isCurrentUser ? "hsl(var(--primary))" : "#ccc"}
                  strokeWidth={2}
                />
                
                {/* Profile Picture or initials */}
                {node.avatarUrl ? (
                  <>
                    <defs>
                      <clipPath id={`clip-${node.id}`}>
                        <circle r={24} />
                      </clipPath>
                    </defs>
                    <image
                      href={node.avatarUrl}
                      x={-24}
                      y={-24}
                      width={48}
                      height={48}
                      clipPath={`url(#clip-${node.id})`}
                    />
                  </>
                ) : (
                  <text
                    textAnchor="middle"
                    dy={5}
                    fill={node.isCurrentUser ? "hsl(var(--primary))" : "#333"}
                    fontSize={16}
                    fontWeight="bold"
                  >
                    {getInitials(node.name)}
                  </text>
                )}
                
                {/* User name label - only show for current user */}
                {node.isCurrentUser && (
                  <text
                    textAnchor="middle"
                    dy={50}
                    fill="#333"
                    fontSize={11}
                    fontWeight="bold"
                  >
                    You
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm p-3 rounded-lg border text-sm">
        <div className="font-medium mb-1">Connection Type</div>
        <div className="text-muted-foreground">{getConnectionLabel(connectionType)}</div>
        <div className="mt-2 text-xs text-muted-foreground">
          Drag nodes to reposition
        </div>
      </div>

      {/* Selected node info panel */}
      {selectedNode && (
        <div className="absolute top-4 right-4 bg-white p-4 rounded-lg border shadow-lg max-w-xs">
          <button
            onClick={() => setSelectedNode(null)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-lg"
          >
            ×
          </button>
          
          {selectedNode.sourceNode ? (
            // Link selected
            <>
              <h3 className="font-semibold mb-2">Connection</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  {selectedNode.sourceNode.avatarUrl ? (
                    <img src={selectedNode.sourceNode.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                      {selectedNode.sourceNode.name?.charAt(0) || '?'}
                    </div>
                  )}
                  <span>{selectedNode.sourceNode.isCurrentUser ? 'You' : selectedNode.sourceNode.name}</span>
                </div>
                <div className="text-center text-gray-400">↔</div>
                <div className="flex items-center gap-2">
                  {selectedNode.targetNode.avatarUrl ? (
                    <img src={selectedNode.targetNode.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-bold">
                      {selectedNode.targetNode.name?.charAt(0) || '?'}
                    </div>
                  )}
                  <span>{selectedNode.targetNode.name}</span>
                </div>
                <div className="pt-2 border-t">
                  <span className="text-gray-500">Connected via: </span>
                  <span className="font-medium">{getConnectionLabel(selectedNode.type)}</span>
                </div>
                {selectedNode.items && selectedNode.items.length > 0 && (
                  <div className="pt-2 space-y-1">
                    <span className="text-xs text-gray-500">Shared:</span>
                    {selectedNode.items.map((item, i) => (
                      <div key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {item.artist ? `${item.name} - ${item.artist}` : item.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            // Node selected
            <>
              <h3 className="font-semibold mb-2">{selectedNode.name}</h3>
              {selectedNode.lastfmUsername && (
                <div className="text-sm text-gray-500 mb-2">
                  Last.fm: {selectedNode.lastfmUsername}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Empty state */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-muted-foreground">No connections to display</p>
        </div>
      )}
    </div>
  );
}