export const aggregatedBlocks = {
    OBJECT: 'object',
    ARRAY: 'array',
}

export const simpleBlocks = {
    BOOLEAN: 'boolean',
    NUMBER: 'number',
    NULL: 'null',
    STRING: 'string',
    INTEGER: 'integer',
}

export const blockTypes = {
    ...aggregatedBlocks,
    ...simpleBlocks,
}
