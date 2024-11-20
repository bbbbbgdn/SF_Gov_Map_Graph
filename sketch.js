// sketch.js
let graphData;

// Example data
// graphData = {
//   "departamentHead": [
//     {
//       "id": "070d2611-a338-481d-a367-f3213cd8dd5c",
//       "name": "Municipal Transportation Agency, Executive Director/CEO",
//       "description": null,
//     }
//   ],
//   "advisory": [
//     {
//       "id": "04702151-1370-40da-9812-92aecc1f13c9",
//       "name": "Commission on Aging Advisory Council",
//       "legalSource": "Administrative Code Sec. 5.6-4",
//       "url": "https://www.sfhsa.org/about/commissions-committees/advisory-council-disability-and-aging-services-commission",
//       "description": null,
//     }
//   ],
//   "commission": [
//     {
//       "id": "057d151b-986e-4c59-abaa-38a04bd0d4a3",
//       "name": "Homelessness Oversight Commission",
//       "legalSource": "Charter Sec. 4.133",
//       "url": "https://hsh.sfgov.org/commission-and-committees/",
//       "description": null,
//     }
//   ],
//   "department": [
//     {
//       "id": "06631b00-35fe-4d63-8018-e6357ff73d92",
//       "name": "Department of Police Accountability",
//       "legalSource": "Campaign & Governmental Conduct Code Sec. 3.1-103(b)(1)",
//       "url": null,
//       "description": null,
//       "departmentHead": null,
//       "numEmployees": null
//     }
//   ]
// };

// Function to determine orbit level based on node type


// Node Class
class sfNode {
  constructor(p, { id, label, type }) {
    this.p = p; // Reference to p5 instance
    this.id = id;
    this.label = label;
    this.type = type; // 'central', 'elected', 'appointed', 'department' 
    this.x = 0;
    this.y = 0;
    this.size = 15;
    this.color = this.assignColor();
    this.shape = this.assignShape();
    this.orbit = null;
  }

  assignColor() {
    switch (this.type) {
      case 'civilian':
        return this.p.color(255, 140, 0); // Orange
      case 'elected': 
        return this.p.color(30, 144, 255); // Dodger Blue
      case 'commission':
        return this.p.color(34, 139, 34); // Forest Green
      case 'department':
        return this.p.color(128, 0, 128); // Purple
      case 'advisory':
        return this.p.color(255, 20, 147); // Deep Pink
      default:
        return this.p.color(100); // Gray
    }
  }

  assignShape() {
    switch (this.type) {
      case 'civilian':
        return 'circle';
      case 'elected':
        return 'circle'; 
      case 'commission':
        return 'diamond';
      case 'department':
        return 'square';
      case 'advisory':
        return 'circle';
      default:
        return 'circle';
    }
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  setOrbit(orbit) {
    this.orbit = orbit;
  }

  drawNode() {
    this.p.push();
    // this.p.noStroke();
    this.p.fill(this.color);
    if (this.shape === 'circle') {
      this.p.ellipse(this.x, this.y, this.size, this.size);
    } else if (this.shape === 'square') {
      this.p.rect(this.x, this.y, this.size, this.size);
    } else if (this.shape === 'diamond') {
      this.p.ellipse(this.x, this.y, this.size, this.size/2);
    }
    this.p.pop();
  }

  isMouseOver(mx, my) {
    return this.p.dist(mx, my, this.x, this.y) < this.size / 2;
  }
}

// Connection Class
class Connection {
  constructor(p, { sourceId, targetId, type }, nodesMap) {
    this.p = p; // Reference to p5 instance
    this.source = nodesMap[sourceId];
    this.target = nodesMap[targetId];
    this.type = type; // 'solid', 'dashed', etc.
  }

  drawConnection() {
    this.p.push();
    this.p.stroke(150);
    this.p.strokeWeight(2);

    // Debug: Log the type of connection
    console.log('Connection type:', this.type);

    if (this.type === 'dashed') {
        this.p.drawingContext.setLineDash([5, 5]);
    } else {
        this.p.drawingContext.setLineDash([]);
    }

    // Debug: Log the source and target positions
    console.log('Source:', this.source);
    console.log('Target:', this.target);

    // Check if source and target are defined
    if (this.source && this.target) {
        this.p.line(this.source.x, this.source.y, this.target.x, this.target.y);
    } else {
        console.log('Source or target is undefined');
    }

    this.p.pop();
  }
}

// // Orbit Class
// class Orbit {
//   constructor(p, centerNode, level, totalNodes) {
//     this.p = p; // Reference to p5 instance
//     this.center = centerNode;
//     this.level = level;
//     this.radius = 10 * level/100; // Adjust spacing as needed
//     this.nodes = [];
//     this.totalNodes = totalNodes;
//   }

//   addNode(node, index) {
//     this.nodes.push(node);
//     node.setOrbit(this);
//     const angle = (this.p.TWO_PI / this.totalNodes) * index;
//     node.setPosition(
//       this.center.x + this.radius * this.p.cos(angle),
//       this.center.y + this.radius * this.p.sin(angle)
//     );
//   }

//   drawOrbit() {
//     this.p.push();
//     this.p.noFill();
//     this.p.stroke(200, 200, 200, 50);
//     this.p.strokeWeight(1);
//     this.p.ellipse(this.center.x, this.center.y, this.radius * 2, this.radius * 2);
//     this.p.pop();
//   }
// }



// p5.js Sketch in Instance Mode
const sketch = (p) => {
  let graph;

  p.preload = () => {
    if (graphData === undefined) {
      graphData = p.loadJSON('./data.json');
    }
  };

  p.setup = () => {
    p.print('graphData', graphData);

    p.createCanvas(window.innerWidth, window.innerHeight);
    graphData = transformData(graphData);
    graph = new GraphVisualization(p, graphData, p.width, p.height);
  };

  p.draw = () => {
    p.background(30);
    if (graph) {
      graph.draw();
    } else {
      // Draw loading state
      p.push();
      p.textAlign(p.CENTER, p.CENTER);
      p.text('Loading...', p.width/2, p.height/2);
      p.pop();
    }
  };

  p.windowResized = () => {
    // alert('window resized'); 
    p.resizeCanvas(window.innerWidth, window.innerHeight);
    if (graph) {
      graph.windowResized(p.width, p.height); 
    }
  };

  p.mouseMoved = () => {
    if (graph) {
      graph.handleHover(p.mouseX, p.mouseY);
    }
  };

  p.mouseClicked = () => {
    if (graph) {
      graph.handleClick(p.mouseX, p.mouseY);
    }
  };

  p.mouseWheel = (event) => {
    if (graph) {
      graph.handleZoom(event.delta);
    }
  };
};

// Initialize p5.js in Instance Mode
new p5(sketch);  