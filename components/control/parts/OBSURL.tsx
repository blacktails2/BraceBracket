import { FC } from "react"

export const OBSURL: FC<{ url: string }> = ({ url }) => {
  return (
    <div>
      <div>OBS配置用URL:</div>
      <div>
        <input type="text" disabled value={url} />
        <button>Copy</button>
      </div>
    </div>
  )
}
