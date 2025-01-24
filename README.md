# Riskophobe Subgraph

This repository contains the Graph Protocol subgraph for the Riskophobe protocol. The subgraph indexes on-chain data related to Riskophobe's decentralized options trading, making it easily queryable via GraphQL. It provides a backend data layer for seamless integration with the Riskophobe dApp.

---

## Overview

The Riskophobe Subgraph is designed to index and expose critical data points, including:

- **Offer Creation**: Tracks new option offers created on-chain.
- **Token Transactions**: Logs token purchases, returns, and collateral events.
- **Fee Collection**: Captures fees accrued by offer creators.
- **Event History**: Provides a comprehensive history of protocol interactions.

By leveraging The Graph, this repository ensures a fast and reliable way to fetch and display data for users of the Riskophobe dApp.

---

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Graph CLI](https://thegraph.com/docs/en/developer/)

---

## Installation

### Clone the Repository

```bash
# Clone the repository
$ git clone https://github.com/BenAzlay/riskophobe-subgraph.git

# Navigate into the project directory
$ cd riskophobe-subgraph
```

### Install Dependencies

```bash
# Using npm
$ npm install

# Or using yarn
$ yarn install
```

---

## Development

### Code Generation

The Riskophobe Subgraph uses the ABI of the Riskophobe smart contract to generate GraphQL schema types. To generate the necessary files, run:

```bash
# Generate code for the subgraph
$ npm run codegen

# Or using yarn
$ yarn codegen
```

### Build the Subgraph

To compile the subgraph and ensure there are no errors:

```bash
# Build the subgraph
$ npm run build

# Or using yarn
$ yarn build
```

### Deploy the Subgraph

1. Update the `subgraph.yaml` file with the appropriate network and contract address.
2. Authenticate with The Graph using the Graph CLI:
   ```bash
   $ graph auth --product hosted-service <ACCESS_TOKEN>
   ```
3. Deploy the subgraph:
   ```bash
   # Deploy to The Graph's hosted service
   $ npm run deploy

   # Or using yarn
   $ yarn deploy
   ```

---

## Querying the Subgraph

After deployment, you can query the subgraph using any GraphQL client. For example, with `graphql-request`:

```typescript
import { request, gql } from 'graphql-request';

const endpoint = 'https://api.studio.thegraph.com/query/27003/riskophobe-base/version/latest';

const query = gql`
  {
    offers {
      id
      creator
      collateralToken
      soldToken
      soldTokenAmount
      exchangeRate
    }
  }
`;

request(endpoint, query).then((data) => console.log(data));
```

---

## Project Structure

The repository is structured as follows:

```
subgraph/
├── subgraph.yaml        # Subgraph configuration
├── schema.graphql       # GraphQL schema definition
├── mappings/            # AssemblyScript mappings for events
│   ├── Riskophobe.ts    # Event handlers for Riskophobe protocol
├── generated/           # Auto-generated types
│   ├── schema.ts        # GraphQL schema types
│   ├── Riskophobe.ts    # Contract ABIs
```

---

## Technology Stack

- **Graph Protocol**: Framework for decentralized data indexing
- **GraphQL**: Query language for API integration
- **AssemblyScript**: Event handler mappings
- **Hardhat**: Development framework for Ethereum smart contracts

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

