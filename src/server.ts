import { ServerOptions } from "./_types";

export class Server {
  readonly _options: ServerOptions;
  constructor(options?: Partial<ServerOptions>) {
    this._options = { ...Server.DEFAULTS, ...options };
  }

  static get DEFAULTS(): ServerOptions {
    const { STACKUP_API_KEY } = process.env;

    if (!STACKUP_API_KEY) throw new Error("STACKUP_API_KEY is not defined");

    return {
      rpcUrl: `https://api.stackup.sh/v1/node/${STACKUP_API_KEY}`,
      signingKey: null,
      entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
      simpleAccountFactory: "0x9406cc6185a346906296840746125a0e44976454",
      paymaster: {
        rpcUrl: `https://api.stackup.sh/v1/paymaster/${STACKUP_API_KEY}`,
        context: {},
      },
    };
  }
}
