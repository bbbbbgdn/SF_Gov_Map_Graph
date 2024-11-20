function getOrbitLevel(type) {
    switch (type.toLowerCase()) {
      case 'civilian':
        return 0;
      case 'elected':
        return 1;
      case 'commission':
        return 2;
      case 'department':
        return 3;
      case 'advisory':
        return 4;
      default:
        return 5;
    }
  }
  
  // Function to determine connection type based on relation
  function getConnectionType(relation) {
    switch (relation.toLowerCase()) {
      case 'reports_to':
        return 'solid';
      case 'appoints':
        return 'dashed';
      // Add more cases as needed
      default:
        return 'solid';
    }
  }
  
  // Function to transform the JSON data
  function transformData(rawData) {
    console.log("Raw data categories:", Object.keys(rawData));
    console.log("Civilian data:", rawData.civilian);
    const transformedNodes = [];
  
    // Transform nodes from each category
    const categories = Object.keys(rawData);
    // ['civilian', 'elected', 'departamentHead', 'advisory', 'commission', 'department'];
    
    categories.forEach(category => {
      if (rawData[category]) {
        rawData[category].forEach(node => {
          transformedNodes.push({
            id: node.id,
            label: node.name,
            type: category,
            description: node.description,
            seats: node.seats,
            orbitLevel: getOrbitLevel(category)
          });
        });
      }
    });
  
    // Transform relationships into connections
    const transformedConnections = [];
    
    categories.forEach(category => {
      if (rawData[category]) {
        rawData[category].forEach(node => {
          if (node.relationship) {
            node.relationship.forEach(rel => {
              transformedConnections.push({
                sourceId: node.id,
                targetId: rel.target,
                type: getConnectionType(rel.type)
              });
            });
          }
        });
      }
    });
  
    return {
      nodes: transformedNodes,
      connections: transformedConnections
    };
  }