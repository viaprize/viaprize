import {
  BaseServiceV2,
  StandardOptions,
  ExpressRouter,
  Gauge,
  validators,
  waitForProvider,
} from '@eth-optimism/common-ts'
import { ethers } from 'ethers'
import { getChainId } from '@eth-optimism/core-utils'
import { Provider } from '@ethersproject/abstract-provider'
import sqlite3 from 'sqlite3'
import { statements } from './sql'
import os from 'os'
import path from 'path'
import fs from 'fs'
import { Request, Response } from 'express';
// import PactAbi from '../abi/Pact.json';

import { version } from '../package.json'

// TODO: temp debugging
sqlite3.verbose()

type Options = {
  rpcProvider: Provider
  pactFactoryAddress: string
  dbPath: string
}

type Metrics = {
  blockTipNumber: Gauge
}

type State = {
  blockNumber: number
  db: DB
}

export type Pact = {
  name: string
  terms: string
  address: string
  transactionHash: string
  blockHash: string
}

// In memory database, not real
export class DB {
  private db: sqlite3.Database

  constructor(path: string) {
    if (path === '') {
      path = ':memory:'
    }
    this.db = new sqlite3.Database(path)
  }

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(statements.createTable, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  async setPact(pact: Pact): Promise<void> {
    return new Promise((resolve, reject) => {
      // get transaction receipt and find the related events


      this.db.run(statements.insertPact, {
        $name: pact.name,
        $terms: pact.terms,
        $address: pact.address,
        $transactionHash: pact.transactionHash,
        $blockHash: pact.blockHash
      }, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  async getPact(address: string): Promise<Pact> {
    return new Promise((resolve, reject) => {
      this.db.get(statements.getPact, {
        $address: address
      }, (err, row) => {
        if (err) {
          reject(err)
        } else {
          const result = row as Pact
          if (!result) {
            resolve(null)
          } else {
            const pact = {
              name: result.name,
              terms: result.terms,
              address: result.address,
              transactionHash: result.transactionHash,
              blockHash: result.blockHash
            }
            resolve(pact)
          }
        }
      })
    })
  }

  async getPacts(): Promise<Pact[]> {
    return new Promise((resolve, reject) => {
      this.db.all(statements.getPacts, (err, rows) => {
        if (err) {
          reject(err)
        } else {
          const pacts: Pact[] = []
          for (const row of (rows as Pact[])) {
            pacts.push({
              name: row.name,
              terms: row.terms,
              address: row.address,
              transactionHash: row.transactionHash,
              blockHash: row.blockHash
            })
          }
          resolve(pacts)
        }
      })
    })
  }

  async close(): Promise<void> {
    this.db.close()
  }
}

export class Server extends BaseServiceV2<Options, Metrics, State> {
  constructor(options?: Partial<Options & StandardOptions>) {
    super({
      version,
      name: 'pact-server',
      loop: true,
      options: {
        loopIntervalMs: 2000,
        ...options,
      },
      optionsSpec: {
        rpcProvider: {
          validator: validators.provider,
          desc: 'HTTP URL for Ethereum RPC backend',
        },
        pactFactoryAddress: {
          validator: validators.str,
          desc: 'Address of the PactFactory contract',
        },
        dbPath: {
          validator: validators.str,
          desc: 'Path to the database',
          default: path.join(os.homedir(), '.pact-indexer', 'db'),
        },
      },
      metricsSpec: {
        blockTipNumber: {
          type: Gauge,
          desc: 'Highest batch indices (checked and known)',
          labels: ['type'],
        },
      },
    })
  }

  async init(): Promise<void> {
    // Connect to L1.
    await waitForProvider(this.options.rpcProvider, {
      logger: this.logger,
      name: 'rpc-provider',
    })

    const dirname = path.dirname(this.options.dbPath)
    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true })
    }

    this.state.db = new DB(this.options.dbPath)
    await this.state.db.init()

    const chainId = await getChainId(this.options.rpcProvider)
    this.logger.info(`Pact factory address: ${this.options.pactFactoryAddress}`)
    this.logger.info(`Connected to chain: ${chainId}`)
  }

  // all routes have /api prefix automatically
  async routes(router: ExpressRouter): Promise<void> {
    router.use((_, res: Response, next) => {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Headers', '*')
      res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
      next()
    })

    router.get('/status', async (_, res: Response) => {
      return res.status(200).json({
        ok: true
      })
    })

    // Frontend sends transaction to chain, waits for receipt,
    // then posts to this endpoint so that the pact is saved
    // in the database. The frontend will have all of this information
    router.post('/pact', async (req: Request, res: Response) => {
      // TODO: validate each field on the body
      const pact: Pact = {
        name: req.body.name,
        terms: req.body.terms,
        address: req.body.address,
        transactionHash: req.body.transactionHash,
        blockHash: req.body.blockHash
      }

      // TODO: call out to the chain to ensure that this pact exists
      // the front end should only pass the transactionHash that
      // created the pact, and then the backend can get the transaction
      // receipt by hash and decode the `Create(address)` event to ensure
      // that the pact exists
      // The backend can also wait for the receipt so that the frontend doesn't
      // need to wait until the pact is created before it can be saved in the db

      await this.state.db.setPact(pact)
      res.status(200).json()
    })

    router.get('/pact', async (req: Request, res: Response) => {
      const address = req.query.address as string
      const pact = await this.state.db.getPact(address)
      if (!pact) {
        res.status(404).json()
        return
      }
      res.status(200).json(pact)
    })

    router.get('/pacts', async (_, res: Response) => {
      const pacts = await this.state.db.getPacts()
      res.status(200).json(pacts)
    })
  }

  // This function is called on an interval. We should add logic for indexing pacts
  // that are created outside of the UI. The POST /api/pact endpoint should "connect"
  // the metadata to the pact
  async main(): Promise<void> {
    // look up in local db at latest synced height
    // look at remote chain to see if more blocks have been made
    // fetch all pact creation events in that block range
    // save all pacts to local db
    // when POST /api/pact, connect metadata in db to the generically indexed pact
    // const blockNumber = await this.options.rpcProvider.getBlockNumber();
  }
}

if (require.main === module) {
  const server = new Server()
  server.run()
}
