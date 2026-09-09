export const TIP_ETH_ADDRESS =
  '0x6b8fA658ab05E6D03df7C1aC6493467109F4ceC1'

export type EthTipOutcome = 'sent' | 'rejected' | 'no-wallet' | 'failed'

type EthereumRequest = (args: {
  method: string
  params?: unknown[]
}) => Promise<unknown>

export const shortenEthAddress = (address: string) =>
  `${address.slice(0, 6)}…${address.slice(-4)}`

export const copyEthAddress = async (address: string) => {
  await navigator.clipboard.writeText(address)
}

const injectedRequest = (): EthereumRequest | undefined => {
  if (typeof window === 'undefined') return undefined
  const ethereum = (
    window as Window & { ethereum?: { request?: EthereumRequest } }
  ).ethereum
  if (!ethereum?.request) return undefined
  return ethereum.request.bind(ethereum)
}

const isUserRejection = (error: unknown) => {
  if (typeof error !== 'object' || error === null) return false
  const code = 'code' in error ? error.code : undefined
  if (code === 4001 || code === 'ACTION_REJECTED') return true
  const message =
    'message' in error && typeof error.message === 'string'
      ? error.message
      : ''
  return /user rejected|user denied|denied transaction/i.test(message)
}

export const promptEthTip = async (
  address: string,
  request?: EthereumRequest | null,
): Promise<EthTipOutcome> => {
  const ethRequest = request === undefined ? injectedRequest() : request
  if (!ethRequest) return 'no-wallet'
  try {
    const accounts = await ethRequest({ method: 'eth_requestAccounts' })
    const from = Array.isArray(accounts) ? accounts[0] : undefined
    if (typeof from !== 'string' || from.length === 0) return 'no-wallet'
    await ethRequest({
      method: 'eth_sendTransaction',
      params: [{ from, to: address }],
    })
    return 'sent'
  } catch (error) {
    if (isUserRejection(error)) return 'rejected'
    return 'failed'
  }
}
