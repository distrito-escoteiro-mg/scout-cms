<template lang="pug">
  div
    div.tile.is-ancestor
      div.tile.is-parent
        article.tile.is-child.box
          h4.title Agrupar Lançamentos
          div.table-responsive
            confirm-modal(:visible="showConfirmDeleteModal" @close="closeConfirmDeleteModal" v-bind:data="confirmDeleteData" v-on:confirm="deleteReportGroup")
            update-report-group-modal(:visible="showUpdateReportGroup" @close="closeUpdateReportGroup" v-bind:data="updateReportGroupData" v-on:confirm="reportGroupUpdated")
            table.table.is-narrow
              thead
                tr
                  th Nome
                  th Ativo
                  th
                  th
              tbody
                tr(v-for="(reportGroup, index) in reportGroups")
                  td {{reportGroup.name}}
                  td {{reportGroup.active}}
                  td.is-icon
                    a(@click="openUpdateReportGroupModal(reportGroup, index)")
                      i.fa.fa-pencil
                  td.is-icon
                    a(@click="openConfirmDeleteModal(reportGroup, index)")
                      i.fa.fa-trash
    div.tile.is-ancestor
      div.tile.is-parent
        article.tile.is-child.box
          h4.title
            | Cadastrar Agrupamento
            span.icon.is-pulled-right(@click="toggleCreateBox()")
              i.fa(v-bind:class="{'fa-angle-down': !showCreateBox, 'fa-angle-up': showCreateBox}")
          transition(name="fade")
            form(v-on:submit.prevent="createReportGroup()" v-show="showCreateBox")
              label.label Nome
              p.control
                input.input(type="text" placeholder="Distrito 2017" v-model="newReportGroup.name")
              label.label Estado
                select(id="active")
                  option Ativo
                  option Inativo
              p.control.submit-button
                button.button.is-medium.is-primary(type="submit" v-bind:disabled="errors.any()") Cadastrar
</template>
<script>
  import Vue from 'vue'
  import repService from '../../../services/transparency/reportGroups'
  import Notification from 'vue-bulma-notification'
  import ConfirmModal from '../../../components/modals/Confirm'
  import UpdateReportGroupModal from './modals/Update'

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
      UpdateReportGroupModal
    },
    data () {
      return {
        reportGroups: null,
        showCreateBox: false,
        showConfirmDeleteModal: false,
        confirmDeleteData: {},
        showUpdateReportGroup: false,
        updateReportGroupData: {},

        newReportGroup: {
          name: '',
          active: true
        }
      }
    },
    methods: {
      openUpdateReportGroupModal (reportGroup, index) {
        this.updateReportGroupData = {
          reportGroup,
          index
        }
        this.showUpdateReportGroup = true
      },
      closeUpdateReportGroup () {
        this.showUpdateReportGroup = false
      },
      reportGroupUpdated (reference) {
        openNotification({
          message: 'Dados do Agrupamento atualizado com sucesso!',
          type: 'success',
          duration: 3000
        })
        this.reportGroups[reference.index] = reference.reportGroup
      },
      openConfirmDeleteModal (reportGroup, index) {
        this.confirmDeleteData = {
          reference: {
            id: reportGroup._id,
            index: index
          },
          title: 'Confirmar Operação',
          content: `Você tem certeza que deseja excluir o Agrupamento ${reportGroup.name} ? Essa operação não pode ser cancelada.`
        }
        this.showConfirmDeleteModal = true
      },
      closeConfirmDeleteModal () {
        this.showConfirmDeleteModal = false
      },
      deleteReportGroup (reference) {
        repService.deleteReportGroup(reference.id)
        .then((response) => {
          openNotification({
            message: 'Agrupamento excluído com sucesso!',
            type: 'success',
            duration: 3000
          })
          this.reportGroups.splice(reference.index, 1)
        }, (response) => {
          openNotification({
            message: 'Erro ao excluir o Agrupamento!',
            type: 'danger',
            duration: 3000
          })
        })
      },
      toggleCreateBox () {
        this.showCreateBox = !this.showCreateBox
      },
      createReportGroup () {
        this.$validator.validateAll().then(success => {
          if (!success) return
          repService.createReportGroup(this.newReportGroup)
          .then((response) => {
            openNotification({
              message: 'Agrupamento criado com sucesso!',
              type: 'success',
              duration: 3000
            })
            this.reportGroups.push(response.body)

            this.clearForm().then(() => {
              this.errors.clear()
            })
          }, response => {
            let message = 'Erro ao criar o Agrupamento!'

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
          this.newReportGroup = {
            name: '',
            active: true
          }
          resolve()
        })
      }
    },
    beforeRouteEnter (to, from, next) {
      repService.getReportGroups().then((response) => {
        next(vm => {
          vm.reportGroups = response.body
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
