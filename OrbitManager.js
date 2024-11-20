/**
 * OrbitManager Class
 * 
 * This class manages the calculation of node positions in orbital layouts.
 * It handles:
 * - Grouping nodes by orbit levels
 * - Calculating positions in concentric circles
 * - Distributing nodes evenly within their orbits
 */
class OrbitManager {
    constructor() {
        this.orbitLevels = new Map();
    }

    calculateNodePositions(nodes, options = {}) {
        // Clear previous orbit levels at the start of calculation
        this.orbitLevels.clear();
        
        const {
            centerX = 0,
            centerY = 0,
            baseRadius = 1,
            spacing = 2
        } = options;

        // Group nodes by their orbit level
        nodes.forEach(node => {
            const level = node.orbitLevel || 1;
            if (!this.orbitLevels.has(level)) {
                this.orbitLevels.set(level, []);
            }
            this.orbitLevels.set(level, [...this.orbitLevels.get(level), node]);
        });

        // Calculate positions for each node
        const positionedNodes = [];
        this.orbitLevels.forEach((levelNodes, level) => {
            const radius = baseRadius * level * spacing;
            const angleStep = (2 * Math.PI) / levelNodes.length;

            levelNodes.forEach((node, index) => {
                const angle = angleStep * index;
                positionedNodes.push({
                    ...node,
                    x: centerX + radius * Math.cos(angle),
                    y: centerY + radius * Math.sin(angle),
                    orbitLevel: level
                });
            });
        });

        return positionedNodes;
    }
}