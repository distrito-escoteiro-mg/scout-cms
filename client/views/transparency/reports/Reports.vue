<template lang="pug">
  div
    div.tile.is-ancestor
      div.tile.is-parent
        article.tile.is-child.box
          h4.title Lançamentos Cadastrados
          div.table-responsive
            confirm-modal(:visible="showConfirmDeleteModal" @close="closeConfirmDeleteModal" v-bind:data="confirmDeleteData" v-on:confirm="deleteReport")
            update-report-modal(:visible="showUpdateReportModal" @close="closeUpdateReportModal" v-bind:data="updateReportData" v-on:confirm="reportUpdated")
            table.table.is-narrow
              thead
                tr
                  th Tipo
                  th Descrição
                  th Valor
                  th Data
                  th
                  th
              tbody
                tr(v-for="(report, index) in reports")
                  td {{report.type}}
                  td {{report.short_description}}
                  td {{report.value}}
                  td {{report.date}}
                  td.is-icon
                    a(@click="openUpdateReportModal(report, index)")
                      i.fa.fa-pencil
                  td.is-icon
                    a(@click="openConfirmDeleteModal(report, index)")
                      i.fa.fa-trash
    div.tile.is-ancestor
      div.tile.is-parent
        article.tile.is-child.box
          h4.title
            | Cadastrar Lançamento
            span.icon.is-pulled-right(@click="toggleCreateBox()")
              i.fa(v-bind:class="{'fa-angle-down': !showCreateBox, 'fa-angle-up': showCreateBox}")
          transition(name="fade")
            form(v-on:submit.prevent="createReport()" v-show="showCreateBox")
              label.label Tipo
              p.control
                input.input(type="text" placeholder="Despesa" v-model="newReport.type")
              label.label Descrição
              p.control
                input.input(type="text" placeholder="Reembolso" v-model="newReport.short_description")
              label.label Valor
              p.control
                input.input(type="number" placeholder="15,75" v-model="newReport.value")
              label.label Data
              p.control
                input.input(type="date" placeholder="30/11/2017" v-model="newReport.date")
              p.control.submit-button
                button.button.is-medium.is-primary(type="submit" v-bind:disabled="errors.any()") Cadastrar
</template>
<script>
  import Vue from 'vue'
  import repService from '../../../services/transparency/reports'
  import Notification from 'vue-bulma-notification'
  import ConfirmModal from '../../../components/modals/Confirm'
  import UpdateReportModal from './modals/Update'

  const NotificationComponent = Vue.extend(Notification)
  const openNotification = (propsData = {
    title: '',
    message: '',
    type: '',
    direction: '',
    duration: 4500,
    container: '.notifications'
  }) => {
    return new NotificationComponent({
      el: document.createElement('div'),
      propsData
    })
  }

  export default {
    components: {
      ConfirmModal,
      UpdateReportModal
    },
    data () {
      return {
        reports: null,
        showCreateBox: false,
        showConfirmDeleteModal: false,
        confirmDeleteData: {},
        showUpdateReportModal: false,
        updateReportData: {},

        customErrors: {
          email: []
        },

        newReport: {
          type: '',
          short_description: '',
          value: '',
          date: ''
        }
      }
    },
    methods: {
      openUpdateReportModal (report, index) {
        this.updateReportData = {
          report,
          index
        }
        this.showUpdateReportModal = true
      },
      closeUpdateReportModal () {
        this.showUpdateReportModal = false
      },
      reportUpdated (reference) {
        openNotification({
          message: 'Dados do lançamento atualizado com sucesso!',
          type: 'success',
          duration: 3000
        })
        this.reports[reference.index] = reference.report
      },
      openConfirmDeleteModal (report, index) {
        this.confirmDeleteData = {
          reference: {
            id: report._id,
            index: index
          },
          title: 'Confirmar Operação',
          content: `Você tem certeza que deseja excluir o lançamento ${report.short_description} ? Essa operação não pode ser cancelada.`
        }
        this.showConfirmDeleteModal = true
      },
      closeConfirmDeleteModal () {
        this.showConfirmDeleteModal = false
      },
      deleteReport (reference) {
        repService.deleteReport(reference.id)
        .then((response) => {
          openNotification({
            message: 'Lançamento excluído com sucesso!',
            type: 'success',
            duration: 3000
          })
          this.reports.splice(reference.index, 1)
        }, (response) => {
          openNotification({
            message: 'Erro ao excluir o lançamento!',
            type: 'danger',
            duration: 3000
          })
        })
      },
      toggleCreateBox () {
        this.showCreateBox = !this.showCreateBox
      },
      createReport () {
        this.$validator.validateAll().then(success => {
          if (!success) return
          repService.createReport(this.newReport)
          .then((response) => {
            openNotification({
              message: 'Lançamento criado com sucesso!',
              type: 'success',
              duration: 3000
            })
            this.reports.push(response.body)

            this.clearForm().then(() => {
              this.errors.clear()
            })
          }, response => {
            let message = 'Erro ao criar o lançamento!'

            if (response.status === 409) {
              message = 'Este nome já está sendo utilizado!'
              this.customErrors.email.push(message)
            }

            openNotification({
              message: message,
              type: 'danger',
              duration: 3000
            })
          })
        })
      },
      clearForm () {
        return new Promise((resolve, reject) => {
          this.newReport = {
            type: '',
            short_description: '',
            value: '',
            date: ''
          }
          resolve()
        })
      }
    },
    beforeRouteEnter (to, from, next) {
      repService.getReports().then((response) => {
        next(vm => {
          vm.reports = response.body
        })
      }, (response) => {
        next(false)
      })
    }
  }
</script>
<style lang="sass" scoped>
  .table-responsive
    display: block
    width: 100%
    min-height: .01%
    overflow-x: auto
  .submit-button
    padding-top: 2rem
    text-align: center
</style>
