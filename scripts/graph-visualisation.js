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
      this.orbitManager = new OrbitManager();
      this.orbitConfig = {
          baseRadius: 0,
          spacing: 60,
      };
      this.init();
    }
  
    init() {
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
            this.connections.push(connection);
        });

        console.log('this.connections', this.connections);
    }
  
    draw() {
    //   // Draw Orbits
    //   this.orbits.forEach(orbit => orbit.drawOrbit());
  
      // Draw Connections
      this.connections.forEach(connection => connection.drawConnection());
  
      // Draw Nodes
      this.nodes.forEach(node => node.drawNode());
    }
  
    handleHover(mx, my) {
      let hovered = false;
      this.nodes.forEach(node => {
        if (node.isMouseOver(mx, my)) {
          hovered = true;
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
      // For simplicity, this example doesn't implement actual zooming.
      // You can implement camera transformations or reposition nodes here.

      console.log(`Zooming into node: ${node.label}`);
      // Implement highlighting and opacity changes as needed.
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