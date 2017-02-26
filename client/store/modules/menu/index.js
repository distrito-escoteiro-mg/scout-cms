import * as types from '../../mutation-types'
// import lazyLoading from './lazyLoading'
import users from './users'
import news from './news'
import transparency from './transparency'

// show: meta.label -> name
// name: component name
// meta.label: display label

const state = {
  items: [
    news,
    users,
    transparency
  ]
}

const mutations = {
  [types.EXPAND_MENU] (state, menuItem) {
    if (menuItem.index > -1) {
      if (state.items[menuItem.index] && state.items[menuItem.index].meta) {
        state.items[menuItem.index].meta.expanded = menuItem.expanded
      }
    } else if (menuItem.item && 'expanded' in menuItem.item.meta) {
      menuItem.item.meta.expanded = menuItem.expanded
    }
  }
}

export default {
  state,
  mutations
}
