import { useContext } from "react";

// React Hook
export const useInstanceOf = <T = any>(
  targetContext: any, 
  object: new (...args: any[]) => T
): T => {
  const context: any = useContext(targetContext)
  const instance = findInstanceFromRecord(context, object)
  if (!instance) {
    throw new Error('Unable to find instance of object')
  }
  return instance
}

export const findInstanceFromRecord = <T = any>(
  collection: Record<string, any>, 
  object: new (...args: any[]) => T
): T | undefined => {
  for (const item in collection) {
    if (collection[item] instanceof object) {
      return collection[item]
    }
  }
}