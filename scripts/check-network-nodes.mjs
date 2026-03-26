import { SuiJsonRpcClient } from "@mysten/sui/jsonRpc";

const TESTNET_RPC = "https://fullnode.testnet.sui.io:443";
const PACKAGE_ID = "0xd12a70c74c1e759445d6f209b01d43d860e97fcf2ef72ccbbd00afd828043f75";

async function checkNetworkNodes() {
  const client = new SuiJsonRpcClient({
    network: "testnet",
    url: TESTNET_RPC
  });

  console.log("=== Checking NetworkNode module ===\n");

  // 1. Query all objects of NetworkNode type
  console.log("1. Querying NetworkNode objects...");
  try {
    const objects = await client.queryObjects({
      query: {
        StructType: `${PACKAGE_ID}::network_node::NetworkNode`
      },
      limit: 10
    });

    console.log(`Found ${objects.data.length} NetworkNode objects`);
    if (objects.data.length > 0) {
      console.log("First NetworkNode ID:", objects.data[0].data.objectId);

      // Get full details of first node
      const nodeDetails = await client.getObject({
        id: objects.data[0].data.objectId,
        options: {
          showContent: true,
          showOwner: true,
          showType: true,
          showDisplay: true
        }
      });

      console.log("\nSample NetworkNode:");
      console.log(JSON.stringify(nodeDetails.data, null, 2));
    }
  } catch (error) {
    console.error("Error querying NetworkNode objects:", error.message);
  }

  // 2. Query NetworkNodeCreatedEvent events
  console.log("\n2. Querying NetworkNodeCreatedEvent events...");
  try {
    const events = await client.queryEvents({
      query: {
        MoveEventType: `${PACKAGE_ID}::network_node::NetworkNodeCreatedEvent`
      },
      limit: 5
    });

    console.log(`Found ${events.data.length} NetworkNodeCreatedEvent events`);
    if (events.data.length > 0) {
      console.log("Sample event:", JSON.stringify(events.data[0], null, 2));
    }
  } catch (error) {
    console.error("Error querying events:", error.message);
  }

  // 3. Query all events from network_node module
  console.log("\n3. Querying all events from network_node module...");
  try {
    const events = await client.queryEvents({
      query: {
        MoveModule: {
          package: PACKAGE_ID,
          module: "network_node"
        }
      },
      limit: 10
    });

    console.log(`Found ${events.data.length} events from network_node module`);
    if (events.data.length > 0) {
      console.log("Event types:");
      events.data.forEach((event, index) => {
        console.log(`  ${index + 1}. ${event.type}`);
      });
    }
  } catch (error) {
    console.error("Error querying module events:", error.message);
  }

  // 4. Query LocationRevealedEvent
  console.log("\n4. Querying LocationRevealedEvent events...");
  try {
    const events = await client.queryEvents({
      query: {
        MoveEventType: `${PACKAGE_ID}::location::LocationRevealedEvent`
      },
      limit: 5
    });

    console.log(`Found ${events.data.length} LocationRevealedEvent events`);
    if (events.data.length > 0) {
      console.log("Sample event:", JSON.stringify(events.data[0], null, 2));
    }
  } catch (error) {
    console.error("Error querying LocationRevealedEvent:", error.message);
  }
}

checkNetworkNodes();
