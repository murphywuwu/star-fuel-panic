import { SuiJsonRpcClient } from "@mysten/sui/jsonRpc";

const TESTNET_RPC = "https://fullnode.testnet.sui.io:443";
const NODE_ID = "0xcbf87e8939e23c9d5c09c63d0dcb9d2c3ce4a446be307c33145dc02508ce8779";

async function inspectNode() {
  const client = new SuiJsonRpcClient({
    network: "testnet",
    url: TESTNET_RPC
  });

  const node = await client.getObject({
    id: NODE_ID,
    options: {
      showContent: true,
      showOwner: true,
      showType: true,
      showDisplay: true
    }
  });

  console.log(JSON.stringify(node, null, 2));
}

inspectNode();
