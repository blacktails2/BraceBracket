import { SwitchTransition, CSSTransition } from "react-transition-group"
import { FC, ReactNode } from "react"

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
            console.log(node)
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
