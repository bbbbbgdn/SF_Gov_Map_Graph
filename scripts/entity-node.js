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
          return this.p.color(255, 251, 0); // 1st center yellow
        case 'elected': 
          return this.p.color(255, 204, 110); // 2nd orbit orange
        case 'commission':
          return this.p.color(219, 185, 250); // 3rd orbit violet
        case 'department':
          return this.p.color(115, 90, 252); // 4th orbit purple
        case 'advisory':
          return this.p.color(134, 217, 255); // 3rd orbit light blue
        case 'departamentHead':
          return this.p.color(255, 165, 0); // Orange
        case 'commissioner':
          return this.p.color(255, 215, 0); // Gold
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
          return 'square';
        case 'department':
          return 'square';
        case 'advisory':
          return 'diamond';
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
        this.p.rectMode(this.p.CENTER);
        this.p.rect(this.x, this.y, this.size, this.size);
      } else if (this.shape === 'diamond') {
        this.p.beginShape();
        for (let i = 0; i < 6; i++) {
          const angle = i * this.p.TWO_PI / 6;
          const px = this.x + this.size/2 * this.p.cos(angle);
          const py = this.y + this.size/2 * this.p.sin(angle);
          this.p.vertex(px, py);
        }
        this.p.endShape(this.p.CLOSE);
      }
      this.p.pop();
    }
  
    isMouseOver(mx, my) {
      return this.p.dist(mx, my, this.x, this.y) < this.size / 2;
    }
  }
  