import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'

import { TextboxWithCopy } from './TextboxWithCopy'

// Mock the clipboard API
const mockWriteText = vi.fn()
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText
  }
})

describe('TextboxWithCopy', () => {
  beforeEach(() => {
    mockWriteText.mockClear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should render with required props', () => {
    render(<TextboxWithCopy text="Hello World" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue('Hello World')
    expect(input).toHaveAttribute('readonly')
    
    const button = screen.getByRole('button', { name: /copy/i })
    expect(button).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    render(<TextboxWithCopy text="Test" className="bg-gray-500" />)
    
    const input = screen.getByRole('textbox')
    const container = input.closest('div')?.parentElement
    expect(container).toHaveClass('bg-gray-500')
  })

  it('should display the provided text in readonly input', () => {
    const testText = 'This is a test text for copying'
    render(<TextboxWithCopy text={testText} />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue(testText)
    expect(input).toHaveAttribute('readonly')
  })

  it('should copy text to clipboard when copy button is clicked', () => {
    const testText = 'Text to copy'
    
    render(<TextboxWithCopy text={testText} />)
    
    const button = screen.getByRole('button', { name: /copy/i })
    fireEvent.click(button)
    
    expect(mockWriteText).toHaveBeenCalledTimes(1)
    expect(mockWriteText).toHaveBeenCalledWith(testText)
  })

  it('should show tooltip when copy button is clicked', () => {
    render(<TextboxWithCopy text="Test" />)
    
    const button = screen.getByRole('button', { name: /copy/i })
    
    // Initially tooltip should not be visible (it exists but is hidden)
    const tooltip = screen.getByText('Copied!')
    expect(tooltip).toHaveStyle({ display: 'none' })
    
    fireEvent.click(button)
    
    // After click, tooltip should be visible
    expect(tooltip).toHaveStyle({ display: 'block' })
  })

  it('should hide tooltip after 1 second', () => {
    render(<TextboxWithCopy text="Test" />)
    
    const button = screen.getByRole('button', { name: /copy/i })
    fireEvent.click(button)
    
    // Tooltip should be visible immediately after click
    const tooltip = screen.getByText('Copied!')
    expect(tooltip).toHaveStyle({ display: 'block' })
    
    // Fast-forward time by 1 second
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    
    // Tooltip should be hidden after 1 second
    expect(tooltip).toHaveStyle({ display: 'none' })
  })

  it('should prevent event propagation when copy button is clicked', () => {
    const mockParentClick = vi.fn()
    
    render(
      <div onClick={mockParentClick}>
        <TextboxWithCopy text="Test" />
      </div>
    )
    
    const button = screen.getByRole('button', { name: /copy/i })
    fireEvent.click(button)
    
    // Parent click should not be triggered due to stopPropagation
    expect(mockParentClick).not.toHaveBeenCalled()
  })

  it('should handle empty text', () => {
    render(<TextboxWithCopy text="" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('')
  })

  it('should handle long text', () => {
    const longText = 'A'.repeat(1000)
    render(<TextboxWithCopy text={longText} />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue(longText)
  })

  it('should handle special characters in text', () => {
    const specialText = 'Special chars: !@#$%^&*()_+-={}[]|;:,.<>?'
    
    render(<TextboxWithCopy text={specialText} />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue(specialText)
    
    const button = screen.getByRole('button', { name: /copy/i })
    fireEvent.click(button)
    
    expect(mockWriteText).toHaveBeenCalledWith(specialText)
  })

  it('should handle multiple clicks correctly', () => {
    render(<TextboxWithCopy text="Test" />)
    
    const button = screen.getByRole('button', { name: /copy/i })
    
    // Click multiple times
    fireEvent.click(button)
    fireEvent.click(button)
    fireEvent.click(button)
    
    expect(mockWriteText).toHaveBeenCalledTimes(3)
    const tooltip = screen.getByText('Copied!')
    expect(tooltip).toHaveStyle({ display: 'block' })
  })

  it('should reset tooltip timer on subsequent clicks', () => {
    render(<TextboxWithCopy text="Test" />)
    
    const button = screen.getByRole('button', { name: /copy/i })
    const tooltip = screen.getByText('Copied!')
    
    // First click
    fireEvent.click(button)
    expect(tooltip).toHaveStyle({ display: 'block' })
    
    // Advance time by 500ms
    act(() => {
      vi.advanceTimersByTime(500)
    })
    
    // Second click before timeout
    fireEvent.click(button)
    expect(tooltip).toHaveStyle({ display: 'block' })
    
    // Advance time by another 500ms (1000ms total from second click)
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    
    // Tooltip should be hidden after the full timeout from second click
    expect(tooltip).toHaveStyle({ display: 'none' })
  })

  it('should handle text updates correctly', () => {
    const { rerender } = render(<TextboxWithCopy text="Initial text" />)
    
    let input = screen.getByRole('textbox')
    expect(input).toHaveValue('Initial text')
    
    rerender(<TextboxWithCopy text="Updated text" />)
    
    input = screen.getByRole('textbox')
    expect(input).toHaveValue('Updated text')
  })
})