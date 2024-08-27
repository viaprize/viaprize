import { assert, expect, test } from 'vitest'
import { Viaprize } from "../viaprize"
test('viaprize init test',()=>{
    const viaprize = new Viaprize({
        config: {
          mode: "development",
          inMemoryDb: false,
          databaseUrl: "postgresql://viaprize-dev_owner:somepassword@localhost:5432/viaprize?sslmode=require",
        }
    })
    expect(viaprize.config.mode).toBe('development')
    expect(viaprize.config.databaseUrl).toBe('postgresql://viaprize-dev_owner:somepassword@localhost:5432/viaprize?sslmode=require')
})

test('viaprize  init fail test',()=>{
    assert.throws(()=>new Viaprize({
        config:{
            mode:'development',
            inMemoryDb:false,
            databaseUrl:''
        }
    }),Error)
})

