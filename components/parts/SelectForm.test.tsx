import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { FormProvider, useForm } from "react-hook-form"
import { describe, it, expect } from "vitest"

import { SelectForm } from "./SelectForm"

interface TestWrapperProps {
  children: React.ReactNode
  defaultValues?: { [key: string]: boolean | string | number }
}

const TestWrapper = ({ children, defaultValues = {} }: TestWrapperProps) => {
  const methods = useForm({ defaultValues })
  return <FormProvider {...methods}>{children}</FormProvider>
}

const mockOptions = [
  { text: "Option 1", value: "opt1" },
  { text: "Option 2", value: "opt2" },
  { text: "Option 3", value: "opt3" },
]

describe("SelectForm", () => {
  it("should render with required props", () => {
    render(
      <TestWrapper>
        <SelectForm name="test" label="Test Label" options={mockOptions} />
      </TestWrapper>
    )

    const label = screen.getByText("Test Label")
    expect(label).toBeInTheDocument()

    const input = screen.getByRole("combobox")
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute("type", "text")
    expect(input).toHaveAttribute("list", "test")
  })

  it("should render datalist with options", () => {
    render(
      <TestWrapper>
        <SelectForm name="test" label="Test Label" options={mockOptions} />
      </TestWrapper>
    )

    const datalist = document.getElementById("test")
    expect(datalist).toBeInTheDocument()
    expect(datalist?.tagName).toBe("DATALIST")

    const options = datalist?.querySelectorAll("option")
    expect(options).toHaveLength(3)

    expect(options?.[0]).toHaveAttribute("value", "opt1")
    expect(options?.[0]).toHaveTextContent("Option 1")
    expect(options?.[1]).toHaveAttribute("value", "opt2")
    expect(options?.[1]).toHaveTextContent("Option 2")
    expect(options?.[2]).toHaveAttribute("value", "opt3")
    expect(options?.[2]).toHaveTextContent("Option 3")
  })

  it("should apply custom className", () => {
    render(
      <TestWrapper>
        <SelectForm
          name="test"
          label="Test Label"
          options={mockOptions}
          className="bg-green-500"
        />
      </TestWrapper>
    )

    const container = screen.getByRole("combobox").parentElement?.parentElement
    expect(container).toHaveClass("bg-green-500")
  })

  it("should handle disabled state", () => {
    render(
      <TestWrapper>
        <SelectForm
          name="test"
          label="Test Label"
          options={mockOptions}
          disabled
        />
      </TestWrapper>
    )

    const input = screen.getByRole("combobox")
    expect(input).toBeDisabled()
  })

  it("should handle user input correctly", async () => {
    const user = userEvent.setup()

    render(
      <TestWrapper>
        <SelectForm name="test" label="Test Label" options={mockOptions} />
      </TestWrapper>
    )

    const input = screen.getByRole("combobox")
    await user.type(input, "custom value")

    expect(input).toHaveValue("custom value")
  })

  it("should render with empty options array", () => {
    render(
      <TestWrapper>
        <SelectForm name="test" label="Test Label" options={[]} />
      </TestWrapper>
    )

    const datalist = document.getElementById("test")
    expect(datalist).toBeInTheDocument()

    const options = datalist?.querySelectorAll("option")
    expect(options).toHaveLength(0)
  })

  it("should handle complex option values", () => {
    const complexOptions = [
      { text: "Option with spaces", value: "option_with_spaces" },
      { text: "Option/with/slashes", value: "option-with-slashes" },
      { text: "特殊文字オプション", value: "japanese-option" },
    ]

    render(
      <TestWrapper>
        <SelectForm name="test" label="Test Label" options={complexOptions} />
      </TestWrapper>
    )

    const datalist = document.getElementById("test")
    const options = datalist?.querySelectorAll("option")

    expect(options).toHaveLength(3)
    expect(options?.[0]).toHaveAttribute("value", "option_with_spaces")
    expect(options?.[0]).toHaveTextContent("Option with spaces")
    expect(options?.[2]).toHaveAttribute("value", "japanese-option")
    expect(options?.[2]).toHaveTextContent("特殊文字オプション")
  })
})
