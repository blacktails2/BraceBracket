import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"

import { Button } from "./Button"

describe("Button", () => {
  it("should render with children content", () => {
    render(<Button>Click me</Button>)

    const button = screen.getByRole("button")
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent("Click me")
  })

  it("should render without children content", () => {
    render(<Button />)

    const button = screen.getByRole("button")
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent("")
  })

  it("should handle onClick event", async () => {
    const user = userEvent.setup()
    const mockOnClick = vi.fn()

    render(<Button onClick={mockOnClick}>Click me</Button>)

    const button = screen.getByRole("button")
    await user.click(button)

    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  it("should handle different button types", () => {
    const { rerender } = render(<Button type="submit">Submit</Button>)

    let button = screen.getByRole("button")
    expect(button).toHaveAttribute("type", "submit")

    rerender(<Button type="reset">Reset</Button>)
    button = screen.getByRole("button")
    expect(button).toHaveAttribute("type", "reset")

    rerender(<Button type="button">Button</Button>)
    button = screen.getByRole("button")
    expect(button).toHaveAttribute("type", "button")
  })

  it("should apply different modes", () => {
    const { rerender } = render(<Button mode="normal">Normal</Button>)

    let button = screen.getByRole("button")
    expect(button.className).toMatch(/_normal_/)

    rerender(<Button mode="small">Small</Button>)
    button = screen.getByRole("button")
    expect(button.className).toMatch(/_small_/)

    rerender(<Button mode="primary">Primary</Button>)
    button = screen.getByRole("button")
    expect(button.className).toMatch(/_primary_/)
  })

  it("should default to normal mode when not specified", () => {
    render(<Button>Default</Button>)

    const button = screen.getByRole("button")
    expect(button.className).toMatch(/_normal_/)
  })

  it("should apply light style when specified", () => {
    render(<Button light>Light Button</Button>)

    const button = screen.getByRole("button")
    expect(button.className).toMatch(/_light_/)
  })

  it("should not apply light style when not specified", () => {
    render(<Button>Regular Button</Button>)

    const button = screen.getByRole("button")
    expect(button.className).not.toMatch(/_light_/)
  })

  it("should apply custom className to container", () => {
    render(<Button className="bg-purple-500">Custom</Button>)

    const button = screen.getByRole("button")
    const container = button.parentElement?.parentElement
    expect(container).toHaveClass("bg-purple-500")
  })

  it("should apply full width style when specified", () => {
    render(<Button full>Full Width</Button>)

    const button = screen.getByRole("button")
    expect(button).toHaveStyle({ width: "100%" })
  })

  it("should not apply full width style when not specified", () => {
    render(<Button>Regular Width</Button>)

    const button = screen.getByRole("button")
    expect(button).not.toHaveStyle({ width: "100%" })
  })

  it("should show tooltip when showTooltip is true", () => {
    render(
      <Button tooltipText="This is a tooltip" showTooltip={true}>
        Hover me
      </Button>
    )

    const tooltip = screen.getByText("This is a tooltip")
    expect(tooltip).toBeInTheDocument()
  })

  it("should hide tooltip when showTooltip is false", () => {
    render(
      <Button tooltipText="This is a tooltip" showTooltip={false}>
        Hover me
      </Button>
    )

    expect(screen.queryByText("This is a tooltip")).not.toBeInTheDocument()
  })

  it("should not render tooltip when tooltipText is not provided", () => {
    render(<Button showTooltip={true}>Button text</Button>)

    // Check that no tooltip container with specific tooltip text exists
    expect(screen.queryByText("This is a tooltip")).not.toBeInTheDocument()
  })

  it("should handle complex children content", () => {
    render(
      <Button>
        <span>Icon</span>
        <span>Text</span>
      </Button>
    )

    const button = screen.getByRole("button")
    expect(button).toBeInTheDocument()
    expect(screen.getByText("Icon")).toBeInTheDocument()
    expect(screen.getByText("Text")).toBeInTheDocument()
  })

  it("should handle mouse event with correct parameters", async () => {
    const user = userEvent.setup()
    const mockOnClick = vi.fn()

    render(<Button onClick={mockOnClick}>Click me</Button>)

    const button = screen.getByRole("button")
    await user.click(button)

    expect(mockOnClick).toHaveBeenCalledTimes(1)
    expect(mockOnClick).toHaveBeenCalledWith(expect.any(Object))

    const callArgs = mockOnClick.mock.calls[0][0]
    expect(callArgs.type).toBe("click")
  })

  it("should combine multiple props correctly", () => {
    render(
      <Button
        mode="primary"
        light
        full
        type="submit"
        className="bg-red-500"
        tooltipText="Combined tooltip"
        showTooltip={true}
      >
        Combined Props
      </Button>
    )

    const button = screen.getByRole("button")
    expect(button).toHaveAttribute("type", "submit")
    expect(button.className).toMatch(/_primary_/)
    expect(button.className).toMatch(/_light_/)
    expect(button).toHaveStyle({ width: "100%" })

    const container = button.parentElement?.parentElement
    expect(container).toHaveClass("bg-red-500")

    const tooltip = screen.getByText("Combined tooltip")
    expect(tooltip).toBeInTheDocument()
  })
})
