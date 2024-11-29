/**
 * GraphVisualization Class
 * 
 * This class manages the visualization of a graph structure using p5.js.
 * It handles:
 * - Node positioning in orbital layouts around a central node
 * - Connection rendering between nodes
 * - Interactive features like hover, click, and zoom
 * - Node organization using an OrbitManager for concentric circle layouts
 * - Tooltip display for node information
 */

// GraphVisualization Class
class GraphVisualization {
    constructor(p, data, width, height) {
      this.p = p;
      this.data = data;
      this.width = width;
      this.height = height;
      this.nodes = [];
      this.connections = [];
      this.nodesMap = {};
      this.tooltip = this.p.select('#tooltip');
      this.currentMode = 'default';
      this.selectedNode = null;
      
      // Add hoveredNode to track the currently hovered node
      this.hoveredNode = null;

      this.orbitManager = new OrbitManager();
      this.orbitConfig = {
          spacing: 70,
      };
      this.init();
    }
  
    init() {
        console.log('this.data', this.data)

        // Position all nodes using OrbitManager
        const nodePositions = this.orbitManager.calculateNodePositions(this.data.nodes, {
            centerX: this.width / 2,
            centerY: this.height / 2,
            ...this.orbitConfig
        });
  
        // Create nodes using node positions
        nodePositions.forEach(nodeData => {
            const node = new sfNode(this.p, nodeData);
            node.setPosition(nodeData.x, nodeData.y);
            this.nodes.push(node);
            this.nodesMap[node.id] = node;
        });
  
        // Create Connections
        this.data.connections.forEach(connData => {
            const connection = new Connection(this.p, connData, this.nodesMap);
            if (connection.source && connection.target) {
                this.connections.push(connection);
            } else {
                console.warn(`Connection with sourceId: ${connData.sourceId} або targetId: ${connData.targetId} є невірним.`);
            }
        });

        console.log('this.connections', this.connections);
    }
  
    draw() {
        // Clear the canvas if needed
        this.p.clear();

        // Draw Connections only if a node is hovered
        if (this.hoveredNode) {
            this.connections.forEach(connection => {
                if (
                    (connection.source && connection.source.id === this.hoveredNode.id) ||
                    (connection.target && connection.target.id === this.hoveredNode.id)
                ) {
                    connection.drawConnection();
                }
            });
        }

        // Draw Nodes
        this.nodes.forEach(node => node.drawNode());
    }
  
    handleHover(mx, my) {
      let hovered = false;
      this.hoveredNode = null;

      this.nodes.forEach(node => {
        if (node.isMouseOver(mx, my)) {
          hovered = true;
          this.hoveredNode = node;
          this.tooltip
            .style('left', `${mx + 10}px`)
            .style('top', `${my + 10}px`)
            .style('visibility', 'visible')
            .html(node.label);
        }
      });
      if (!hovered) {
        this.tooltip.style('visibility', 'hidden');
      }
    }
  
    handleClick(mx, my) {
      let clickedNode = null;
      this.nodes.forEach(node => {
        if (node.isMouseOver(mx, my)) {
          clickedNode = node;
        }
      });
  
      if (clickedNode) {
        console.log({
            label: clickedNode.label,
            type: clickedNode.type,
            size: clickedNode.size,
            color: clickedNode.color,
            shape: clickedNode.shape,
            id: clickedNode.id,
        });
        
        this.selectedNode = clickedNode;
        this.switchMode('zoom');
      } else {
        this.switchMode('default');
      }
    }
  
    switchMode(mode) {
      this.currentMode = mode;
      if (mode === 'zoom' && this.selectedNode) {
        this.zoomIntoNode(this.selectedNode);
      } else {
        this.resetView();
      }
    }
  
    zoomIntoNode(node) {
      // Get all directly connected nodes
      const connectedNodes = this.connections
        .filter(conn => conn.source === node || conn.target === node)
        .map(conn => conn.source === node ? conn.target : conn.source);

      console.log('Zooming into node:', {
        selectedNode: node.label,
        connectedNodes: connectedNodes.map(n => n.label)
      });
      
      // TODO: Implement actual zooming using the zoomToFit function
      // this.zoomToFit([node, ...connectedNodes]);
    }
  
    resetView() {
      this.selectedNode = null;
      console.log('Resetting to default view');
      // Reset any transformations or highlights.
    }
  
    handleZoom(amount) {
      // Implement zoom functionality (e.g., scaling or translating the view)
      // This example does not include actual zooming logic.
      // console.log(`Zoom amount: ${amount}`);
    }
  
    windowResized(newWidth, newHeight) {
      this.width = newWidth;
      this.height = newHeight;
      
      // Reuse same configuration, only update center position
      const nodePositions = this.orbitManager.calculateNodePositions(this.data.nodes, {
          centerX: this.width / 2,
          centerY: this.height / 2,
          ...this.orbitConfig
      });
      
      nodePositions.forEach(nodeData => {
          const node = this.nodesMap[nodeData.id];
          if (node) {
              node.setPosition(nodeData.x, nodeData.y);
          }
      });
    }
  }