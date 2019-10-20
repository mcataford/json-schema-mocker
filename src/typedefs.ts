export interface SchemaBlock {
    type: string
    properties?: any
    items?: any
    enum?: any[]
    minimum?: number
    maximum?: number
    multipleOf?: number
    minLength?: number
    maxLength?: number
    minItems?: number
    maxItems?: number
}
