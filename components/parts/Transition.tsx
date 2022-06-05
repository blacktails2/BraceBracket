import { FC, ReactNode } from "react"
import { SwitchTransition, CSSTransition } from "react-transition-group"

export const Transition: FC<{ children: ReactNode; keyName: string }> = ({
  children,
  keyName,
}) => {
  return (
    <div>
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={keyName}
          addEndListener={(node: HTMLElement, done: () => void) => {
            node.addEventListener("transitionend", done, false)
          }}
          classNames="fade"
        >
          {children}
        </CSSTransition>
      </SwitchTransition>
    </div>
  )
}
