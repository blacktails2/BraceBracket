import { FC } from "react"

export const MockImg: FC<{ width: number; height: number; text?: string }> = ({
  width,
  height,
  text,
}) => {
  return (
    <img
      src={`https://placehold.jp/${width}x${height}.png${
        text ? `?text=${text}` : ""
      }`}
      alt="placeholder"
    />
  )
}
