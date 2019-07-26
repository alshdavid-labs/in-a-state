# In a State

Some convinient hooks/decorators to help with using a React context as a dependency container

## Install

```
yarn add in-a-state
```

## Use

Imagine this structure:

```
/src
  theme-engine.ts
  state.ts
  context.ts
  toolbar.tsx
  app.tsx
```

Describe your dependency

```ts
import { BehaviorSubject } from 'rxjs'
import { AxiosInstance } from 'axios'
import * as CSS from 'csstype';

export class ThemeEngine {
  theme = new BehaviorSubject<CSS.Properties>({
    color: 'white',
    backgroundColor: 'blue'
  })

  constructor(
    private http: AxiosInstance
  ) {}

  merge(styles: CSS.Properties) {
    this.theme.next({ 
      ...this.theme.getValue(),
      ...styles, 
    })
  }

  replace(styles: CSS.Properties) {
    this.theme.next(styles)
  }

  async fetch() {
    const result = await this.http.get('https://theme-api.com')
    this.merge(result.data)
  }
}

```

Export your state object with it's loaded instances

```ts
// state.ts
import { ThemeEngine } from './theme-engine';
import axios, { AxiosInstance } from 'axios'

export const httpClient = axios.create()
export const themeEngine = new ThemeEngine(httpClient)

export interface State {
  httpClient?: AxiosInstance
  themeEngine?: ThemeEngine
}

export const state: State = {
  httpClient,
  themeEngine
}

```

Export a new React Context and generated hooks, typed against your state

```ts
// context.ts
import React from 'react';
import { createInstanceHook, createStateSelector } from 'in-a-state';
import { State } from './state';

export const StateContext = React.createContext(true)

// Hooks used to help access state
export const useStateSelector = createStateSelector<State>(StateContext)
export const useInstanceOf = createInstanceHook(StateContext)
```

Consume a dependency using the generated hooks

```tsx
// toolbar.tsx
import React from 'react';
import { useBehaviorSubject } from 'use-subscribable'
import { ThemeEngine } from './theme-engine';
import { useInstanceOf } from './context';

interface ToolbarProps {
  children?: React.ReactNode
}

export const Toolbar = ({ children }: ToolbarProps) => {  
  const themeEngine = useInstanceOf(ThemeEngine)
  const themes = useBehaviorSubject(themeEngine.theme)

  return (
    <div style={{
        color: themes.color,
        backgroundColor: themes.backgroundColor
      }}>
      { children }
    </div>
  )}
```

```tsx
// app.tsx
import React, { useState } from 'react'
import { Toolbar } from './toolbar';
import { useStateSelector } from './state';

export const Home = () => {
    const httpClient = useStateSelector(state => state.httpClient)
    const [ todos, setTodos ] = useState([])

    const fetchPosts = async () => {
      const results = await httpClient.get('https://jsonplaceholder.typicode.com/todos')
      setTodos(results.data)
    }

    return <div>
      <Toolbar>
        App name
      </Toolbar>
      <button 
        onClick={fetchPosts}>
        Get Posts
      </button>
      { 
        todos.map((todo: any) => 
        <div 
          key={todo.id}>
          {todo.title}
        </div>)
      }
    </div>
}
```
