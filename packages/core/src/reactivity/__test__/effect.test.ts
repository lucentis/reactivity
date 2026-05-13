import { describe, it, expect, vi } from 'vitest'
import { state } from '../state'
import { effect } from '../effect'

describe('effect', () => {
    it('runs immediately on creation', () => {
        const spy = vi.fn()
        effect(spy)
        expect(spy).toHaveBeenCalledTimes(1)
    })

    it('re-runs when a dependency changes', () => {
        const count = state(0)
        const spy = vi.fn()

        effect(() => {
            count.get()
            spy()
        })

        spy.mockClear()
        count.set(1)

        expect(spy).toHaveBeenCalledTimes(1)
    })

    it('does not re-run when an unread state changes', () => {
        const a = state(0)
        const b = state(0)
        const spy = vi.fn()

        effect(() => {
            a.get() // only reads a, not b
            spy()
        })

        spy.mockClear()
        b.set(1) // b changes, effect should not run

        expect(spy).not.toHaveBeenCalled()
    })

    it('tracks the correct value when re-running', () => {
        const count = state(0)
        const values: number[] = []

        effect(() => {
            values.push(count.get())
        })

        count.set(1)
        count.set(2)

        expect(values).toEqual([0, 1, 2])
    })

    // This test covers the cleanup mechanism.
    // Without cleanup, the effect would remain subscribed to `a`
    // even after the condition switches to false.
    it('drops stale dependencies after re-run', () => {
        const toggle = state(true)
        const a = state(0)
        const b = state(0)
        const spy = vi.fn()

        effect(() => {
            if (toggle.get()) {
                a.get()
            } else {
                b.get()
            }
            spy()
        })

        spy.mockClear()

        toggle.set(false) // effect now depends on b, not a
        spy.mockClear()

        a.set(99) // a changes — effect should NOT run anymore
        expect(spy).not.toHaveBeenCalled()

        b.set(1) // b changes — effect SHOULD run
        expect(spy).toHaveBeenCalledTimes(1)
    })
})