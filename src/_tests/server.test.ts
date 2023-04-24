import assert from "assert";
import { Server } from "../";
import { ServerOptions } from "../_types";

describe("Server", () => {
  let server: Server;
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = process.env;

    process.env = {
      ...process.env,
      STACKUP_API_KEY: "not a real key",
      STACKUP_SIGNING_KEY: "also not a real key",
    };

    server = new Server();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("has default options", () => {
    const options = Server.DEFAULTS;

    assert.deepStrictEqual(server._options, options);
  });
  it("throws if STACKUP_API_KEY is not set", () => {
    delete process.env.STACKUP_API_KEY;
    assert.throws(
      () => {
        server = new Server();
      },
      {
        name: "Error",
        message: "STACKUP_API_KEY is not defined",
      }
    );
  });
  it("throws if STACKUP_SIGNING_KEY is not set", () => {
    delete process.env.STACKUP_SIGNING_KEY;
    assert.throws(
      () => {
        server = new Server();
      },
      {
        name: "Error",
        message: "STACKUP_SIGNING_KEY is not defined",
      }
    );
  });
  it("overrides default options when provided", () => {
    const customOptions: Partial<ServerOptions> = {
      rpcUrl: "https://custom.rpc.url",
      entryPoint: "0xCustomEntryPoint",
    };

    const customServer = new Server(customOptions);

    assert.strictEqual(customServer._options.rpcUrl, customOptions.rpcUrl);
    assert.strictEqual(
      customServer._options.entryPoint,
      customOptions.entryPoint
    );
  });
});
