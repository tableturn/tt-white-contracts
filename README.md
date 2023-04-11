# TT White Contracts

This repository contains the Ethereum Smart Contracts that are used for our Tokenization as a Service (TSaaS) platform.
This project uses Hardhat to allow for streamlined development and testing, as well as some helpful tasks (see
`./src/tasks`).

This means that regardless of the network you're using (local, staging, production etc), the address of the deployed
contracts should remain the same.

## Contract Folder Structure

Here is an overview of the layout of the `contracts` folder:

- `lib/` and `interfaces/` are commonly used across the project, and aren't specific to any domain.
- The `issuer/`, `marketplace/` and `fast/` folders are diamond definitions. Each contains:
  - Top-level facets for each diamond.
  - A `lib/` folder containing abstractions and storage libraries for each facet.

## Bootstrapping a Functional System Locally

For development systems, we use local signers (Eg `ethers.getSigners()`). In the following paragraphs, you can assume
that:

- `zero_address` is `0x0000000000000000000000000000000000000000`.
- `deployer` is the very first signer from the signers list.
- `issuerMember` is the second signer from the signers list.
- `governor` is the third signer from the signers list.
- `member` is the fourth signer from the signers list.
- `random` is a random - non-signer at address `0xF7e5800E52318834E8689c37dCCCD2230427a905`.

Before starting a node, it is recommended to clean your local deployment folder (`rm -rf deployments/localhost`). Then,
you can run `yarn hardhat node`. You'll notice that both the Issuer and Marketplace contracts are being deployed
automatically.

You then probably might want to jump directly to the `fast-deploy` task of this document to get started.

## Account Tasks (See `src/tasks/accounts.ts`)

To provision an account with ETH, you can run:

```shell
yarn hardhat faucet 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 \
              --network localhost
```

Or if you're in a hurry and you would like all available signers to obtain an outrageous amount of ETH, you can run:

```shell
yarn hardhat make-us-rich \
              --network localhost
```

## Top-Level Tasks (See `src/tasks/issuer.ts`)

Although the local node you're running should already have an Issuer and an Marketplace diamond automatically deployed,
you could deploy one yourself if running on a completely clean chain:

```shell
yarn hardhat issuer-deploy \
              --network localhost \
              --member 0x70997970c51812dc3a010c7d01b50e0d17dc79c8
```

> Note that you won't need to run this particular task if you're using a local development node, as the migration
> scripts in `deploy/` are ran automatically upon starting it.

## FAST Token Tasks (See `src/tasks/fast.ts`)

Then you can start deploying FAST:

```shell
yarn hardhat fast-deploy \
              --network localhost \
              --governor 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc \
              --name "Some Awesome FAST Stuff" \
              --symbol "SAF" \
              --decimals 18 \
              --has-fixed-supply false \
              --is-semi-public true \
              --mint 1000000
```

This task automatically deploys a full FAST diamond including its initialization facet. It then calls the
`FastInitFacet.initialize/0` function, and lastly performs a diamond cut to remove the initialization facet.

Once at least one FAST is deployed, take note of its symbol. There are more tasks that you can run over a particular
FAST.

For example, to mint new tokens:

```shell
yarn hardhat fast-mint SAF \
              --network localhost \
              --amount 1000000 \
              --ref "Much tokens, very wow, such bling."
```

To obtain the balance of an account over a particular FAST:

```shell
yarn hardhat fast-balance SAF \
              --network localhost \
              --account 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc
```

If you would like to query the minted (unallocated) tokens, you can instead query address zero:

```shell
yarn hardhat fast-balance SAF \
              --network localhost \
              --account 0x0000000000000000000000000000000000000000
```

## Distributions

```typescript
// We'll use the `user1` named account to be the owner of the distribution.
let { issuerMember, automaton, user1, user2, user3, user4 } = await getNamedAccounts();
let issuerSigner = await ethers.getSigner(issuerMember);
let automatonSigner = await ethers.getSigner(automaton);
let userSigner = await ethers.getSigner(user1);
// Get our dummy ERC20 token, and bind it to our user as the caller.
let token = (await ethers.getContract("ERC20")).connect(userSigner);
// Mint 5000 tokens for that user.
await token.mint(userSigner.address, 5000);
// Get a handle to `F01` FAST, and bind it to our user as the caller.
let fast = await ethers.getContract("FastF01");
// Have the user create a new distribution. It will deploy a new Distribution contract in the Fund phase.
await fast.connect(userSigner).createDistribution(token.address, 100);
// Get the address and handle of the newly deployed contract.
let [[distAddr]] = await fast.paginateDistributions(0, 1);
let dist = await ethers.getContractAt("Distribution", distAddr);
// Let our user approve 100 tokens to be spent by our distribution contract.
await token.approve(dist.address, "100");
// Let the distribution contract move to the Setup phase.
await dist.connect(userSigner).advance();
// At this point, the fee needs to be set.
await dist.connect(automatonSigner).setFee("10");
// Set them up as beneficiaries of the distribution.
await dist.connect(automatonSigner).addBeneficiaries([user2, user3, user4], [10, 30, 50]);
// Advance to the Withdrawal phase.
await dist.connect(automatonSigner).advance();
// At this point, the issuer should already have received their fee.
let issuer = await ethers.getContract("Issuer");
(await token.balanceOf(issuer.address)).toString();
// Our beneficiaries should be able to withdraw from the Distribution.
await dist.withdraw(user2);
await dist.withdraw(user3);
await dist.withdraw(user4);
// Check the token balance of the beneficiaries.
await Promise.all([user2, user3, user4].map((u) => token.balanceOf(u))).then((b) => b.map((b) => b.toString()));
```

## Hardhat Cheat-Sheet

Here are a few useful commands:

```shell
# Displays some help.
yarn hardhat help
# Compiles the contracts and generates artifacts.
yarn hardhat compile
# Cleans the build environment.
yarn hardhat clean
# Runs the test suite.
yarn hardhat test
# Runs the test suite, and reports gas usage.
REPORT_GAS=true yarn hardhat test
# Starts a local blockchain node.
yarn hardhat node
# Reports coverage.
yarn hardhat coverage
```
