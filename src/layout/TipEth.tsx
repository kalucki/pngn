import { useEffect, useRef, useState } from 'react'
import { useLocale } from '../i18n/useLocale'
import { CheckIcon, CopyIcon } from './icons'
import {
  copyEthAddress,
  promptEthTip,
  shortenEthAddress,
  TIP_ETH_ADDRESS,
} from './ethTip'

type TipEthProps = {
  variant: 'footer' | 'export'
}

export const TipEth = ({ variant }: TipEthProps) => {
  const { t } = useLocale()
  const [copied, setCopied] = useState(false)
  const copiedTimer = useRef(0)

  useEffect(
    () => () => {
      window.clearTimeout(copiedTimer.current)
    },
    [],
  )

  const markCopied = () => {
    setCopied(true)
    window.clearTimeout(copiedTimer.current)
    copiedTimer.current = window.setTimeout(() => setCopied(false), 1600)
  }

  const handleCopy = () => {
    void copyEthAddress(TIP_ETH_ADDRESS)
      .then(markCopied)
      .catch(() => {})
  }

  const handleSend = () => {
    void promptEthTip(TIP_ETH_ADDRESS).then((outcome) => {
      if (outcome === 'no-wallet' || outcome === 'failed') handleCopy()
    })
  }

  const row = (
    <div className="tip-eth">
      {variant === 'footer' ? (
        <span className="tip-eth-label">{t('tip.label')}</span>
      ) : null}
      <button
        type="button"
        className="tip-eth-address"
        dir="ltr"
        title={TIP_ETH_ADDRESS}
        aria-label={t('tip.openWallet')}
        onClick={handleSend}
      >
        {shortenEthAddress(TIP_ETH_ADDRESS)}
      </button>
      <button
        type="button"
        className={`tip-eth-copy${copied ? ' is-copied' : ''}`}
        aria-label={copied ? t('tip.copied') : t('tip.copy')}
        title={copied ? t('tip.copied') : t('tip.copy')}
        onClick={handleCopy}
      >
        {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
      </button>
    </div>
  )

  if (variant === 'export') {
    return (
      <div className="tip-eth-export">
        <p className="tip-eth-note">{t('tip.exportNote')}</p>
        {row}
      </div>
    )
  }

  return row
}
