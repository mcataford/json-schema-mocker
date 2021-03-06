/* eslint-disable no-unused-vars */

import crypto from 'crypto'

import { blockTypes } from './constants'
import { SchemaBlock } from './typedefs'

class MockBuilder {
    constructor() {}

    buildMock(root: SchemaBlock): any {
        const { type } = root

        switch (type) {
            case blockTypes.OBJECT:
                return this.buildObjectBlock(root)
            case blockTypes.INTEGER:
                return this.buildNumericalBlock(root)
            case blockTypes.STRING:
                return this.buildStringBlock(root)
            case blockTypes.NUMBER:
                return this.buildNumericalBlock(root)
            case blockTypes.BOOLEAN:
                return this.buildBooleanBlock(root)
            case blockTypes.ARRAY:
                return this.buildArrayBlock(root)
            default:
                return null
        }
    }

    buildObjectBlock(root: SchemaBlock): any {
        const { properties = {} } = root
        return Object.entries(properties).reduce((block: any, entry: any) => {
            const [propertyName, propertySpecs] = entry
            block[propertyName] = this.buildMock(propertySpecs)
            return block
        }, {})
    }

    buildNumericalBlock(root: SchemaBlock): number {
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
    buildStringBlock(root: SchemaBlock): string {
        const { properties, enum: allowedValues, minLength, maxLength } = root

        const minimumLength = minLength ? minLength : 0
        const maximumLength = maxLength ? maxLength : 100
        const chosenLength =
            Math.floor(Math.random() * maximumLength) + minimumLength
        if (allowedValues && allowedValues.length > 0) {
            return getRandomAllowedValue(allowedValues)
        }

        return crypto
            .randomBytes(chosenLength)
            .toString('hex')
            .substring(0, chosenLength)
    }

    buildBooleanBlock(root: SchemaBlock): boolean {
        const { enum: allowedValues } = root
        if (allowedValues && allowedValues.length > 0) {
            return getRandomAllowedValue(allowedValues)
        }

        return Math.random() > 0.5 ? true : false
    }

    buildArrayBlock(root: SchemaBlock): any[] {
        const { items, minItems, maxItems } = root
        const { type } = items

        const maximumLength = maxItems ? maxItems : 100
        const minimumLength = minItems ? minItems : 0
        const chosenLength =
            Math.floor(Math.random() * (maximumLength - minimumLength + 1)) +
            minimumLength

        if (items.constructor.name === 'Array') {
            return items.map((item: any) => this.buildMock(item))
        }
        return Array(chosenLength)
            .fill(0)
            .map(_ => this.buildMock({ type } as any))
    }
}
function getRandomAllowedValue(allowedValues: any[] = []) {
    return allowedValues[Math.floor(Math.random() * allowedValues.length)]
}

export default MockBuilder
