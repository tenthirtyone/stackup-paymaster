require("dotenv").config();
import { ServerOptions } from "./_types";
import { Client, Presets, UserOperationMiddlewareFn } from "userop";
import { ethers } from "ethers";

/**
 * This class represents a server that is responsible for handling transactions
 * in the blockchain using the UserOperation library.
 */
export class Server {
  readonly _options: ServerOptions;
  private _paymaster: UserOperationMiddlewareFn;

  /**
   * Constructor for the Server class.
   * @param options - Partial server options to initialize the server instance.
   */
  constructor(options?: Partial<ServerOptions>) {
    this._options = { ...Server.DEFAULTS, ...options };

    this._paymaster = Presets.Middleware.verifyingPaymaster(
      this._options.paymaster.rpcUrl,
      this._options.paymaster.context
    );
  }

  /**
   * Send a transaction to a specified address with a specified amount. Utilizes the paymaster
   * to pay for the gas fees of the transaction.
   *
   * @param to - The recipient address.
   * @param amount - The amount to send.
   * @returns - The transaction hash or null.
   */
  async sendTransaction(
    to: string,
    amount: string,
    data: string = "0x"
  ): Promise<string | null> {
    if (!this._options.signingKey) throw new Error("Signing Key is not set.");

    const account = await this.getAccount();

    const client = await Client.init(
      this._options.rpcUrl,
      this._options.entryPoint
    );

    const toAddress = ethers.utils.getAddress(to);

    const value = ethers.utils.parseEther(amount);

    const response = await client.sendUserOperation(
      account.execute(toAddress, value, data),
      { onBuild: (op) => console.log("Signed UserOp:", op) }
    );

    console.log("");
    console.log("Waiting for transaction...");
    const paymasterTx = await response.wait();

    return paymasterTx?.transactionHash ?? null;
  }

  /**
   * Get the address of the account associated with the server.
   * @returns - The account address.
   */
  async getAddress(): Promise<string> {
    const account = await this.getAccount();
    return await account.getSender();
  }

  /**
   * Get the account associated with the server.
   * @returns - A Promise that resolves with the account instance.
   */
  async getAccount(): Promise<Presets.Builder.SimpleAccount> {
    return await Presets.Builder.SimpleAccount.init(
      this._options.signingKey,
      this._options.rpcUrl,
      this._options.entryPoint,
      this._options.simpleAccountFactory,
      this._paymaster
    );
  }

  /**
   * Default server options used for initializing the server instance.
   */
  static get DEFAULTS(): ServerOptions {
    const { STACKUP_API_KEY, STACKUP_SIGNING_KEY } = process.env;

    if (!STACKUP_API_KEY) throw new Error("STACKUP_API_KEY is not defined");
    if (!STACKUP_SIGNING_KEY)
      throw new Error("STACKUP_SIGNING_KEY is not defined");

    return {
      rpcUrl: `https://api.stackup.sh/v1/node/${STACKUP_API_KEY}`,
      signingKey: STACKUP_SIGNING_KEY,
      entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
      simpleAccountFactory: "0x9406cc6185a346906296840746125a0e44976454",
      paymaster: {
        rpcUrl: `https://api.stackup.sh/v1/paymaster/${STACKUP_API_KEY}`,
        context: { type: "payg" }, // payg is pay as you go plan
      },
    };
  }
}
