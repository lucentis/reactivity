import { describe, it, expect, vi } from 'vitest'
import { state } from '../state'
import { effect } from '../effect'
import { flushSync } from '../../runtime-reactivity/scheduler'

describe('effect', () => {
    it('runs immediately on creation', () => {
        const spy = vi.fn()
        effect(spy)
        expect(spy).toHaveBeenCalledTimes(1)
    })

    it('re-runs when a dependency changes', () => {
        const count = state(0)
        const spy = vi.fn()

        effect(() => { count.get(); spy() })

        spy.mockClear()
        count.set(1)
        flushSync()

        expect(spy).toHaveBeenCalledTimes(1)
    })

    it('does not re-run when an unread state changes', () => {
        const a = state(0)
        const b = state(0)
        const spy = vi.fn()

        effect(() => { a.get(); spy() })

        spy.mockClear()
        b.set(1)
        flushSync()

        expect(spy).not.toHaveBeenCalled()
    })

    it('tracks the correct value when re-running', () => {
        const count = state(0)
        const values: number[] = []

        effect(() => { values.push(count.get()) })

        count.set(1); flushSync()
        count.set(2); flushSync()

        expect(values).toEqual([0, 1, 2])
    })

    it('batches multiple synchronous updates into a single run', () => {
        const count = state(0)
        const spy = vi.fn()

        effect(() => { count.get(); spy() })

        spy.mockClear()
        count.set(1)
        count.set(2)
        count.set(3)

        // queue is not flushed yet — effect has not run
        expect(spy).not.toHaveBeenCalled()

        flushSync()

        // effect ran exactly once, with the final value
        expect(spy).toHaveBeenCalledTimes(1)
        expect(count.get()).toBe(3)
    })

    it('drops stale dependencies after re-run', () => {
        const toggle = state(true)
        const a = state(0)
        const b = state(0)
        const spy = vi.fn()

        effect(() => {
            if (toggle.get()) { a.get() } else { b.get() }
            spy()
        })

        spy.mockClear()

        toggle.set(false); flushSync() // effect now depends on b, not a
        spy.mockClear()

        a.set(99); flushSync()
        expect(spy).not.toHaveBeenCalled()

        b.set(1); flushSync()
        expect(spy).toHaveBeenCalledTimes(1)
    })
})