import { TransactionResponse, Provider, BlockTag } from '@ethersproject/providers'
import { ethers } from 'ethers'
import fetchPonyfill from 'fetch-ponyfill'
import { SequenceTransaction } from '../types'
import { readSequenceNonce, appendNonce, MetaTransactionsType, sequenceTxAbiEncode } from '../utils'
import { BaseRelayer } from './base-relayer'
import { ChaindService } from '@0xsequence/chaind'
import { IRelayer } from '.'
import { WalletContext } from '@0xsequence/networks'
import { WalletConfig, addressOf } from '@0xsequence/auth'

type RelayerTxReceipt = {
  blockHash: string
  blockNumber: string
  contractAddress: string
  cumulativeGasUsed: string
  gasUsed: string
  logs: {
    address: string
    blockHash: string
    blockNumber: string
    data: string
    logIndex: string
    removed: boolean
    topics: string[]
    transactionHash: string
    transactionIndex: string
  }[],
  logsBloom: string
  root: string
  status: string
  transactionHash: string
  transactionIndex: string
}

export type PendingTransactionResponse = TransactionResponse & {
  waitForReceipt?: () => Promise<TransactionResponse>
}

export class RpcRelayer extends BaseRelayer implements IRelayer {
  private readonly chaindApp: ChaindService
  public waitForReceipt: boolean

  constructor(
    url: string,
    bundleDeploy: boolean = true,
    provider?: Provider,
    waitForReceipt: boolean = true
  ) {
    super(bundleDeploy, provider)
    this.chaindApp = new ChaindService(url, fetchPonyfill().fetch)
    this.waitForReceipt = waitForReceipt
  }

  async waitReceipt(
    metaTxHash: string,
    wait: number = 500
  ) {
    let result = await this.chaindApp.getMetaTxnReceipt({ metaTxID: metaTxHash })

    while ((!result.receipt.txnReceipt || result.receipt.txnReceipt === 'null') && result.receipt.status === 'UNKNOWN') {
      await new Promise(r => setTimeout(r, wait))
      result = await this.chaindApp.getMetaTxnReceipt({ metaTxID: metaTxHash })
    }

    // "FAILED" is reserved for when the tx is invalid and never dispatched by remote relayer
    if (result.receipt.status == 'FAILED') {
      throw new Error(result.receipt.revertReason)
    }

    return result
  }

  async gasRefundOptions(
    config: WalletConfig,
    context: WalletContext,
    ...transactions: SequenceTransaction[]
  ): Promise<SequenceTransaction[][]> {
    // chaind only supports refunds on a single token
    // TODO: Add compatiblity for different refund options
    const tokenFee = (await this.chaindApp.tokenFee()).fee

    // No gas refund required, return transactions as-is
    if (tokenFee === ethers.constants.AddressZero) {
      return [transactions]
    }

    const addr = addressOf(config, context)
    const prevNonce = readSequenceNonce(...transactions)

    // Set temporal nonce to simulate meta-txn
    if (prevNonce === undefined) {
      transactions = appendNonce(transactions, await this.getNonce(config, context))
    }

    const encoded = ethers.utils.defaultAbiCoder.encode([MetaTransactionsType], [sequenceTxAbiEncode(transactions)])
    const res = await this.chaindApp.estimateMetaTxnGasReceipt({
      feeToken: tokenFee,
      call: {
        contract: addr,
        payload: encoded,
        numSigners: config.signers.length
      }
    })

    const decoded = ethers.utils.defaultAbiCoder.decode([MetaTransactionsType], `0x${res.res.payload}`)[0]
    return prevNonce === undefined ? [appendNonce(decoded, prevNonce)] : [decoded]
  }

  async estimateGasLimits(
    config: WalletConfig,
    context: WalletContext,
    ...transactions: SequenceTransaction[]
  ): Promise<SequenceTransaction[]> {
    if (transactions.length == 0) {
      return []
    }

    // chaind requires tokenFee, even for only estimating gasLimits
    const tokenFee = this.chaindApp.tokenFee()

    const addr = addressOf(config, context)
    const prevNonce = readSequenceNonce(...transactions)

    // Set temporal nonce to simulate meta-txn
    if (prevNonce === undefined) {
      transactions = appendNonce(transactions, await this.getNonce(config, context))
    }

    const encoded = ethers.utils.defaultAbiCoder.encode([MetaTransactionsType], [sequenceTxAbiEncode(transactions)])
    const res = await this.chaindApp.estimateMetaTxnGasReceipt({
      feeToken: (await tokenFee).fee,
      call: {
        contract: addr,
        payload: encoded,
        numSigners: config.signers.length
      }
    })

    const decoded = ethers.utils.defaultAbiCoder.decode([MetaTransactionsType], `0x${res.res.payload}`)[0]
    const modTxns = transactions.map((t, i) => ({
      ...t,
      gasLimit: decoded[i].gasLimit
    }))

    // Remove placeholder nonce if previously defined
    return prevNonce === undefined ? appendNonce(modTxns, prevNonce) : modTxns
  }

  async getNonce(
    config: WalletConfig,
    context: WalletContext,
    space?: number,
    blockTag?: BlockTag
  ): Promise<number> {
    const addr = addressOf(config, context)
    const resp = await this.chaindApp.getMetaTxnNonce({ walletContractAddress: addr })
    return ethers.BigNumber.from(resp.nonce).toNumber()
  }

  async relay(
    config: WalletConfig,
    context: WalletContext,
    signature: string | Promise<string>,
    ...transactions: SequenceTransaction[]
  ): Promise<PendingTransactionResponse> {
    const prep = await this.prepare(config, context, signature, ...transactions)
    const result = this.chaindApp.sendMetaTxn({
      call: {
        contract: prep.to,
        input: prep.data
      }
    })

    const waitReceipt = async () => {
      const hash = (await result).txnHash
      const receipt = (await this.waitReceipt(hash)).receipt
      const txReceipt = JSON.parse(receipt.txnReceipt) as RelayerTxReceipt

      return {
        blockHash: txReceipt.blockHash,
        blockNumber: ethers.BigNumber.from(txReceipt.blockNumber).toNumber(),
        confirmations: 1,
        from: addressOf(config, context),
        hash: txReceipt.transactionHash,
        raw: receipt.txnReceipt,
        wait: async (confirmations?: number) => this.provider.waitForTransaction(txReceipt.transactionHash, confirmations)
      } as TransactionResponse
    }

    if (this.waitForReceipt) {
      return waitReceipt()
    }

    return {
      from: addressOf(config, context),
      raw: (await result).toString(),
      hash: (await result).txnHash,
      waitForReceipt: waitReceipt,
      wait: async (confirmations?: number) => {
        const receipt = await waitReceipt()
        return receipt.wait(confirmations)
      }
    } as PendingTransactionResponse
  }
}