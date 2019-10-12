/* eslint-disable no-unused-vars */

import uuid from 'uuid'

import { blockTypes } from './constants'

export default function buildMock(root: any): any {
    const { type, properties, items, enum: allowedValues } = root

    switch (type) {
        case blockTypes.OBJECT:
            return buildObjectBlock(properties)
        case blockTypes.INTEGER:
            return buildIntegerBlock(properties, allowedValues)
        case blockTypes.STRING:
            return buildStringBlock(properties, allowedValues)
        case blockTypes.NUMBER:
            return buildNumberBlock(properties, allowedValues)
        case blockTypes.BOOLEAN:
            return buildBooleanBlock(properties, allowedValues)
        case blockTypes.ARRAY:
            return buildArrayBlock(items)
        default:
            return null
    }
}

function buildObjectBlock(properties: any): any {
    return Object.entries(properties).reduce((block: any, entry: any) => {
        const [propertyName, propertySpecs] = entry
        block[propertyName] = buildMock(propertySpecs)
        return block
    }, {})
}

function buildIntegerBlock(
    properties: any = {},
    allowedValues: number[] = [],
): number {
    if (allowedValues.length > 0) {
        return getRandomAllowedValue(allowedValues)
    }

    const { maximum = 100, minimum = 0 } = properties
    return Math.floor(Math.random() * Math.floor(maximum)) + minimum
}
function buildStringBlock(
    properties: any = {},
    allowedValues: string[] = [],
): any {
    if (allowedValues.length > 0) {
        return getRandomAllowedValue(allowedValues)
    }

    return uuid.v4()
}

function buildNumberBlock(
    properties: any = {},
    allowedValues: string[] = [],
): number {
    if (allowedValues.length > 0) {
        return getRandomAllowedValue(allowedValues)
    }

    const { maximum = 100, minimum = 0 } = properties
    return Math.random() * maximum + minimum
}
function buildBooleanBlock(
    properties: any = {},
    allowedValues: boolean[] = [],
): boolean {
    if (allowedValues.length > 0) {
        return getRandomAllowedValue(allowedValues)
    }

    return Math.random() > 0.5 ? true : false
}

function buildArrayBlock(items: any = {}): any {
    const { type } = items
    return [buildMock({ type } as any)]
}

function getRandomAllowedValue(allowedValues: any[] = []) {
    return allowedValues[Math.floor(Math.random() * allowedValues.length)]
}
