/* eslint-disable */
// sessions v0.0.1 5c0f1c84206c36730f6637db2d71a5d44207cb09
// --
// This file has been generated by https://github.com/webrpc/webrpc using gen/typescript
// Do not edit by hand. Update your webrpc schema and re-generate.

import { ethers } from "ethers"

// WebRPC description and code-gen version
export const WebRPCVersion = "v1"

// Schema version of your RIDL schema
export const WebRPCSchemaVersion = "v0.0.1"

// Schema hash generated from your RIDL schema
export const WebRPCSchemaHash = "5c0f1c84206c36730f6637db2d71a5d44207cb09"


//
// Types
//
export interface Config {
  threshold: number
  signers: Array<Signer>
  imageHash: string
}

export interface Wallet {
  address: string
  imageHash: string
  context: Context
}

export interface Context {
  factory: string
  mainModule: string
}

export interface Signer {
  address: string
  weight: number
}

export interface ImageHashSigner {
  address: string
  imageHash: string
  position: number
}

export interface TransactionBody {
  wallet: string
  tx: string
  newImageHash: string
  gapNonce: number
  nonce: string
}

export interface Signature {
  chainid: string
  signature: string
}

export interface SignedTransaction {
  tx: TransactionBody
  signature: Signature
}

export interface Stats {
  Total: number
  KnownConfigurations: number
  KnownWallets: number
  KnownSigners: number
  KnownTransactionBodies: number
  KnownSignatures: number
}

export interface WalletOfSigner {
  address: string
  proof: SignerProof
}

export interface SignerProof {
  digest: string
  chainId: string
  signature: string
}

export interface Sessions {
  saveWallets(args: SaveWalletsArgs, headers?: object): Promise<SaveWalletsReturn>
  saveConfigurations(args: SaveConfigurationsArgs, headers?: object): Promise<SaveConfigurationsReturn>
  savePresignedTransactions(args: SavePresignedTransactionsArgs, headers?: object): Promise<SavePresignedTransactionsReturn>
  knownConfigurations(args: KnownConfigurationsArgs, headers?: object): Promise<KnownConfigurationsReturn>
  knownWallets(args: KnownWalletsArgs, headers?: object): Promise<KnownWalletsReturn>
  knownSigners(args: KnownSignersArgs, headers?: object): Promise<KnownSignersReturn>
  knownTransactionBodies(args: KnownTransactionBodiesArgs, headers?: object): Promise<KnownTransactionBodiesReturn>
  knownSignatures(args: KnownSignaturesArgs, headers?: object): Promise<KnownSignaturesReturn>
  configurationForImageHash(args: ConfigurationForImageHashArgs, headers?: object): Promise<ConfigurationForImageHashReturn>
  imageHashForWallet(args: ImageHashForWalletArgs, headers?: object): Promise<ImageHashForWalletReturn>
  imageHashesForSigner(args: ImageHashesForSignerArgs, headers?: object): Promise<ImageHashesForSignerReturn>
  presignedTransactionForImageHash(args: PresignedTransactionForImageHashArgs, headers?: object): Promise<PresignedTransactionForImageHashReturn>
  presignedRouteForImageHash(args: PresignedRouteForImageHashArgs, headers?: object): Promise<PresignedRouteForImageHashReturn>
  presignedRouteForWallet(args: PresignedRouteForWalletArgs, headers?: object): Promise<PresignedRouteForWalletReturn>
  walletsOfSigner(args: WalletsOfSignerArgs, headers?: object): Promise<WalletsOfSignerReturn>
  stats(headers?: object): Promise<StatsReturn>
}

export interface SaveWalletsArgs {
  wallets: Array<Wallet>
}

export interface SaveWalletsReturn {  
}
export interface SaveConfigurationsArgs {
  configs: Array<Config>
}

export interface SaveConfigurationsReturn {  
}
export interface SavePresignedTransactionsArgs {
  rtx: TransactionBody
  newConfig: Config
  signatures: Array<Signature>
}

export interface SavePresignedTransactionsReturn {  
}
export interface KnownConfigurationsArgs {
  start: number
  count: number
}

export interface KnownConfigurationsReturn {
  configs: Array<Config>  
}
export interface KnownWalletsArgs {
  start: number
  count: number
}

export interface KnownWalletsReturn {
  wallets: Array<Wallet>  
}
export interface KnownSignersArgs {
  start: number
  count: number
}

export interface KnownSignersReturn {
  signers: Array<ImageHashSigner>  
}
export interface KnownTransactionBodiesArgs {
  start: number
  count: number
}

export interface KnownTransactionBodiesReturn {
  rtx: Array<TransactionBody>  
}
export interface KnownSignaturesArgs {
  start: number
  count: number
}

export interface KnownSignaturesReturn {
  signatures: Array<Signature>  
}
export interface ConfigurationForImageHashArgs {
  imageHash: string
}

export interface ConfigurationForImageHashReturn {
  config: Config  
}
export interface ImageHashForWalletArgs {
  address: string
}

export interface ImageHashForWalletReturn {
  wallets: Array<Wallet>  
}
export interface ImageHashesForSignerArgs {
  address: string
  start: number
  count: number
}

export interface ImageHashesForSignerReturn {
  signers: Array<ImageHashSigner>  
}
export interface PresignedTransactionForImageHashArgs {
  imageHash: string
  fromImageHash: string
  wallet: string
  chainid: string
}

export interface PresignedTransactionForImageHashReturn {
  tx: TransactionBody
  sig: Signature  
}
export interface PresignedRouteForImageHashArgs {
  imageHash: string
  fromImageHash: string
  wallet: string
  chainid: string
}

export interface PresignedRouteForImageHashReturn {
  txs: Array<SignedTransaction>  
}
export interface PresignedRouteForWalletArgs {
  fromImageHash: string
  wallet: string
  chainid: string
}

export interface PresignedRouteForWalletReturn {
  txs: Array<SignedTransaction>  
}
export interface WalletsOfSignerArgs {
  address: string
  start: number
  count: number
}

export interface WalletsOfSignerReturn {
  wallets: Array<WalletOfSigner>  
}
export interface StatsArgs {
}

export interface StatsReturn {
  stats: Stats  
}


  
//
// Client
//
export class Sessions implements Sessions {
  protected hostname: string
  protected fetch: Fetch
  protected path = '/rpc/Sessions/'

  constructor(hostname: string, fetch: Fetch) {
    this.hostname = hostname
    this.fetch = fetch
  }

  private url(name: string): string {
    return this.hostname + this.path + name
  }
  
  saveWallets = (args: SaveWalletsArgs, headers?: object): Promise<SaveWalletsReturn> => {
    return this.fetch(
      this.url('SaveWallets'),
      createHTTPRequest(args, headers)).then((res) => {
      return buildResponse(res).then(_data => {
        return {
        }
      })
    })
  }
  
  saveConfigurations = (args: SaveConfigurationsArgs, headers?: object): Promise<SaveConfigurationsReturn> => {
    return this.fetch(
      this.url('SaveConfigurations'),
      createHTTPRequest(args, headers)).then((res) => {
      return buildResponse(res).then(_data => {
        return {
        }
      })
    })
  }
  
  savePresignedTransactions = (args: SavePresignedTransactionsArgs, headers?: object): Promise<SavePresignedTransactionsReturn> => {
    return this.fetch(
      this.url('SavePresignedTransactions'),
      createHTTPRequest(args, headers)).then((res) => {
      return buildResponse(res).then(_data => {
        return {
        }
      })
    })
  }
  
  knownConfigurations = (args: KnownConfigurationsArgs, headers?: object): Promise<KnownConfigurationsReturn> => {
    return this.fetch(
      this.url('KnownConfigurations'),
      createHTTPRequest(args, headers)).then((res) => {
      return buildResponse(res).then(_data => {
        return {
          configs: <Array<Config>>(_data.configs)
        }
      })
    })
  }
  
  knownWallets = (args: KnownWalletsArgs, headers?: object): Promise<KnownWalletsReturn> => {
    return this.fetch(
      this.url('KnownWallets'),
      createHTTPRequest(args, headers)).then((res) => {
      return buildResponse(res).then(_data => {
        return {
          wallets: <Array<Wallet>>(_data.wallets)
        }
      })
    })
  }
  
  knownSigners = (args: KnownSignersArgs, headers?: object): Promise<KnownSignersReturn> => {
    return this.fetch(
      this.url('KnownSigners'),
      createHTTPRequest(args, headers)).then((res) => {
      return buildResponse(res).then(_data => {
        return {
          signers: <Array<ImageHashSigner>>(_data.signers)
        }
      })
    })
  }
  
  knownTransactionBodies = (args: KnownTransactionBodiesArgs, headers?: object): Promise<KnownTransactionBodiesReturn> => {
    return this.fetch(
      this.url('KnownTransactionBodies'),
      createHTTPRequest(args, headers)).then((res) => {
      return buildResponse(res).then(_data => {
        return {
          rtx: <Array<TransactionBody>>(_data.rtx)
        }
      })
    })
  }
  
  knownSignatures = (args: KnownSignaturesArgs, headers?: object): Promise<KnownSignaturesReturn> => {
    return this.fetch(
      this.url('KnownSignatures'),
      createHTTPRequest(args, headers)).then((res) => {
      return buildResponse(res).then(_data => {
        return {
          signatures: <Array<Signature>>(_data.signatures)
        }
      })
    })
  }
  
  configurationForImageHash = (args: ConfigurationForImageHashArgs, headers?: object): Promise<ConfigurationForImageHashReturn> => {
    return this.fetch(
      this.url('ConfigurationForImageHash'),
      createHTTPRequest(args, headers)).then((res) => {
      return buildResponse(res).then(_data => {
        return {
          config: <Config>(_data.config)
        }
      })
    })
  }
  
  imageHashForWallet = (args: ImageHashForWalletArgs, headers?: object): Promise<ImageHashForWalletReturn> => {
    return this.fetch(
      this.url('ImageHashForWallet'),
      createHTTPRequest(args, headers)).then((res) => {
      return buildResponse(res).then(_data => {
        return {
          wallets: <Array<Wallet>>(_data.wallets)
        }
      })
    })
  }
  
  imageHashesForSigner = (args: ImageHashesForSignerArgs, headers?: object): Promise<ImageHashesForSignerReturn> => {
    return this.fetch(
      this.url('ImageHashesForSigner'),
      createHTTPRequest(args, headers)).then((res) => {
      return buildResponse(res).then(_data => {
        return {
          signers: <Array<ImageHashSigner>>(_data.signers)
        }
      })
    })
  }
  
  presignedTransactionForImageHash = (args: PresignedTransactionForImageHashArgs, headers?: object): Promise<PresignedTransactionForImageHashReturn> => {
    return this.fetch(
      this.url('PresignedTransactionForImageHash'),
      createHTTPRequest(args, headers)).then((res) => {
      return buildResponse(res).then(_data => {
        return {
          tx: <TransactionBody>(_data.tx), 
          sig: <Signature>(_data.sig)
        }
      })
    })
  }
  
  presignedRouteForImageHash = (args: PresignedRouteForImageHashArgs, headers?: object): Promise<PresignedRouteForImageHashReturn> => {
    return this.fetch(
      this.url('PresignedRouteForImageHash'),
      createHTTPRequest(args, headers)).then((res) => {
      return buildResponse(res).then(_data => {
        return {
          txs: <Array<SignedTransaction>>(_data.txs)
        }
      })
    })
  }
  
  presignedRouteForWallet = (args: PresignedRouteForWalletArgs, headers?: object): Promise<PresignedRouteForWalletReturn> => {
    return this.fetch(
      this.url('PresignedRouteForWallet'),
      createHTTPRequest(args, headers)).then((res) => {
      return buildResponse(res).then(_data => {
        return {
          txs: <Array<SignedTransaction>>(_data.txs)
        }
      })
    })
  }
  
  walletsOfSigner = (args: WalletsOfSignerArgs, headers?: object): Promise<WalletsOfSignerReturn> => {
    return this.fetch(
      this.url('WalletsOfSigner'),
      createHTTPRequest(args, headers)).then((res) => {
      return buildResponse(res).then(_data => {
        return {
          wallets: <Array<WalletOfSigner>>(_data.wallets)
        }
      })
    })
  }
  
  stats = (headers?: object): Promise<StatsReturn> => {
    return this.fetch(
      this.url('Stats'),
      createHTTPRequest({}, headers)
      ).then((res) => {
      return buildResponse(res).then(_data => {
        return {
          stats: <Stats>(_data.stats)
        }
      })
    })
  }
  
}

  
export interface WebRPCError extends Error {
  code: string
  msg: string
	status: number
}

const createHTTPRequest = (body: object = {}, headers: object = {}): object => {
  return {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {})
  }
}

const buildResponse = (res: Response): Promise<any> => {
  return res.text().then(text => {
    let data

    if (text !== '') {
      try {
        data = JSON.parse(text)
      } catch(err) {
        throw { code: 'unknown', msg: `expecting JSON, got: ${text}`, status: res.status } as WebRPCError
      }
    } else {
      data = text
    }

    if (!res.ok) {
      throw data // webrpc error response
    }
    return data
  })
}

export type Fetch = (input: RequestInfo, init?: RequestInit) => Promise<Response>
