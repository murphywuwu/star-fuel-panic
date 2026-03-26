import { SuiJsonRpcClient } from "@mysten/sui/jsonRpc";

const TESTNET_RPC = "https://fullnode.testnet.sui.io:443";
const PACKAGE_ID = "0xd12a70c74c1e759445d6f209b01d43d860e97fcf2ef72ccbbd00afd828043f75";

async function checkPackage() {
  const client = new SuiJsonRpcClient({
    network: "testnet",
    url: TESTNET_RPC
  });

  console.log(`Checking package ${PACKAGE_ID} on testnet...`);

  try {
    const pkg = await client.getObject({
      id: PACKAGE_ID,
      options: {
        showContent: true,
        showType: true
      }
    });

    if (pkg.error) {
      console.log(`❌ Package not found on testnet: ${pkg.error.code}`);
      console.log(`This package might be on a different network (devnet, mainnet, or EVE Frontier specific network)`);
    } else {
      console.log(`✅ Package found on testnet!`);
      console.log(JSON.stringify(pkg.data, null, 2));
    }
  } catch (error) {
    console.error("Error querying package:", error.message);
  }

  // Try querying events
  console.log("\nQuerying NetworkNode events...");
  try {
    const events = await client.queryEvents({
      query: {
        MoveModule: {
          package: PACKAGE_ID,
          module: "network_node"
        }
      },
      limit: 5
    });

    console.log(`Found ${events.data.length} events`);
    if (events.data.length > 0) {
      console.log("Sample event:", JSON.stringify(events.data[0], null, 2));
    }
  } catch (error) {
    console.error("Error querying events:", error.message);
  }
}

checkPackage();
