// Test the exact same query logic used in nodeIndexerRuntime
import { getServerSuiClient } from "../src/server/suiClient.ts";

const PACKAGE_ID = process.env.EVE_FRONTIER_PACKAGE_ID?.trim() ||
  "0xd12a70c74c1e759445d6f209b01d43d860e97fcf2ef72ccbbd00afd828043f75";

async function testQuery() {
  const client = getServerSuiClient();

  console.log("Package ID:", PACKAGE_ID);
  console.log("Client network:", process.env.SUI_NETWORK || process.env.NEXT_PUBLIC_SUI_NETWORK);
  console.log("Client RPC:", process.env.SUI_RPC_URL || process.env.NEXT_PUBLIC_SUI_RPC_URL);

  console.log("\nQuerying NetworkNodeCreatedEvent...");

  const eventType = `${PACKAGE_ID}::network_node::NetworkNodeCreatedEvent`;
  console.log("Event type:", eventType);

  const result = await client.queryEvents({
    query: {
      MoveEventType: eventType
    },
    limit: 5
  });

  console.log(`Found ${result.data.length} events`);
  if (result.data.length > 0) {
    console.log("Sample event:", JSON.stringify(result.data[0], null, 2));
  }
}

testQuery().catch(console.error);
