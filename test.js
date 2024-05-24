'use strict'

const { test } = require('node:test')
const { strictEqual } = require('node:assert')
const Rar = require('./index.js')

test('basic check', async (t) => {
  const policy = new Rar()

  policy.addRule({
    role: 'owner',
    actions: ['read', 'write', 'delete'],
    resources: ['post']
  })

  const principal = {
    resources: [{
      name: 'post',
      role: 'owner',
      id: 27
    }]
  }

  strictEqual(await policy.can(principal, 'read', {
    resource: 'post',
    id: 27
  }), true)

  strictEqual(await policy.can(principal, 'read', {
    resource: 'post',
    id: 28
  }), false)
})

test('async principal resources', async (t) => {
  const policy = new Rar({
    async getPrincipalResourceRoles (principal, resource) {
      return [{
        name: 'post',
        role: 'owner',
        id: 27
      }]
    }
  })

  policy.addRule({
    role: 'owner',
    actions: ['read', 'write', 'delete'],
    resources: ['post']
  })

  const principal = {
    userId: 42
  }

  strictEqual(await policy.can(principal, 'read', {
    resource: 'post',
    id: 27
  }), true)

  strictEqual(await policy.can(principal, 'read', {
    resource: 'post',
    id: 28
  }), false)
})
