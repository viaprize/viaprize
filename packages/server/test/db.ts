import { DB, Pact } from '../src/index'
import assert from 'assert'

describe('database', () => {
  let db: DB

  beforeEach(async () => {
    db = new DB(':memory:')
    await db.init()
  })

  afterEach(async () => {
    await db.close()
  })

  it('should put and get pact', async () => {
    const pact = {
      name: 'test-name',
      terms: 'these are my terms',
      address: '0xBaF6dC2E647aeb6F510f9e318856A1BCd66C5e19',
      transactionHash: '0x36d15d2a1b3b5880c5724045311cff3ada0b7f9eb2e347367f1ff0b50f6ee992',
      blockHash: '0x957afdfba92a2ddd16c43b89677c8e4efae0c3ab563c3331d2c63944b8016ed7',
    }

    await db.setPact(pact)

    const result = await db.getPact(pact.address)
    assert.deepEqual(result, pact)
  })

  it('should get all pacts', async () => {
    const pacts: Pact[] = [
      {
        name: 'test-name',
        terms: 'these are my terms',
        address: '0xBaF6dC2E647aeb6F510f9e318856A1BCd66C5e19',
        transactionHash: '0x36d15d2a1b3b5880c5724045311cff3ada0b7f9eb2e347367f1ff0b50f6ee992',
        blockHash: '0x957afdfba92a2ddd16c43b89677c8e4efae0c3ab563c3331d2c63944b8016ed7',
      },
      {
        name: 'test-name-2',
        terms: 'these are my terms',
        address: '0xBaF6dC2E647aeb6F510f9e318856A1BCd66C5e12',
        transactionHash: '0x36d15d2a1b3b5880c5724045311cff3ada0b7f9eb2e347367f1ff0b50f6ee991',
        blockHash: '0x957afdfba92a2ddd16c43b89677c8e4efae0c3ab563c3331d2c63944b8016ed7',
      },
    ]

    for (const pact of pacts) {
      await db.setPact(pact)
    }

    const results = await db.getPacts()
    assert.deepEqual(results, pacts)
  })
})
