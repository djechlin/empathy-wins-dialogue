import { describe, it, expect } from 'vitest'

describe('Hello World', () => {
  it('should return hello world', () => {
    const message = 'Hello World'
    expect(message).toBe('Hello World')
  })

  it('should add two numbers', () => {
    const result = 2 + 2
    expect(result).toBe(4)
  })
})