import { renderHook, act } from '@testing-library/react';
import useOnScreen from './useOnScreen';
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterAll, beforeAll } from 'vitest';

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
let intersectionCallback: IntersectionObserverCallback | null = null;

mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
});

// Helper to trigger the intersection callback
const triggerIntersection = (isIntersecting: boolean) => {
  if (intersectionCallback) {
    act(() => {
        intersectionCallback([{ isIntersecting }] as IntersectionObserverEntry[], {} as IntersectionObserver);
    });
  }
};

describe('useOnScreen', () => {
  beforeAll(() => {
    // Before all tests, mock the IntersectionObserver
    vi.spyOn(window, 'IntersectionObserver').mockImplementation((callback) => {
      intersectionCallback = callback;
      return mockIntersectionObserver();
    });
  });

  afterAll(() => {
    // Restore the original implementation after all tests
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    // Clear mocks before each test
    vi.clearAllMocks();
    intersectionCallback = null;
  });

  it('should return false initially', () => {
    const ref = { current: document.createElement('div') };
    const { result } = renderHook(() => useOnScreen(ref as React.RefObject<Element>));
    expect(result.current).toBe(false);
  });

  it('should call observe on the element when the ref is set', () => {
    const ref = { current: document.createElement('div') };
    renderHook(() => useOnScreen(ref as React.RefObject<Element>));
    expect(mockIntersectionObserver().observe).toHaveBeenCalledWith(ref.current);
  });

  it('should return true when the element is intersecting', () => {
    const ref = { current: document.createElement('div') };
    const { result } = renderHook(() => useOnScreen(ref as React.RefObject<Element>));

    expect(result.current).toBe(false); // Initial state
    triggerIntersection(true);
    expect(result.current).toBe(true); // State after intersection
  });

  it('should return false when the element stops intersecting', () => {
    const ref = { current: document.createElement('div') };
    const { result } = renderHook(() => useOnScreen(ref as React.RefObject<Element>));

    triggerIntersection(true);
    expect(result.current).toBe(true);

    triggerIntersection(false);
    expect(result.current).toBe(false);
  });

  it('should clean up the observer on unmount', () => {
    const ref = { current: document.createElement('div') };
    const { unmount } = renderHook(() => useOnScreen(ref as React.RefObject<Element>));

    expect(mockIntersectionObserver().observe).toHaveBeenCalledWith(ref.current);

    unmount();

    expect(mockIntersectionObserver().unobserve).toHaveBeenCalledWith(ref.current);
  });
});