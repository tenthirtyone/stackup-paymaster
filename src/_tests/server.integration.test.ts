import assert from "assert";
import { ethers } from "ethers";
import { Server } from "../";

const twentySeconds = 20000;

describe("Server", () => {
  if (!process.env.STACKUP_API_KEY || !process.env.STACKUP_SIGNING_KEY) {
    console.log("#####################################################");
    console.log("Integration tests skipped, check your API keys in .env");
    console.log("#####################################################");
  } else {
    it("retrieves the address for the signing account", async () => {
      const server = new Server();
      const address = await server.getAddress();
      // 0x75A95b9a4846cFd235078063e002C351EF3fC7f7
      assert.strictEqual(ethers.utils.isAddress(address), true);
    });
    it("transfers Mumbai MATIC to itself", async () => {
      const server = new Server();
      const amount = "0.001";
      const address = await server.getAddress();

      await server.sendTransaction(address, amount);

      console.log(`Sent ${amount} to ${address}.`);
      console.log(
        `View this transaction at: https://mumbai.polygonscan.com/address/${address}#internaltx.`
      );
    }).timeout(twentySeconds);
    it.only("deploys a 721 contract from the Factory", async () => {
      const server = new Server();
      const amount = "0.001";
      const address = await server.getAddress();

      await server.deploy721("Test", "TKN");

      console.log(`Sent ${amount} to ${address}.`);
      console.log(
        `View this transaction at: https://mumbai.polygonscan.com/address/${address}#internaltx.`
      );
    }).timeout(twentySeconds);
  }
});
