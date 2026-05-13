import { describe, it, expect, vi } from 'vitest'
import { state } from '../state'
import { effect } from '../effect'
import { flushSync } from '../../runtime-reactivity/scheduler'

describe('state', () => {
    describe('get', () => {
        it('returns the initial value', () => {
            const count = state(0)
            expect(count.get()).toBe(0)
        })

        it('works with any type', () => {
            const name = state('alice')
            const obj = state({ x: 1 })

            expect(name.get()).toBe('alice')
            expect(obj.get()).toEqual({ x: 1 })
        })
    })

    describe('set', () => {
        it('updates the value synchronously', () => {
            const count = state(0)
            count.set(5)
            // get() reads the value directly — no scheduler involved
            expect(count.get()).toBe(5)
        })

        it('does not notify when value is identical (Object.is)', () => {
            const count = state(0)
            const spy = vi.fn()

            effect(() => { count.get(); spy() })

            spy.mockClear()
            count.set(0)
            flushSync()

            expect(spy).not.toHaveBeenCalled()
        })

        it('notifies subscribers when value changes', () => {
            const count = state(0)
            const spy = vi.fn()

            effect(() => { count.get(); spy() })

            spy.mockClear()
            count.set(1)
            flushSync()

            expect(spy).toHaveBeenCalledTimes(1)
        })

        it('notifies multiple subscribers', () => {
            const count = state(0)
            const spy1 = vi.fn()
            const spy2 = vi.fn()

            effect(() => { count.get(); spy1() })
            effect(() => { count.get(); spy2() })

            spy1.mockClear()
            spy2.mockClear()
            count.set(1)
            flushSync()

            expect(spy1).toHaveBeenCalledTimes(1)
            expect(spy2).toHaveBeenCalledTimes(1)
        })
    })
})