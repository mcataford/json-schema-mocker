import uuid from 'uuid'

import { blockTypes } from './constants'

export function buildMock(root: any): any {
    const { type, properties, items } = root

    switch (type) {
        case blockTypes.OBJECT:
            return buildObjectBlock(properties)
        case blockTypes.INTEGER:
            return buildIntegerBlock(properties)
        case blockTypes.STRING:
            return buildStringBlock(properties)
        case blockTypes.NUMBER:
            return buildNumberBlock(properties)
        case blockTypes.BOOLEAN:
            return buildBooleanBlock(properties)
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

function buildIntegerBlock(properties: any = {}) {
    const { maximum = 100, minimum = 0 } = properties
    return Math.floor(Math.random() * Math.floor(maximum)) + minimum
}

function buildStringBlock(properties: any) {
    return uuid.v4()
}

function buildNumberBlock(properties: any = {}) {
    const { maximum = 100, minimum = 0 } = properties
    return Math.random() * maximum + minimum
}

function buildBooleanBlock(properties: any = {}) {
    return Math.random() > 0.5 ? true : false
}

function buildArrayBlock(items: any = {}): any {
    const { type } = items

    return [buildMock({ type } as any)]
}
