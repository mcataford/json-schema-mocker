import MockGenerator from '../'

describe('Public API', () => {
    it('can instantiate a mock generator', () => {
        const generator = new MockGenerator()

        expect(generator).not.toBeNull()
    })
})
