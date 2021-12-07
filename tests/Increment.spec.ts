import { expect } from "chai";
import "mocha";
import * as anchor from "@project-serum/anchor";
const { SystemProgram, Keypair } = anchor.web3;

describe("Increment", () => {
  const provider = anchor.Provider.env();

  // Configure the client to use the cluster.
  anchor.setProvider(provider);

  // Program
  const program = anchor.workspace.Increment;

  // Counter for the tests.
  const counter = Keypair.generate();

  it("Initialize a counter", async () => {
    await program.rpc.initialize(provider.wallet.publicKey, {
      accounts: {
        counter: counter.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [counter],
    });

    const counterAccount = await program.account.counter.fetch(
      counter.publicKey
    );

    expect(counterAccount.authority).to.deep.eq(provider.wallet.publicKey);
    expect(counterAccount.count.toNumber()).to.be.eq(0);
  });

  it("Updates a counter", async () => {
    await program.rpc.increment({
      accounts: {
        counter: counter.publicKey,
        authority: provider.wallet.publicKey,
      },
    });

    const counterAccount = await program.account.counter.fetch(
      counter.publicKey
    );

    expect(counterAccount.authority).to.deep.equal(provider.wallet.publicKey);
    expect(counterAccount.count.toNumber()).to.be.equal(1);
  });
});
