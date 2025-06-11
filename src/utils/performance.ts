// Performance monitoring utilities for handling 100+ concurrent users

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Memoization helper for expensive calculations
export const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache = new Map()
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args)
    if (cache.has(key)) {
      return cache.get(key)
    }
    const result = fn(...args)
    cache.set(key, result)
    return result
  }) as T
}

// Performance observer for monitoring
export const observePerformance = () => {
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry) => {
        if (entry.entryType === 'measure') {
          console.log(`Performance: ${entry.name} took ${entry.duration}ms`)
        }
      })
    })
    
    observer.observe({ entryTypes: ['measure', 'navigation'] })
    return observer
  }
  return null
}

// Measure component render time
export const measureRender = (componentName: string, fn: () => void) => {
  if (process.env.NODE_ENV === 'development') {
    performance.mark(`${componentName}-start`)
    fn()
    performance.mark(`${componentName}-end`)
    performance.measure(
      `${componentName}-render`,
      `${componentName}-start`,
      `${componentName}-end`
    )
  } else {
    fn()
  }
}

// Memory usage monitoring
export const getMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory
    return {
      used: Math.round(memory.usedJSHeapSize / 1048576), // MB
      total: Math.round(memory.totalJSHeapSize / 1048576), // MB
      limit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
    }
  }
  return null
}

// Lazy loading intersection observer
export const createIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
) => {
  if ('IntersectionObserver' in window) {
    return new IntersectionObserver(callback, {
      rootMargin: '50px',
      threshold: 0.1,
      ...options,
    })
  }
  return null
}

// Network quality detection
export const getNetworkQuality = (): 'slow' | 'fast' | 'unknown' => {
  if ('connection' in navigator) {
    const connection = (navigator as any).connection
    if (connection) {
      // Consider 2G and slow-2g as slow
      if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
        return 'slow'
      }
      return 'fast'
    }
  }
  return 'unknown'
}

// Optimize images based on device capabilities
export const getOptimalImageSize = (
  baseWidth: number,
  baseHeight: number
): { width: number; height: number } => {
  const devicePixelRatio = window.devicePixelRatio || 1
  const networkQuality = getNetworkQuality()
  
  let scaleFactor = 1
  
  // Reduce image quality on slow networks
  if (networkQuality === 'slow') {
    scaleFactor = 0.7
  } else if (devicePixelRatio > 1) {
    scaleFactor = Math.min(devicePixelRatio, 2) // Cap at 2x for performance
  }
  
  return {
    width: Math.round(baseWidth * scaleFactor),
    height: Math.round(baseHeight * scaleFactor),
  }
}

// Session storage with expiration for caching
export const setSessionCache = (key: string, value: any, ttlMinutes: number = 30) => {
  const item = {
    value,
    expiry: Date.now() + ttlMinutes * 60 * 1000,
  }
  sessionStorage.setItem(key, JSON.stringify(item))
}

export const getSessionCache = (key: string) => {
  const itemStr = sessionStorage.getItem(key)
  if (!itemStr) return null
  
  try {
    const item = JSON.parse(itemStr)
    if (Date.now() > item.expiry) {
      sessionStorage.removeItem(key)
      return null
    }
    return item.value
  } catch {
    sessionStorage.removeItem(key)
    return null
  }
}