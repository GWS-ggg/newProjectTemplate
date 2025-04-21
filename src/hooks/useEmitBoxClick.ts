import type { Prop } from '@/types'

export function useEmitBoxClick(emit: (event: 'boxClick', ...args: any[]) => void) {
  function handleBoxClick(prop: Prop, event: MouseEvent) {
    emit('boxClick', prop, event)
  }
  return { handleBoxClick }
}
