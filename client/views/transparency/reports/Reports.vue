<template lang="pug">
  div
    div.tile.is-ancestor
      div.tile.is-parent
        article.tile.is-child.box
          h4.title Lançamentos Cadastrados
          div.table-responsive
            image-modal(:visible="showImageModal" v-bind:data="imageModalData" @close="closeImageModal" v-on:error="imageUpdateNotification(false)" v-on:success="imageUpdateNotification(true)" v-on:confirm="imageUpdated")
            confirm-modal(:visible="showConfirmDeleteModal" @close="closeConfirmDeleteModal" v-bind:data="confirmDeleteData" v-on:confirm="deleteReport")
            update-report-modal(:visible="showUpdateReportModal" @close="closeUpdateReportModal" v-bind:data="updateReportData" v-on:confirm="reportUpdated")
            table.table.is-narrow
              thead
                tr
                  th Origem
                  th Tipo
                  th Descrição
                  th Data
                  th Valor
                  th
                  th
                  th
              tbody
                tr(v-for="(report, index) in reports")
                  td {{report.report_group.name}}
                  td {{report.type}}
                  td {{report.short_description}}
                  td {{report.date}}
                  td {{report.value}}
                  td.is-icon
                    a(@click="displayImageModal(report, index)")
                      i.fa.fa-image
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
              label.label Origem
                select(v-model="newReport.report_group" v-for="(repGroup, index) in reportGroups")
                  option {{repGroup.name}}
              label.label Tipo
              select(v-model="newReport.type")
                option Despesa
                option Receita
              label.label Descrição Curta
              p.control
                input.input(type="text" placeholder="Reembolso"
                v-model="newReport.short_description")
              label.label Descrição Completa (Opcional)
              p.control
                input.input(type="text" placeholder="Reembolso para o chefe josé da compra de frutas para a atividade" v-model="newReport.complete_description")
              label.label Data
              p.control
                input.input(type="date" placeholder="30/11/2017"
                v-model="newReport.date")
              label.label Fornecedor
              p.control
                input.input(type="text" placeholder="Supermercados EPA"
                v-model="newReport.provider")
              label.label Valor
              p.control
                input.input(type="number" placeholder="15,75"
                v-model.number="newReport.value" step="0.01")
              p.control.submit-button
                button.button.is-medium.is-primary(type="submit"
                v-bind:disabled="errors.any()") Cadastrar
</template>
<script>
  import Vue from 'vue'
  import repService from '../../../services/transparency/reports'
  import repGrpService from '../../../services/transparency/reportGroups'
  import Notification from 'vue-bulma-notification'
  import ConfirmModal from '../../../components/modals/Confirm'
  import UpdateReportModal from './modals/Update'
  import ImageModal from '../../../components/modals/Image'

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
      ImageModal,
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
        showImageModal: false,
        imageModalData: {},
        customErrors: {
          email: []
        },
        reportGroups: null,
        newReport: {
          type: '',
          short_description: '',
          date: '',
          report_group: '',
          complete_description: '',
          provider: '',
          last_updated_by: '',
          value: '',
          invoice_image: ''
        }
      }
    },
    methods: {
      displayImageModal (report, index) {
        this.imageModalData = {
          index: index,
          id: report._id,
          image: report.invoice_image
        }
        this.showImageModal = true
      },
      closeImageModal () {
        this.showImageModal = false
      },
      imageUpdateNotification (success) {
        const message = (success) ? 'Imagem atualizada com sucesso!' : 'Erro ao atualizar a imagem!'
        const type = (success) ? 'success' : 'danger'
        openNotification({
          message: message,
          type: type,
          duration: 3000
        })
      },
      imageUpdated (reference) {
        this.reports[reference.index].report = reference.invoice_image
      },
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
//
          repGrpService.getReportGroups().then((response) => {
            next(vm => {
              vm.reportGroups = response.body
            })
          }, (response) => {
            next(false)
          })
//
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
