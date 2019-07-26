import React, { useContext } from "react";

export const createStateSelector = <T = any, T3 = any>(context: React.Context<T3>) => {
  return <T2 = any>(fn: (p: T) => T2 | undefined): T2 => {
    const state = useContext(context)
    const part = fn(state as any)
    if (part === undefined) {
      throw new Error('Unable to access value')
    }
    return part
  }
}