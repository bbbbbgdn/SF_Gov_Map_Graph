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
    calculateNodePositions(nodes, options = {}) {
        const {
            centerX = 0,
            centerY = 0,
            baseRadius = 2,
            spacing = 1
        } = options;

        // Group nodes by orbit level
        const orbitGroups = new Map();
        
        nodes.forEach(node => {
            const level = node.orbitLevel;
            if (!orbitGroups.has(level)) {
                orbitGroups.set(level, []);
            }
            orbitGroups.get(level).push(node);
        });

        // Calculate positions for each node
        const positionedNodes = [];
        
        orbitGroups.forEach((nodesInOrbit, level) => {
            const radius = baseRadius + (level * spacing);
            const angleStep = (2 * Math.PI) / nodesInOrbit.length;

            nodesInOrbit.forEach((node, index) => {
                const angle = angleStep * index;
                positionedNodes.push({
                    ...node,
                    x: centerX + radius * Math.cos(angle),
                    y: centerY + radius * Math.sin(angle)
                });
            });
        });

        return positionedNodes;
    }
}