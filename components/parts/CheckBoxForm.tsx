import { ChangeEvent, FC, useCallback, useRef, useState } from "react"
import { useFormContext } from "react-hook-form"
import { CSSTransition } from "react-transition-group"

import styles from "./CheckBoxForm.module.scss"

export const CheckBoxForm: FC<{
  label: string
  name?: string
  id?: string
  className?: string
  disabled?: boolean
  cleanValue?: boolean
  checked?: boolean
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  tooltipText?: string
}> = ({
  label,
  name,
  className,
  id,
  disabled,
  cleanValue,
  checked,
  onChange,
  tooltipText,
}) => {
  const { register, watch, getValues } = useFormContext() ?? {}
  const tooltipNodeRef = useRef(null)
  const [showTooltip, setShowTooltip] = useState(false)

  if (cleanValue !== undefined && name) {
    watch(name)
  }

  const handleMouseEnter = useCallback(() => {
    if (tooltipText) {
      setShowTooltip(true)
    }
  }, [tooltipText])

  const handleMouseLeave = useCallback(() => {
    if (tooltipText) {
      setShowTooltip(false)
    }
  }, [tooltipText])

  return (
    <div className={className}>
      <div
        className={styles.container}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={styles.checkbox}>
          {name ? (
            <input
              type="checkbox"
              {...register(name)}
              id={id ?? name}
              className={styles.input}
              disabled={disabled}
              data-testid={`checkboxform-${name}`}
            />
          ) : (
            <input
              type="checkbox"
              id={id ?? name}
              className={styles.input}
              disabled={disabled}
              checked={checked}
              onChange={onChange}
              data-testid={id ? `checkboxform-${id}` : "checkboxform"}
            />
          )}
          <label
            htmlFor={id ?? name}
            className={styles.dummyLabel}
            style={{
              cursor: disabled ? "default" : "pointer",
              boxShadow:
                cleanValue !== undefined &&
                name &&
                cleanValue !== getValues(name)
                  ? "0 0 0 3px var(--bb-dirty)"
                  : "",
            }}
          ></label>
        </div>
        <label htmlFor={id ?? name} className={styles.label}>
          {label}
        </label>
        {tooltipText && (
          <CSSTransition
            nodeRef={tooltipNodeRef}
            in={showTooltip}
            timeout={{
              enter: 0,
              exit: 200,
            }}
            classNames={{
              enter: styles.tooltipEnter,
              exit: styles.tooltipExit,
            }}
            unmountOnExit
          >
            {() => {
              return (
                <div
                  className={styles.tooltip}
                  ref={tooltipNodeRef}
                  dangerouslySetInnerHTML={{ __html: tooltipText }}
                ></div>
              )
            }}
          </CSSTransition>
        )}
      </div>
    </div>
  )
}
