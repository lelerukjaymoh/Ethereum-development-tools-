import { sequenceContext, WalletContext } from "@0xsequence/network"
import { digestOfTransactionsNonce, encodeNonce, unpackMetaTransactionData } from "@0xsequence/transactions"
import { subDigestOf } from "@0xsequence/utils"
import { BigNumberish, BigNumber, ethers } from "ethers"
import { ConfigTracker, isValidWalletUpdate, SESSIONS_SPACE } from "."
import { isDecodedEOASigner, staticRecoverConfig } from ".."
import { addressOf, imageHash, isAddrEqual, WalletConfig } from "../config"
import { DecodedSignaturePart, decodeSignature, decodeSignaturePart, isDecodedAddress, isDecodedFullSigner, recoverEOASigner, staticRecoverConfigPart } from "../signature"
import { AssumedWalletConfigs, PresignedConfigUpdate, PresignedConfigurationPayload } from "./config-tracker"

export class UntrustedConfigTracker implements ConfigTracker {
  constructor (
    public tracker: ConfigTracker,
    public context: WalletContext = sequenceContext,
    public walletConfigs: AssumedWalletConfigs = {}
  ) { }

  loadPresignedConfiguration = async (args: { wallet: string; fromImageHash: string; chainId: BigNumberish; }): Promise<PresignedConfigUpdate[]> => {
    const result = await this.tracker.loadPresignedConfiguration(args)
    if (result.length === 0) return result

    const expectedChainId = BigNumber.from(args.chainId)
    const expectedNonce = encodeNonce(SESSIONS_SPACE, 0)

    // Validate the contents of the presigned configuration
    await Promise.all(result.map(async (tx, i) => {
      const prevImageHash = i === 0 ? args.fromImageHash : result[i - 1].body.newImageHash

      // Should be a valid wallet update transaction
      const txs = unpackMetaTransactionData(tx.body.tx)

      if (!isValidWalletUpdate({
        wallet: args.wallet,
        txs,
        newConfig: tx.body.newImageHash,
        context: this.context,
        gapNonce: tx.body.gapNonce
      })) {
        throw new Error("Invalid presigned configuration")
      }

      // The nonce should be the expected nonce
      if (!expectedNonce.eq(tx.body.nonce)) {
        throw new Error(`Invalid transaction nonce ${tx.body.nonce.toString()} expected ${expectedNonce.toString()}`)
      }

      // Chain id should match the requested one
      if (!expectedChainId.eq(tx.chainId)) {
        throw new Error(`Invalid transaction chain id ${tx.chainId.toString()} expected ${expectedChainId.toString()}`)
      }

      // Validate all signatures
      const digest = digestOfTransactionsNonce(tx.body.nonce, ...txs)
      const subDigest = subDigestOf(args.wallet, expectedChainId, digest)
      const resp = staticRecoverConfig(subDigest, decodeSignature(tx.signature), expectedChainId.toNumber(), this.walletConfigs)

      // Signature weights should reach the threshold
      if (resp.weight < resp.config.threshold) {
        throw new Error(`Invalid transaction signature weight ${resp.weight} expected at least ${resp.config.threshold}`)
      }

      // Recovered config should match prev imageHash
      if (imageHash(resp.config) !== prevImageHash) {
        throw new Error(`Invalid transaction signature image hash ${imageHash(resp.config)} expected ${prevImageHash}`)
      }
    }))

    return result
  }

  savePresignedConfiguration = (args: PresignedConfigurationPayload): Promise<void> => {
    return this.tracker.savePresignedConfiguration(args)
  }

  configOfImageHash = async (args: { imageHash: string; }): Promise<WalletConfig | undefined> => {
    const result = await this.tracker.configOfImageHash(args)
    if (!result) return undefined

    // Validate given configuration
    // matches the requested imageHash
    if (imageHash(result) !== args.imageHash) {
      throw new Error(`Invalid config for image hash - expected: ${args.imageHash} got: ${JSON.stringify(result)}`)
    }

    return result
  }

  saveWalletConfig = (args: { config: WalletConfig; }): Promise<void> => {
    return this.tracker.saveWalletConfig(args)
  }

  imageHashOfCounterFactualWallet = async (args: { context: WalletContext; wallet: string; }): Promise<string | undefined> => {
    const result = await this.tracker.imageHashOfCounterFactualWallet(args)
    if (!result) return undefined

    // Validate the counter-factual address matches the given wallet
    if (!isAddrEqual(addressOf(result, args.context), args.wallet)) {
      console.log("with data", result, args.context)
      throw new Error(`Invalid image hash for wallet - expected: ${args.wallet} got: ${addressOf(result, args.context)}`)
    }

    return result
  }

  saveCounterFactualWallet = (args: { imageHash: string; context: WalletContext; }): Promise<void> => {
    return this.tracker.saveCounterFactualWallet(args)
  }

  saveWitness = async (args: {
    wallet: string,
    digest: string,
    signatures: {
      chainId: BigNumberish,
      signature: string
    }[]
  }): Promise<void> => {
    return this.tracker.saveWitness(args)
  }

  walletsOfSigner = async (args: { signer: string; }): Promise<{ wallet: string; proof: { digest: string; chainId: BigNumber; signature: DecodedSignaturePart; }; }[]> => {
    const result = await this.tracker.walletsOfSigner(args)

    // Validate signature
    result.map((w) => {
      // Compute subdigest for wallet
      const subdigest = subDigestOf(w.wallet, w.proof.chainId, w.proof.digest)

      // Proof signature should be EOA
      if (!isDecodedEOASigner(w.proof.signature) && !isDecodedEOASigner(w.proof.signature)) {
        throw new Error(`Invalid signature type for wallet ${w.wallet}, signer: ${args.signer}`)
      }

      // Recover the signer address
      const recovered = recoverEOASigner(subdigest, w.proof.signature)
      if (!isAddrEqual(recovered, args.signer)) {
        throw new Error(`Invalid signature for wallet ${w.wallet}, signer: ${args.signer}`)
      }
    })

    return result
  }

  signaturesOfSigner = async (args: {
    signer: string
  }): Promise<{ signature: string, chainid: string, wallet: string, digest: string }[]> => {
    const result = await this.tracker.signaturesOfSigner(args)

    // Validate signature
    result.map((s) => {
      // Compute subdigest for wallet
      const subdigest = subDigestOf(s.wallet, s.chainid, s.digest)

      // Decode signature part
      const { part } = decodeSignaturePart(s.signature)

      // Recover signature part
      const recovered = staticRecoverConfigPart(subdigest, part, s.chainid, this.walletConfigs)

      if (!recovered.signature) {
        throw new Error(`Invalid signature for wallet ${s.wallet}`)
      }

      // Validate recovered signature
      if (!isAddrEqual(recovered.signer, args.signer)) {
        throw new Error(`Invalid signature for wallet ${s.wallet}, signer: ${args.signer}`)
      }
    })
  
    return result
  }
}
