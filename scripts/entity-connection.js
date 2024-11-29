// Connection Class
class Connection {
    constructor(p, { sourceId, targetId, type }, nodesMap) {
      this.p = p; // Reference to p5 instance
      this.source = nodesMap[sourceId];
      this.target = nodesMap[targetId];
      this.type = type; // 'solid', 'dashed', etc.
    }
  
    drawConnection() {
      // Ensure source and target are defined
      if (!this.source || !this.target) {
        console.warn('Cannot draw connection: source або target є невизначеним.');
        return;
      }
  
      this.p.push();
      this.p.stroke(20);
      this.p.strokeWeight(1);
  
      if (this.type === 'dashed') {
          this.p.drawingContext.setLineDash([2, 2]);
      } else {
          this.p.drawingContext.setLineDash([]);
      }
  
      this.p.line(this.source.x, this.source.y, this.target.x, this.target.y);
  
      this.p.pop();
    }
  }