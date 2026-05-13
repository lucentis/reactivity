import { describe, it, expect, vi } from 'vitest'
import { state } from '../state'
import { effect } from '../effect'
import { derived } from '../derived'
import { flushSync } from '../../runtime-reactivity/scheduler'

describe('derived', () => {
    it('computes the initial value', () => {
        const count = state(2)
        const double = derived(() => count.get() * 2)

        expect(double.get()).toBe(4)
    })

    it('updates when a dependency changes', () => {
        const count = state(2)
        const double = derived(() => count.get() * 2)

        count.set(5)
        flushSync()

        expect(double.get()).toBe(10)
    })

    it('can be used as a dependency in an effect', () => {
        const count = state(0)
        const double = derived(() => count.get() * 2)
        const values: number[] = []

        effect(() => { values.push(double.get()) })

        count.set(1); flushSync()
        count.set(3); flushSync()

        expect(values).toEqual([0, 2, 6])
    })

    it('can depend on multiple states', () => {
        const a = state(1)
        const b = state(2)
        const sum = derived(() => a.get() + b.get())

        expect(sum.get()).toBe(3)

        a.set(10); flushSync()
        expect(sum.get()).toBe(12)

        b.set(5); flushSync()
        expect(sum.get()).toBe(15)
    })

    it('can be chained', () => {
        const count = state(2)
        const double = derived(() => count.get() * 2)
        const quadruple = derived(() => double.get() * 2)

        expect(quadruple.get()).toBe(8)

        count.set(3); flushSync()
        expect(quadruple.get()).toBe(12)
    })
})