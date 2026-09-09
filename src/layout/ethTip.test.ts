import { describe, expect, it, vi } from 'vitest'
import { promptEthTip, shortenEthAddress, TIP_ETH_ADDRESS } from './ethTip'

describe('shortenEthAddress', () => {
  it('keeps the prefix and last four characters', () => {
    expect(shortenEthAddress(TIP_ETH_ADDRESS)).toBe('0x6b8f…ceC1')
  })
})

describe('promptEthTip', () => {
  it('returns no-wallet when nothing is injected', async () => {
    await expect(promptEthTip(TIP_ETH_ADDRESS, null)).resolves.toBe(
      'no-wallet',
    )
  })

  it('opens a send dialog after connecting an account', async () => {
    const request = vi.fn(async (args: { method: string }) => {
      if (args.method === 'eth_requestAccounts') return ['0xabc']
      return '0xhash'
    })

    await expect(promptEthTip(TIP_ETH_ADDRESS, request)).resolves.toBe('sent')
    expect(request).toHaveBeenCalledWith({ method: 'eth_requestAccounts' })
    expect(request).toHaveBeenCalledWith({
      method: 'eth_sendTransaction',
      params: [{ from: '0xabc', to: TIP_ETH_ADDRESS }],
    })
  })

  it('treats a wallet rejection as cancelled, not failed', async () => {
    const request = vi.fn(async () => {
      throw { code: 4001, message: 'User rejected the request.' }
    })

    await expect(promptEthTip(TIP_ETH_ADDRESS, request)).resolves.toBe(
      'rejected',
    )
  })

  it('returns failed for other wallet errors', async () => {
    const request = vi.fn(async () => {
      throw new Error('internal')
    })

    await expect(promptEthTip(TIP_ETH_ADDRESS, request)).resolves.toBe('failed')
  })
})
