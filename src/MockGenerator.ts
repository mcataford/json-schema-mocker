/* eslint-disable no-unused-vars */

import uuid from 'uuid'

import { blockTypes } from './constants'

class MockBuilder {
    constructor() {}

    buildMock(root: any): any {
        const { type, properties, items, enum: allowedValues } = root

        switch (type) {
            case blockTypes.OBJECT:
                return this.buildObjectBlock(properties)
            case blockTypes.INTEGER:
                return this.buildNumericalBlock(root)
            case blockTypes.STRING:
                return this.buildStringBlock(properties, allowedValues)
            case blockTypes.NUMBER:
                return this.buildNumericalBlock(root)
            case blockTypes.BOOLEAN:
                return this.buildBooleanBlock(properties, allowedValues)
            case blockTypes.ARRAY:
                return this.buildArrayBlock(items)
            default:
                return null
        }
    }

    buildObjectBlock(properties: any): any {
        return Object.entries(properties).reduce((block: any, entry: any) => {
            const [propertyName, propertySpecs] = entry
            block[propertyName] = this.buildMock(propertySpecs)
            return block
        }, {})
    }

    buildNumericalBlock(root: any): number {
        const allowedMaximum =
            root.type === blockTypes.INTEGER
                ? Number.MAX_SAFE_INTEGER
                : Number.MAX_VALUE
        const allowedMinimum =
            root.type === blockTypes.INTEGER
                ? Number.MIN_SAFE_INTEGER
                : Number.MIN_VALUE
        const {
            type,
            enum: allowedValues,
            maximum = allowedMaximum,
            minimum = allowedMinimum,
            multipleOf,
        } = root
        if (allowedValues && allowedValues.length > 0) {
            return getRandomAllowedValue(allowedValues)
        }

        if (multipleOf) {
            const multipleMaximum = Math.floor(
                Math.min(Number.MAX_SAFE_INTEGER, maximum),
            )
            return (
                Math.floor((Math.random() * multipleMaximum) / multipleOf) *
                multipleOf
            )
        }

        return type === blockTypes.INTEGER
            ? Math.floor(Math.random() * Math.floor(maximum)) + minimum
            : Math.random() * maximum + minimum
    }
    buildStringBlock(properties: any = {}, allowedValues: string[] = []): any {
        if (allowedValues.length > 0) {
            return getRandomAllowedValue(allowedValues)
        }

        return uuid.v4()
    }

    buildNumberBlock(
        properties: any = {},
        allowedValues: string[] = [],
    ): number {
        if (allowedValues.length > 0) {
            return getRandomAllowedValue(allowedValues)
        }

        const { maximum = 100, minimum = 0 } = properties
        return Math.random() * maximum + minimum
    }
    buildBooleanBlock(
        properties: any = {},
        allowedValues: boolean[] = [],
    ): boolean {
        if (allowedValues.length > 0) {
            return getRandomAllowedValue(allowedValues)
        }

        return Math.random() > 0.5 ? true : false
    }

    buildArrayBlock(items: any = {}): any {
        const { type } = items

        if (items.constructor.name === 'Array') {
            return items.map((item: any) => this.buildMock(item))
        }
        return [this.buildMock({ type } as any)]
    }
}
function getRandomAllowedValue(allowedValues: any[] = []) {
    return allowedValues[Math.floor(Math.random() * allowedValues.length)]
}

export default MockBuilder
