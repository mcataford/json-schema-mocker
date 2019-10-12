import Ajv from 'ajv'

import MockGenerator from '../MockGenerator'
import { simpleBlocks, aggregatedBlocks } from '../constants'

function generateAndValidateMock(
    schema: any,
    validator: any,
    generator: MockGenerator,
): void {
    const validate = validator.compile(schema)
    const generatedMock = generator.buildMock(schema)
    validate(generatedMock)
    expect(validate.errors).toBeNull()
}

describe('MockGenerator', () => {
    const validator = new Ajv()
    let generator: any = null
    beforeEach(() => {
        generator = new MockGenerator()
    })
    describe('Single block schemas', () => {
        it.each(Object.values(simpleBlocks))('Single %s key', type => {
            const schema: any = {
                type,
            }
            generateAndValidateMock(schema, validator, generator)
        })

        it.each`
            type                    | enum
            ${simpleBlocks.INTEGER} | ${[1, 2, 3]}
            ${simpleBlocks.STRING}  | ${['1', '2', '3']}
            ${simpleBlocks.BOOLEAN} | ${[true, false]}
            ${simpleBlocks.NUMBER}  | ${[1.1, 2.2, 3.3]}
        `('Single $type with enum as $enum', (parameters: any) => {
            const schema: any = {
                type: parameters.type,
                enum: parameters.enum,
            }
            generateAndValidateMock(schema, validator, generator)
        })
    })

    describe('Single nested block schemas', () => {
        describe(`${aggregatedBlocks.OBJECT} blocks`, () => {
            it.each(Object.values(simpleBlocks))(
                `Single %s pair in an ${aggregatedBlocks.OBJECT}`,
                type => {
                    const schema: any = {
                        type: aggregatedBlocks.OBJECT,
                        properties: {
                            'some-property': {
                                type,
                            },
                        },
                    }
                    generateAndValidateMock(schema, validator, generator)
                },
            )
        })

        describe(`${aggregatedBlocks.ARRAY} blocks`, () => {
            it.each(Object.values(simpleBlocks))(
                `Single %s in a ${aggregatedBlocks.ARRAY}`,
                type => {
                    const schema: any = {
                        type: aggregatedBlocks.ARRAY,
                        items: {
                            type,
                        },
                    }

                    generateAndValidateMock(schema, validator, generator)
                },
            )
        })
    })

    describe('3+ depth scenarios', () => {
        it.each(Object.values(simpleBlocks))(
            'Nested objects with an inner %s',
            type => {
                const schema: any = {
                    type: aggregatedBlocks.OBJECT,
                    properties: {
                        innerObject: {
                            type: aggregatedBlocks.OBJECT,
                            properties: {
                                innerSimpleBlock: {
                                    type,
                                },
                            },
                        },
                    },
                }

                generateAndValidateMock(schema, validator, generator)
            },
        )
    })
})
