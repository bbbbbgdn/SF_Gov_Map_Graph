// sketch.js
let graphData;

// p5.js Sketch in Instance Mode
const sketch = (p) => {
  let graph;

  p.preload = () => {
    if (graphData === undefined) {
      graphData = p.loadJSON('./data_2.json');
      // https://sfg-civlab-org.vercel.app/data.json
      // graphData = p.loadJSON('https://sfg-civlab-org.vercel.app/data.json');
    }
  };

  p.setup = () => {
    p.print('graphData', graphData);

    p.createCanvas(window.innerWidth, window.innerHeight);
    graphData = transformData(graphData);
    graph = new GraphVisualization(p, graphData, p.width, p.height);
  };

  p.draw = () => {
    // p.background(30);
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
    p.clear();
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