'use strict'

class RolesActionsResources {
  constructor({ getPrincipalResourceRoles } = {}) {
    this.rules = []
    this.getPrincipalResourceRoles = getPrincipalResourceRoles
  }

  addRule(rule) {
    this.rules.push(rule)
  }

  getPrincipalResourceRoles(principal, resource) {
    throw new Error('getPrincipalResourceRoles not implemented')
  }

  async can({ principal, action, resource }) {
    let resources = principal.resources
    if (!resources) {
      resources = await this.getPrincipalResourceRoles(principal, resource)
    }
    for (let rule of this.rules) {
      for (let principalResource of resources) {
        if (rule.resources.includes(principalResource.name) &&
            rule.role === principalResource.role &&
            rule.actions.includes(action) &&
            principalResource.name === resource.name &&
            principalResource.id === resource.id) {
          return true
        }
      }
    }
    return false
  }
}

module.exports = RolesActionsResources
