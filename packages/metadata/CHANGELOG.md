# @0xsequence/metadata

## 0.36.9

### Patch Changes

- minor dev xp improvements

## 0.36.8

### Patch Changes

- more connect options (theme, payment providers, funding currencies)

## 0.36.7

### Patch Changes

- fix missing break

## 0.36.6

### Patch Changes

- wallet_switchEthereumChain support

## 0.36.5

### Patch Changes

- auth: bump ethauth to 0.7.0
  network, wallet: don't assume position of auth network in list
  api/indexer/metadata: trim trailing slash on hostname, and add endpoint urls
  relayer: Allow to specify local relayer transaction parameters like gas price or gas limit

## 0.36.4

### Patch Changes

- Updating list of chain ids to include other ethereum compatible chains

## 0.36.3

### Patch Changes

- provider: pass connect options to prompter methods

## 0.36.2

### Patch Changes

- transactions: Setting target to 0x0 when empty to during SequenceTxAbiEncode

## 0.36.1

### Patch Changes

- metadata: update client with more fields

## 0.36.0

### Minor Changes

- relayer, wallet: fee quote support

## 0.35.12

### Patch Changes

- provider: rename wallet.commands to wallet.utils

## 0.35.11

### Patch Changes

- provider/utils: smoother message validation

## 0.35.10

### Patch Changes

- upgrade deps

## 0.35.9

### Patch Changes

- provider: window-transport override event handlers with new wallet instance

## 0.35.8

### Patch Changes

- provider: async wallet sign in improvements

## 0.35.7

### Patch Changes

- config: cache wallet configs

## 0.35.6

### Patch Changes

- provider: support async signin of wallet request handler

## 0.35.5

### Patch Changes

- wallet: skip threshold check during fee estimation

## 0.35.4

### Patch Changes

- - browser extension mode, center window

## 0.35.3

### Patch Changes

- - update window position when in browser extension mode

## 0.35.2

### Patch Changes

- - provider: WindowMessageHandler accept optional windowHref

## 0.35.1

### Patch Changes

- wallet: update config on undeployed too

## 0.35.0

### Minor Changes

- - config: add buildStubSignature
  - provider: add checks to signing cases for wallet deployment and config statuses
  - provider: add prompt for wallet deployment
  - relayer: add BaseRelayer.prependWalletDeploy
  - relayer: add Relayer.feeOptions
  - relayer: account for wallet deployment in fee estimation
  - transactions: add fromTransactionish
  - wallet: add Account.prependConfigUpdate
  - wallet: add Account.getFeeOptions

## 0.34.0

### Minor Changes

- - upgrade deps

## 0.31.3

### Patch Changes

- update metadata bindings

## 0.31.0

### Minor Changes

- - upgrading to ethers v5.5

## 0.30.0

### Minor Changes

- - upgrade most deps

## 0.29.8

### Patch Changes

- update api

## 0.29.1

### Patch Changes

- metadata: ContractInfo.decimals is now optional, i.e. may be undefined

  api: new APIs for user storage and isUsingGoogleMail

## 0.29.0

### Minor Changes

- major architectural changes in Sequence design

  - only one API instance, API is no longer a per-chain service
  - separate per-chain indexer service, API no longer handles indexing
  - single contract metadata service, API no longer serves metadata

  chaind package has been removed, indexer and metadata packages have been added

  stronger typing with new explicit ChainId type

  multicall fixes and improvements

  forbid "wait" transactions in sendTransactionBatch calls
