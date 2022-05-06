import { IronSession } from 'iron-session'

export type AppSession<T = unknown> = IronSession & T
