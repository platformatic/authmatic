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

  strictEqual(await policy.can({
    principal,
    action: 'read',
    resource: {
      name: 'post',
      id: 27
    }
  }), true)

  strictEqual(await policy.can({
    principal,
    action: 'read',
    resource: {
      name: 'comment',
      id: 27
    }
  }), false)

  strictEqual(await policy.can({
    principal,
    action: 'read',
    resource: {
      name: 'post',
      id: 28
    }
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

  strictEqual(await policy.can({
    principal,
    action: 'read',
    resource: {
      name: 'post',
      id: 27
    }
  }), true)

  strictEqual(await policy.can({
    principal,
    action: 'read',
    resource: {
      name: 'post',
      id: 28
    }
  }), false)
})

test('remapping case', async (t) => {
  const policy = new Rar()

  function remapResource (toAuth) {
    const { resource } = toAuth
    if (resource.name === 'organizationUser' && resource.id === 42) {
      return {
        action: 'edit',
        resource: {
          name: 'organization',
          id: 27
        }
      }
    }
    return toAuth
  }

  // Owner can delete users that are in its organization

  policy.addRule({
    role: 'owner',
    actions: ['edit'],
    resources: ['organization']
  })

  const principal = {
    resources: [{
      name: 'organization',
      role: 'owner',
      id: 27
    }]
  }

  strictEqual(await policy.can({
    principal,
    ...remapResource({
      action: 'delete',
      resource: {
        name: 'organizationUser',
        id: 42
      }
    })
  }), true)
})
