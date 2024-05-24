'use strict'

class RolesActionsResources {
  constructor() {
    this.rules = []
  }

  addRule(rule) {
    this.rules.push(rule)
  }

  can(principal, action, resource) {
    for (let rule of this.rules) {
      for (let principalResource of principal.resources) {
        if (rule.resources.includes(principalResource.name) &&
            rule.role === principal.role
          && rule.actions.includes(action)
          && principalResource.id === resource.id) {
          return true
        }
      }
    }
    return false
  }
}

module.exports = RolesActionsResources
