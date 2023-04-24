import assert from "assert";
import { Server } from "../";

describe("Server", () => {
  let server: Server;
  beforeEach(() => {
    process.env.STACKUP_API_KEY = "not a real key";
    server = new Server();
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
});
