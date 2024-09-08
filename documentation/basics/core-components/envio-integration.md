---
cover: >-
  https://images.unsplash.com/photo-1489875347897-49f64b51c1f8?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxOTcwMjR8MHwxfHNlYXJjaHwxfHxkYXRhYmFzZXxlbnwwfHx8fDE3MjU3ODM0NDN8MA&ixlib=rb-4.0.3&q=85
coverY: 0
---

# 📇 Envio Integration

### Overview

Our project utilizes Envio's HyperIndex to efficiently index blockchain data and serve it to our application. HyperIndex is designed to deliver superior performance and provide a seamless developer experience, which in turn optimizes the user experience of our application.

### Key Features

* **Real-time Data Indexing**: We use HyperIndex to index smart contract data in real-time.
* **High-Performance API**: HyperIndex allows us to build a real-time API for our blockchain application quickly and efficiently.
* **Seamless Integration**: The indexed data is seamlessly integrated into our application, enhancing its functionality and user experience.

### Use Cases

We have implemented Envio's HyperIndex for the following purposes:

* **Aave Contract Indexing**: We index Aave contracts to monitor real-time liquidity changes in Aave.
* **HyperHarvest Contract Indexing**: We index our HyperHarvest contract to power a real-time notification system, which works in conjunction with XMTP.

### Benefits

* **Enhanced Performance**: HyperIndex optimizes data retrieval, leading to faster and more responsive application behavior.
* **Real-time Updates**: Our application can provide users with up-to-the-minute information on liquidity and other critical data points.
* **Improved User Experience**: The combination of real-time data and efficient indexing results in a smoother, more informative user interface.

### Technical Implementation

#### **Setup and Indexing**

We followed Envio's quick and easy guide to set up and index the contracts:

**Resource**: [Envio HyperIndex Documentation](https://docs.envio.dev/docs/HyperIndex/overview)

#### **Subgraph Deployment**

We have deployed two subgraphs as part of our Envio integration:

1. Aave yield API: [https://indexer.bigdevenergy.link/93d433c/v1/graphql](https://indexer.bigdevenergy.link/93d433c/v1/graphql)
2. HyperHarvest Notifications API: [https://indexer.bigdevenergy.link/a861e6e/v1/graphql](https://indexer.bigdevenergy.link/a861e6e/v1/graphql)

These subgraphs serve as the backbone for our data querying and retrieval system, allowing us to efficiently access indexed blockchain data.

### Integration with XMTP

The Envio integration complements our XMTP implementation by providing the backend data infrastructure needed for real-time notifications and updates. When significant events occur (such as liquidity changes in Aave or updates in our HyperHarvest contract), the Envio-indexed data triggers notifications that are then sent to users via the XMTP messaging system.

### Conclusion

By integrating Envio's HyperIndex into our project, we've significantly enhanced our ability to provide real-time, accurate blockchain data to our users. This integration works hand-in-hand with our XMTP implementation to create a responsive, informative, and user-friendly application that keeps users updated on critical changes and events in real-time.
