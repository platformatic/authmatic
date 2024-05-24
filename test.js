'use strict'

const { test } = require('node:test')
const { strictEqual } = require('node:assert')
const Rar = require('./index.js')

test('basic check', (t) => {
  const policy = new Rar()

  policy.addRule({
    role: 'owner',
    actions: ['read', 'write', 'delete'],
    resources: ['post']
  })

  const principal = {
    role: 'owner',
    resources: [{
      name: 'post',
      id: 27
    }]
  }

  strictEqual(policy.can(principal, 'read', {
    resource: 'post',
    id: 27
  }), true)

  strictEqual(policy.can(principal, 'read', {
    resource: 'post',
    id: 28
  }), false)
})
