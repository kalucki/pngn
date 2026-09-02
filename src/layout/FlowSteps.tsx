import { useLocale } from '../i18n/useLocale'
import type { MessageKey } from '../i18n/messages'

const steps = [
  { id: 1, labelKey: 'flow.upload' },
  { id: 2, labelKey: 'flow.select' },
  { id: 3, labelKey: 'flow.edit' },
] as const satisfies ReadonlyArray<{ id: 1 | 2 | 3; labelKey: MessageKey }>

export type FlowStepId = (typeof steps)[number]['id']

const StepArrow = () => (
  <svg
    className="flow-steps-arrow"
    width="22"
    height="8"
    viewBox="0 0 22 8"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M0 4h18.5M15.5 1.25 19.5 4l-4 2.75"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const FlowSteps = ({ current }: { current: FlowStepId }) => {
  const { t } = useLocale()

  return (
    <ol className="flow-steps" aria-label={t('flow.aria')}>
      {steps.map((step, index) => {
        const state =
          step.id < current ? 'done' : step.id === current ? 'current' : 'upcoming'
        return (
          <li
            key={step.id}
            className="flow-step"
            data-state={state}
            aria-current={state === 'current' ? 'step' : undefined}
          >
            <span className="flow-step-index" aria-hidden="true">
              {step.id}
            </span>
            <span className="flow-step-label">{t(step.labelKey)}</span>
            {index < steps.length - 1 ? <StepArrow /> : null}
          </li>
        )
      })}
    </ol>
  )
}
