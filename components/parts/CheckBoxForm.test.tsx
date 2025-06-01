import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { FormProvider, useForm } from "react-hook-form"
import { describe, it, expect, vi } from "vitest"

import { CheckBoxForm } from "./CheckBoxForm"

interface TestWrapperProps {
  children: React.ReactNode
  defaultValues?: { [key: string]: boolean | string | number }
}

const TestWrapper = ({ children, defaultValues = {} }: TestWrapperProps) => {
  const methods = useForm({ defaultValues })
  return <FormProvider {...methods}>{children}</FormProvider>
}

describe("CheckBoxForm", () => {
  it("should render with required props", () => {
    render(
      <TestWrapper>
        <CheckBoxForm label="Test Label" name="test" />
      </TestWrapper>
    )

    const checkbox = screen.getByRole("checkbox")
    expect(checkbox).toBeInTheDocument()
    expect(checkbox).toHaveAttribute("id", "test")

    const label = screen.getByText("Test Label")
    expect(label).toBeInTheDocument()
    expect(label).toHaveAttribute("for", "test")
  })

  it("should use custom id when provided", () => {
    render(
      <TestWrapper>
        <CheckBoxForm label="Test Label" name="test" id="custom-id" />
      </TestWrapper>
    )

    const checkbox = screen.getByRole("checkbox")
    expect(checkbox).toHaveAttribute("id", "custom-id")

    const label = screen.getByText("Test Label")
    expect(label).toHaveAttribute("for", "custom-id")
  })

  it("should apply custom className", () => {
    render(
      <TestWrapper>
        <CheckBoxForm label="Test Label" name="test" className="bg-red-500" />
      </TestWrapper>
    )

    // className is applied to the very outermost div based on the component structure
    const checkbox = screen.getByRole("checkbox")
    const outerContainer = checkbox.closest("div")?.parentElement?.parentElement
    expect(outerContainer).toHaveClass("bg-red-500")
  })

  it("should handle disabled state", () => {
    render(
      <TestWrapper>
        <CheckBoxForm label="Test Label" name="test" disabled />
      </TestWrapper>
    )

    const checkbox = screen.getByRole("checkbox")
    expect(checkbox).toBeDisabled()
  })

  it("should work without form context (controlled mode)", () => {
    const mockOnChange = vi.fn()

    render(
      <CheckBoxForm
        label="Test Label"
        id="standalone"
        checked={false}
        onChange={mockOnChange}
      />
    )

    const checkbox = screen.getByRole("checkbox")
    expect(checkbox).toBeInTheDocument()
    expect(checkbox).not.toBeChecked()
    expect(checkbox).toHaveAttribute("id", "standalone")
  })

  it("should call onChange in controlled mode", async () => {
    const user = userEvent.setup()
    const mockOnChange = vi.fn()

    render(
      <CheckBoxForm
        label="Test Label"
        id="standalone"
        checked={false}
        onChange={mockOnChange}
      />
    )

    const checkbox = screen.getByRole("checkbox")
    await user.click(checkbox)

    expect(mockOnChange).toHaveBeenCalledTimes(1)
  })

  it("should handle checked state in controlled mode", () => {
    const { rerender } = render(
      <CheckBoxForm
        label="Test Label"
        id="standalone"
        checked={false}
        onChange={() => undefined}
      />
    )

    const checkbox = screen.getByRole("checkbox")
    expect(checkbox).not.toBeChecked()

    rerender(
      <CheckBoxForm
        label="Test Label"
        id="standalone"
        checked={true}
        onChange={() => undefined}
      />
    )

    expect(checkbox).toBeChecked()
  })

  it("should display tooltip on hover when tooltipText is provided", async () => {
    const user = userEvent.setup()

    render(
      <TestWrapper>
        <CheckBoxForm
          label="Test Label"
          name="test"
          tooltipText="This is a tooltip with <strong>HTML</strong>"
        />
      </TestWrapper>
    )

    const container = screen.getByText("Test Label").closest("div")
    expect(container).toBeInTheDocument()

    // Tooltip should not be visible initially
    expect(screen.queryByText(/This is a tooltip/)).not.toBeInTheDocument()

    // Hover to show tooltip
    if (container) {
      await user.hover(container)

      // Wait for tooltip to appear
      const tooltip = await screen.findByText(/This is a tooltip/)
      expect(tooltip).toBeInTheDocument()

      // Check HTML content is rendered
      expect(tooltip.innerHTML).toContain("<strong>HTML</strong>")
    }
  })

  it("should hide tooltip on mouse leave", async () => {
    const user = userEvent.setup()

    render(
      <TestWrapper>
        <CheckBoxForm
          label="Test Label"
          name="test"
          tooltipText="This is a tooltip"
        />
      </TestWrapper>
    )

    const container = screen.getByText("Test Label").closest("div")

    if (container) {
      // Hover to show tooltip
      await user.hover(container)
      const tooltip = await screen.findByText(/This is a tooltip/)
      expect(tooltip).toBeInTheDocument()

      // Unhover to hide tooltip
      await user.unhover(container)
    }

    // Wait for tooltip to disappear
    await vi.waitFor(
      () => {
        expect(screen.queryByText(/This is a tooltip/)).not.toBeInTheDocument()
      },
      { timeout: 1000 }
    )
  })

  it("should not show tooltip when tooltipText is not provided", async () => {
    const user = userEvent.setup()

    render(
      <TestWrapper>
        <CheckBoxForm label="Test Label" name="test" />
      </TestWrapper>
    )

    const container = screen.getByText("Test Label").closest("div")

    if (container) {
      // Hover should not show any tooltip
      await user.hover(container)

      // No tooltip elements should exist
      expect(
        container.querySelector('[class*="tooltip"]')
      ).not.toBeInTheDocument()
    }
  })

  it("should apply dirty style when value differs from cleanValue", () => {
    render(
      <TestWrapper defaultValues={{ test: true }}>
        <CheckBoxForm label="Test Label" name="test" cleanValue={false} />
      </TestWrapper>
    )

    const dummyLabel = screen.getByRole("checkbox").nextElementSibling
    expect(dummyLabel).toHaveStyle({ boxShadow: "0 0 0 3px var(--bb-dirty)" })
  })

  it("should not apply dirty style when value equals cleanValue", () => {
    render(
      <TestWrapper defaultValues={{ test: true }}>
        <CheckBoxForm label="Test Label" name="test" cleanValue={true} />
      </TestWrapper>
    )

    const dummyLabel = screen.getByRole("checkbox").nextElementSibling
    expect(dummyLabel).not.toHaveStyle({
      boxShadow: "0 0 0 3px var(--bb-dirty)",
    })
  })

  it("should not apply dirty style when cleanValue is undefined", () => {
    render(
      <TestWrapper defaultValues={{ test: true }}>
        <CheckBoxForm label="Test Label" name="test" />
      </TestWrapper>
    )

    const dummyLabel = screen.getByRole("checkbox").nextElementSibling
    expect(dummyLabel).not.toHaveStyle({
      boxShadow: "0 0 0 3px var(--bb-dirty)",
    })
  })

  it("should handle form interactions correctly", async () => {
    const user = userEvent.setup()

    render(
      <TestWrapper>
        <CheckBoxForm label="Test Label" name="test" />
      </TestWrapper>
    )

    const checkbox = screen.getByRole("checkbox")
    expect(checkbox).not.toBeChecked()

    await user.click(checkbox)
    expect(checkbox).toBeChecked()

    await user.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })
})
