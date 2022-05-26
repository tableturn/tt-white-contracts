# TT White Contracts

This repository contains the Ethereum Smart Contracts that are used for our Tokenization as a Service (TSaaS) platform.
This project uses Hardhat to allow for streamlined development and testing, as well as some helpful tasks (see `./src/tasks`).

Most deploy tasks takes care of updating the `.openzeppelin/state-${NETWORK_ID}.json` file so that it is easier to track addresses of previously deployed contracts.

## Bootstrapping a Functional System Locally

Note that for development systems, we use local signers (Eg `ethers.getSigners()`). In the following paragraphs, you can assume that:
- `zero_address` is `0x0000000000000000000000000000000000000000`.
- `deployer` is the very first signer from the signers list.
- `spcMember` is the second signer from the signers list.
- `governor` is the third signer from the signers list.
- `member` is the fourth signer from the signers list.
- `random` is a random - non-signer at address `0xF7e5800E52318834E8689c37dCCCD2230427a905`.

Simply run this command:

```shell
yarn hardhat bootstrap \
              --network localhost \
              --name "Some Awesome FAST Stuff" \
              --symbol "SAF" \
              --decimals 18 \
              --has-fixed-supply true
```

The `bootstrap` task will:

- Deploy all needed libraries and overwrite the `.openzeppelin/state-31337.json` file to keep track of their addresses.
- Deploy an SPC contract using `spcMember` as the main member. It will also provision the SPC contract with some ethers sent from the `deployer` signer. It will also get an Exchange contract deployed.
- Deploy a FAST set of contracts, register everything together. At this end of this step, the deployed `FastRegistry` should have been provisioned by the SPC contract with some ETH.
- Mint some tokens and provision some transfer credits.
- Add the `member` address to the FAST members, and as a by-product of this `member` should be credited some extra ETH.

## Account Tasks (See `src/tasks/accounts.ts`)

To provision an account with ETH, you can run:

```shell
yarn hardhat faucet 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 \
              --network localhost
```

Or if you're in a hurry and you would like all available signers to obtain an outrageous amount
of ETH, you can run:

```shell
yarn hardhat make-us-rich \
              --network localhost
```

## Library Tasks (See `src/tasks/libraries.ts`)

To deploy the necessary libraries, you can run:

```shell
yarn hardhat lib-deploy AddressSetLib --network localhost
yarn hardhat lib-deploy PaginationLib --network localhost
yarn hardhat lib-deploy HelpersLib --network localhost
```

## Top-Level Tasks (See `src/tasks/spc.ts`)

You can then subsequently deploy the main SPC and Exchange by running:

```shell
yarn hardhat spc-deploy \
              --network localhost \
              --member 0x70997970c51812dc3a010c7d01b50e0d17dc79c8
```

Take note of the SPC and Exchange deployed addresses.

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
              --mint 1000000 \
              --tx-credits 1000000
```

This task will execute a more complex orchestration. The contracts deployed during this phase are:
- `FastRegistry`: which keeps track of all other contracts for a given fast.
- `FastAccess`: which keeps track of the FAST's ACLs.
- `FastHistory`: a dedicated transfer / minting history keeper.
- `FastToken`: the FAST's ERC20 token itself.

Once at least one FAST is deployed, take note of its address. There are more tasks that you can run
over a particular FAST.

For example, to mint new tokens:

```shell
yarn hardhat fast-mint SAF \
              --network localhost \
              --amount 1000000 \
              --ref "Much tokens, very wow, such bling."
```

At this point, it's important to add transfer credits to the token contract, so that transfers
can freely be executed.

```shell
yarn hardhat fast-add-transfer-credits SAF \
              --network localhost \
              --amount 5000000
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

## FAST Access Tasks

## FAST History Tasks

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
