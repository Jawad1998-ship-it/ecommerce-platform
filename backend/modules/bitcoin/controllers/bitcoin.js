import fetch from "node-fetch";

// Helper function to add delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchBitcoinTransfers = async () => {
  const QUICKNODE_URL =
    "https://smart-cool-sanctuary.btc.quiknode.pro/4456e5f8467debd3132cc0cba429263ac9ceeb51/";
  const REQUEST_TIMEOUT = 10000; // 10 seconds timeout per request
  const DELAY_MS = 100; // 100ms delay between requests to avoid rate limits

  try {
    console.log("Fetching blockchain info...");
    // Get current blockchain info
    const blockchainInfoResponse = await fetch(QUICKNODE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getblockchaininfo",
        params: [],
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT),
    });
    const blockchainInfo = await blockchainInfoResponse.json();
    if (blockchainInfo.error) throw new Error(blockchainInfo.error.message);
    const latestBlockHeight = blockchainInfo.result.blocks;
    console.log(`Latest block height: ${latestBlockHeight}`);

    // Estimate blocks in the last hour (1 block ~10 min, so ~6 blocks)
    const blocksToCheck = 6;
    const oneHourAgo = Math.floor(Date.now() / 1000) - 3600;
    console.log(
      `Looking for blocks after: ${new Date(oneHourAgo * 1000).toISOString()}`
    );

    let transfers = [];

    // Iterate over the last few blocks
    for (
      let height = latestBlockHeight;
      height > latestBlockHeight - blocksToCheck;
      height--
    ) {
      console.log(`Processing block height: ${height}`);
      // Get block hash
      await delay(DELAY_MS);
      const blockHashResponse = await fetch(QUICKNODE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 2,
          method: "getblockhash",
          params: [height],
        }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT),
      });
      const blockHashData = await blockHashResponse.json();
      if (blockHashData.error) {
        console.warn(
          `Skipping block ${height}: ${blockHashData.error.message}`
        );
        continue;
      }
      const blockHash = blockHashData.result;

      // Get block details
      await delay(DELAY_MS);
      const blockResponse = await fetch(QUICKNODE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 3,
          method: "getblock",
          params: [blockHash, 2],
        }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT),
      });
      const blockData = await blockResponse.json();
      if (blockData.error) {
        console.warn(`Skipping block ${blockHash}: ${blockData.error.message}`);
        continue;
      }
      const block = blockData.result;

      // Check if block is within the last hour
      if (block.time < oneHourAgo) {
        console.log(
          `Block ${blockHash} is too old: ${new Date(
            block.time * 1000
          ).toISOString()}`
        );
        continue;
      }
      console.log(
        `Processing block ${blockHash} at ${new Date(
          block.time * 1000
        ).toISOString()}`
      );

      // Process each transaction
      for (const tx of block.tx) {
        if (tx.vin[0].coinbase) continue; // Skip coinbase transactions

        await delay(DELAY_MS);
        const txResponse = await fetch(QUICKNODE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 4,
            method: "getrawtransaction",
            params: [tx.txid, true],
          }),
          signal: AbortSignal.timeout(REQUEST_TIMEOUT),
        });
        const txData = await txResponse.json();
        if (txData.error) {
          console.warn(
            `Skipping transaction ${tx.txid}: ${txData.error.message}`
          );
          continue;
        }
        const transaction = txData.result;

        // Extract sender and recipient
        for (const vout of transaction.vout) {
          const amount = vout.value;
          const recipient = vout.scriptPubKey.addresses
            ? vout.scriptPubKey.addresses[0]
            : "Unknown";
          let sender = "Unknown";

          // Simplified sender derivation (optional to reduce requests)
          if (transaction.vin[0].txid) {
            try {
              await delay(DELAY_MS);
              const prevTxResponse = await fetch(QUICKNODE_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  jsonrpc: "2.0",
                  id: 5,
                  method: "getrawtransaction",
                  params: [transaction.vin[0].txid, true],
                }),
                signal: AbortSignal.timeout(REQUEST_TIMEOUT),
              });
              const prevTxData = await prevTxResponse.json();
              if (
                prevTxData.result &&
                prevTxData.result.vout[transaction.vin[0].vout]
              ) {
                const prevVout =
                  prevTxData.result.vout[transaction.vin[0].vout];
                sender = prevVout.scriptPubKey.addresses
                  ? prevVout.scriptPubKey.addresses[0]
                  : "Unknown";
              }
            } catch (err) {
              console.warn(
                `Failed to fetch sender for tx ${tx.txid}: ${err.message}`
              );
            }
          }

          transfers.push({
            sender,
            recipient,
            amount,
            time: new Date(block.time * 1000).toISOString(),
            blockHash,
          });
        }
      }
    }

    // Sort and get top 10 transfers
    transfers.sort((a, b) => b.amount - a.amount);
    const topTransfers = transfers.slice(0, 10);

    // Output results
    console.log("\nTop 10 Bitcoin Transfers in the Last Hour:");
    if (topTransfers.length === 0) {
      console.log("No transfers found in the last hour.");
    } else {
      topTransfers.forEach((transfer, index) => {
        console.log(
          `${index + 1}. Sender: ${transfer.sender}, Recipient: ${
            transfer.recipient
          }, ` +
            `Amount: ${transfer.amount} BTC, Time: ${transfer.time}, Block Hash: ${transfer.blockHash}`
        );
      });
    }

    return topTransfers;
  } catch (error) {
    console.error("Fatal Error:", error.message);
    return [];
  }
};

fetchBitcoinTransfers();
