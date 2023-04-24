export type ServerOptions = {
  rpcUrl: string;
  signingKey: string | null;
  entryPoint: string;
  simpleAccountFactory: "0x9406cc6185a346906296840746125a0e44976454";
  paymaster: PaymasterOptions;
};

type PaymasterOptions = {
  rpcUrl: string;
  context: PaymasterContext | {};
};

type PaymasterContext = {
  type: string;
};
