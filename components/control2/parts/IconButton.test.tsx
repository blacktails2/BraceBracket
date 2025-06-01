import { render } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach } from "vitest"

import { IconButton } from "./IconButton"

describe("IconButton", () => {
  const mockIcon = "/test-icon.svg"
  const mockOnClick = vi.fn()

  beforeEach(() => {
    mockOnClick.mockClear()
  })

  it("should render with required props", () => {
    const { container } = render(
      <IconButton onClick={mockOnClick} icon={mockIcon} />
    )

    // IconButton renders as a div, not a button element
    const button = container.firstChild as HTMLElement
    expect(button).toBeInTheDocument()
  })

  it("should handle onClick event", async () => {
    const user = userEvent.setup()
    const { container } = render(
      <IconButton onClick={mockOnClick} icon={mockIcon} />
    )

    const button = container.firstChild as HTMLElement
    await user.click(button)

    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  it("should apply icon as background image", () => {
    const { container } = render(
      <IconButton onClick={mockOnClick} icon={mockIcon} />
    )

    const button = container.firstChild as HTMLElement
    expect(button).toHaveStyle({
      backgroundImage: `url("${mockIcon}")`,
      backgroundSize: "2.2rem",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
    })
  })

  it("should apply default light mode", () => {
    const { container } = render(
      <IconButton onClick={mockOnClick} icon={mockIcon} />
    )

    const button = container.firstChild as HTMLElement
    expect(button.className).toMatch(/_light_/)
  })

  it("should apply primary mode when specified", () => {
    const { container } = render(
      <IconButton onClick={mockOnClick} icon={mockIcon} mode="primary" />
    )

    const button = container.firstChild as HTMLElement
    expect(button.className).toMatch(/_primary_/)
  })

  it("should apply light mode when explicitly specified", () => {
    const { container } = render(
      <IconButton onClick={mockOnClick} icon={mockIcon} mode="light" />
    )

    const button = container.firstChild as HTMLElement
    expect(button.className).toMatch(/_light_/)
  })

  it("should apply rotation class when rotation is true", () => {
    const { container } = render(
      <IconButton onClick={mockOnClick} icon={mockIcon} rotation={true} />
    )

    const button = container.firstChild as HTMLElement
    expect(button.className).toMatch(/_rotation_/)
  })

  it("should not apply rotation class when rotation is false", () => {
    const { container } = render(
      <IconButton onClick={mockOnClick} icon={mockIcon} rotation={false} />
    )

    const button = container.firstChild as HTMLElement
    expect(button.className).not.toMatch(/_rotation_/)
  })

  it("should not apply rotation class when rotation is undefined", () => {
    const { container } = render(
      <IconButton onClick={mockOnClick} icon={mockIcon} />
    )

    const button = container.firstChild as HTMLElement
    expect(button.className).not.toMatch(/_rotation_/)
  })

  it("should apply custom styles", () => {
    const customStyle = {
      opacity: "0.5",
    }

    const { container } = render(
      <IconButton onClick={mockOnClick} icon={mockIcon} style={customStyle} />
    )

    const button = container.firstChild as HTMLElement
    expect(button).toHaveStyle({
      opacity: "0.5",
    })
  })

  it("should merge custom styles with default styles", () => {
    const customStyle = {
      width: "5rem",
    }

    const { container } = render(
      <IconButton onClick={mockOnClick} icon={mockIcon} style={customStyle} />
    )

    const button = container.firstChild as HTMLElement
    expect(button).toHaveStyle({
      width: "5rem",
      // Default styles should still be applied
      borderRadius: "5px",
      padding: "4px",
      height: "2.8rem",
      cursor: "pointer",
    })
  })

  it("should apply default dimensions and styles", () => {
    const { container } = render(
      <IconButton onClick={mockOnClick} icon={mockIcon} />
    )

    const button = container.firstChild as HTMLElement
    expect(button).toHaveStyle({
      borderRadius: "5px",
      padding: "4px",
      width: "2.8rem",
      height: "2.8rem",
      cursor: "pointer",
    })
  })

  it("should handle different icon paths", () => {
    const { rerender, container } = render(
      <IconButton onClick={mockOnClick} icon="/icon1.svg" />
    )

    let button = container.firstChild as HTMLElement
    expect(button).toHaveStyle({ backgroundImage: 'url("/icon1.svg")' })

    rerender(<IconButton onClick={mockOnClick} icon="/path/to/icon2.png" />)
    button = container.firstChild as HTMLElement
    expect(button).toHaveStyle({ backgroundImage: 'url("/path/to/icon2.png")' })
  })

  it("should combine multiple props correctly", () => {
    const customStyle = { opacity: "0.8" }

    const { container } = render(
      <IconButton
        onClick={mockOnClick}
        icon={mockIcon}
        mode="primary"
        rotation={true}
        style={customStyle}
      />
    )

    const button = container.firstChild as HTMLElement
    expect(button.className).toMatch(/_primary_/)
    expect(button.className).toMatch(/_rotation_/)
    expect(button).toHaveStyle({
      opacity: "0.8",
    })
  })

  it("should handle mouse events correctly", async () => {
    const user = userEvent.setup()

    const { container } = render(
      <IconButton onClick={mockOnClick} icon={mockIcon} />
    )

    const button = container.firstChild as HTMLElement

    // Test multiple clicks
    await user.click(button)
    await user.click(button)

    expect(mockOnClick).toHaveBeenCalledTimes(2)
  })

  it("should pass event object to onClick handler", async () => {
    const user = userEvent.setup()

    const { container } = render(
      <IconButton onClick={mockOnClick} icon={mockIcon} />
    )

    const button = container.firstChild as HTMLElement
    await user.click(button)

    expect(mockOnClick).toHaveBeenCalledWith(expect.any(Object))

    const callArgs = mockOnClick.mock.calls[0][0]
    expect(callArgs.type).toBe("click")
  })
})
