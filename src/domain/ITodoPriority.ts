import type { IDomainId } from './IDomainId'

export interface IGpsLocationType extends IDomainId {
  priorityName: string
  prioritySort: number
  syncDt: string
  tag?: string
}
