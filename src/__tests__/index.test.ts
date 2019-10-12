import Ajv from 'ajv'

import { buildMock } from '../'
import { simpleBlocks, aggregatedBlocks } from '../constants'

describe('test', () => {
    const validator = new Ajv()
    describe('Single block schemas', () => {
        it.each(Object.values(simpleBlocks))('Single %s key', type => {
            const schema: any = {
                type,
            }

            const validate = validator.compile(schema)
            const generatedMock = buildMock(schema)
            validate(generatedMock)

            expect(validate.errors).toBeNull()
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

                    const validate = validator.compile(schema)
                    const generatedMock = buildMock(schema)
                    validate(generatedMock)

                    expect(validate.errors).toBeNull()
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

                    const validate = validator.compile(schema)
                    const generatedMock = buildMock(schema)
                    validate(generatedMock)
                    expect(validate.errors).toBeNull()
                },
            )
        })
    })
})
