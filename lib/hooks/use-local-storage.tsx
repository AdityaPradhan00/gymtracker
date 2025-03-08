"use client"

import { useState, useEffect, useRef } from "react"

export function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  // Flag to track if this is the first render
  const isFirstRender = useRef(true)

  // Initialize with stored value or initial value
  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    try {
      // Only try to get from localStorage on first render
      if (isFirstRender.current) {
        const item = window.localStorage.getItem(key)
        if (item) {
          setStoredValue(JSON.parse(item))
        }
        isFirstRender.current = false
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error)
    }
  }, [key]) // Only re-run if key changes

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value

      // Save state
      setStoredValue(valueToStore)

      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error("Error writing to localStorage:", error)
    }
  }

  return [storedValue, setValue] as const
}

