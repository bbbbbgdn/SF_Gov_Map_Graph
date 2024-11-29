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

// departamentHead
// advisory
// commission
// department
// civilian
// elected
// relationship
// commissioner

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
        case 'departamenthead':
          return 5;
      case 'advisory':
        return 4;
      // case 'commissioner':
      //   return 6;
      default:
        return 6;
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
    
    categories.forEach(category => {
        if (rawData[category] && category !== 'relationship') {
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
    
    // Process the relationship array directly
    if (rawData.relationship) {
        rawData.relationship.forEach(rel => {
            transformedConnections.push({
                sourceId: rel.source,
                targetId: rel.target,
                type: getConnectionType(rel.type)
            });
        });
    }

    // console.log('transformedConnections', transformedConnections);
  
    return {
      nodes: transformedNodes,
      connections: transformedConnections
    };
  }