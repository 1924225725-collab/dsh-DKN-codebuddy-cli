import test from 'node:test'
import assert from 'node:assert/strict'
import { assertCliInputBudget } from '../lib/cn/request.js'
import { makeImageStreamInput } from '../lib/intl/request.js'
import * as cn from '../lib/cn/accounts.js'
import * as intl from '../lib/intl/accounts.js'

test('regional input budgets and legacy account identities remain distinct in the same package',()=>{
 const synthetic='x'.repeat(21*1024*1024)
 assert.throws(()=>assertCliInputBudget(synthetic),e=>e.code==='REQUEST_TOO_LARGE'&&e.requestDiagnostics.requestLimitBytes===20*1024*1024)
 assert.ok(makeImageStreamInput('',[{type:'text',text:synthetic}]).bytes>21*1024*1024)
 assert.throws(()=>makeImageStreamInput('',[{type:'text',text:'x'.repeat(24*1024*1024)}]),e=>e.code==='REQUEST_TOO_LARGE'&&e.requestDiagnostics.requestLimitBytes===24*1024*1024)
 const id='11111111-2222-4333-8444-555555555555'
 assert.equal(cn.accountModelId(id,'same-model'),'dshcb-account:'+id+':same-model')
 assert.equal(intl.accountModelId(id,'same-model'),'dshcbi-account:'+id+':same-model')
 assert.equal(cn.parseAccountModel(intl.accountModelId(id,'same-model')),null)
 assert.equal(intl.parseAccountModel(cn.accountModelId(id,'same-model')),null)
 assert.notEqual(cn.accountDirectory(),intl.accountDirectory())
})
