import lazyLoading from './lazyLoading'

export default {
  name: 'Transparencia',
  path: '/transparency',
  meta: {
    icon: 'fa-money',
    expanded: false
  },
  showChildren: true,
  component: lazyLoading('transparency/Transparency'),
  children: [
    {
      name: 'Lançamentos',
      path: 'reports',
      component: lazyLoading('transparency/reports/Reports')
    },
    {
      name: 'Agrupamento',
      path: 'reportGroups',
      component: lazyLoading('transparency/reportGroups/ReportGroups')
    }
  ]
}
