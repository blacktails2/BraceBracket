import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'

import { TextForm } from './TextForm'

interface TestWrapperProps {
  children: React.ReactNode
  defaultValues?: { [key: string]: boolean | string | number }
}

const TestWrapper = ({ children, defaultValues = {} }: TestWrapperProps) => {
  const methods = useForm({ defaultValues })
  return <FormProvider {...methods}>{children}</FormProvider>
}

describe('TextForm', () => {
  it('should render with required props', () => {
    render(
      <TestWrapper>
        <TextForm name="test" placeholder="Enter text" />
      </TestWrapper>
    )
    
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'text')
    expect(input).toHaveAttribute('id', 'test')
    expect(input).toHaveAttribute('placeholder', 'Enter text')
  })

  it('should render label when provided', () => {
    render(
      <TestWrapper>
        <TextForm name="test" placeholder="Enter text" label="Test Label" />
      </TestWrapper>
    )
    
    const label = screen.getByText('Test Label')
    expect(label).toBeInTheDocument()
    expect(label).toHaveAttribute('for', 'test')
  })

  it('should not render label when not provided', () => {
    render(
      <TestWrapper>
        <TextForm name="test" placeholder="Enter text" />
      </TestWrapper>
    )
    
    expect(screen.queryByRole('label')).not.toBeInTheDocument()
  })

  it('should apply custom className', () => {
    render(
      <TestWrapper>
        <TextForm name="test" placeholder="Enter text" className="bg-yellow-500" />
      </TestWrapper>
    )
    
    const container = screen.getByRole('textbox').parentElement
    expect(container).toHaveClass('bg-yellow-500')
  })

  it('should handle disabled state', () => {
    render(
      <TestWrapper>
        <TextForm name="test" placeholder="Enter text" disabled />
      </TestWrapper>
    )
    
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
  })

  it('should handle autocomplete settings', () => {
    render(
      <TestWrapper>
        <TextForm name="test" placeholder="Enter text" autocomplete="username" />
      </TestWrapper>
    )
    
    const input = screen.getByRole('combobox')
    expect(input).toHaveAttribute('autocomplete', 'on')
    expect(input).toHaveAttribute('list', 'username')
  })

  it('should disable autocomplete when not provided', () => {
    render(
      <TestWrapper>
        <TextForm name="test" placeholder="Enter text" />
      </TestWrapper>
    )
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('autocomplete', 'off')
  })

  it('should apply dirty style when value differs from cleanValue', () => {
    render(
      <TestWrapper defaultValues={{ test: 'current value' }}>
        <TextForm name="test" placeholder="Enter text" cleanValue="clean value" />
      </TestWrapper>
    )
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveStyle({ backgroundColor: 'var(--bb-dirty)' })
  })

  it('should not apply dirty style when value equals cleanValue', () => {
    render(
      <TestWrapper defaultValues={{ test: 'same value' }}>
        <TextForm name="test" placeholder="Enter text" cleanValue="same value" />
      </TestWrapper>
    )
    
    const input = screen.getByRole('textbox')
    expect(input).not.toHaveStyle({ backgroundColor: 'var(--bb-dirty)' })
  })

  it('should not apply dirty style when cleanValue is undefined', () => {
    render(
      <TestWrapper defaultValues={{ test: 'some value' }}>
        <TextForm name="test" placeholder="Enter text" />
      </TestWrapper>
    )
    
    const input = screen.getByRole('textbox')
    expect(input).not.toHaveStyle({ backgroundColor: 'var(--bb-dirty)' })
  })

  it('should call onChange callback when provided', async () => {
    const user = userEvent.setup()
    const mockOnChange = vi.fn()
    
    render(
      <TestWrapper>
        <TextForm name="test" placeholder="Enter text" onChange={mockOnChange} />
      </TestWrapper>
    )
    
    const input = screen.getByRole('textbox')
    await user.type(input, 'hello')
    
    expect(mockOnChange).toHaveBeenCalled()
  })

  it('should handle user input correctly', async () => {
    const user = userEvent.setup()
    
    render(
      <TestWrapper>
        <TextForm name="test" placeholder="Enter text" />
      </TestWrapper>
    )
    
    const input = screen.getByRole('textbox')
    await user.type(input, 'test input')
    
    expect(input).toHaveValue('test input')
  })
})