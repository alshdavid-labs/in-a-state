import { useInstanceOf } from './use-instance-of'

export const createInstanceHook = <T = any>(context: React.Context<T>) => {
  return <T = any>(object: new (...args: any[]) => T): T => {
    return useInstanceOf(context, object)
  }
}