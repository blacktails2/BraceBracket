import { render, screen } from "@testing-library/react"
import { FormProvider, useForm } from "react-hook-form"
import { describe, it, expect } from "vitest"

import { NumberForm } from "./NumberForm"

interface TestWrapperProps {
  children: React.ReactNode
  defaultValues?: Record<string, unknown>
}

const TestWrapper = ({ children, defaultValues = {} }: TestWrapperProps) => {
  const methods = useForm({ defaultValues })
  return <FormProvider {...methods}>{children}</FormProvider>
}

describe("NumberForm", () => {
  it("should render with required props", () => {
    render(
      <TestWrapper>
        <NumberForm name="test" />
      </TestWrapper>
    )

    const input = screen.getByRole("spinbutton")
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute("type", "number")
    expect(input).toHaveAttribute("id", "test")
  })

  it("should render label when provided", () => {
    render(
      <TestWrapper>
        <NumberForm name="test" label="Test Label" />
      </TestWrapper>
    )

    const label = screen.getByText("Test Label")
    expect(label).toBeInTheDocument()
    expect(label).toHaveAttribute("for", "test")
  })

  it("should not render label when not provided", () => {
    render(
      <TestWrapper>
        <NumberForm name="test" />
      </TestWrapper>
    )

    expect(screen.queryByRole("label")).not.toBeInTheDocument()
  })

  it("should apply custom className", () => {
    render(
      <TestWrapper>
        <NumberForm name="test" className="bg-blue-500" />
      </TestWrapper>
    )

    const container = screen.getByRole("spinbutton").parentElement
    expect(container).toHaveClass("bg-blue-500")
  })

  it("should apply dirty style when value differs from cleanValue", () => {
    render(
      <TestWrapper defaultValues={{ test: 10 }}>
        <NumberForm name="test" cleanValue={5} />
      </TestWrapper>
    )

    const input = screen.getByRole("spinbutton")
    expect(input).toHaveStyle({ backgroundColor: "var(--bb-dirty)" })
  })

  it("should not apply dirty style when value equals cleanValue", () => {
    render(
      <TestWrapper defaultValues={{ test: 5 }}>
        <NumberForm name="test" cleanValue={5} />
      </TestWrapper>
    )

    const input = screen.getByRole("spinbutton")
    expect(input).not.toHaveStyle({ backgroundColor: "var(--bb-dirty)" })
  })

  it("should not apply dirty style when cleanValue is undefined", () => {
    render(
      <TestWrapper defaultValues={{ test: 10 }}>
        <NumberForm name="test" />
      </TestWrapper>
    )

    const input = screen.getByRole("spinbutton")
    expect(input).not.toHaveStyle({ backgroundColor: "var(--bb-dirty)" })
  })
})
