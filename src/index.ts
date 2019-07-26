// This package might-should go into NPM

export * from './use-instance-of'
export * from './create-instace-hook'
export * from './create-state-selector'

import { useInstanceOf } from './use-instance-of'
import { createInstanceHook } from './create-instace-hook'
import { createStateSelector } from './create-state-selector'

export default {
  useInstanceOf,
  createInstanceHook,
  createStateSelector
}



