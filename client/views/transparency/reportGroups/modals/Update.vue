<template lang="pug">
  modal(:visible="visible" @close="close")
    div.box
      h4.title Atualizar Dados
      form(v-on:submit.prevent="updateReportGroup()" v-if="data && data.reportGroup")
        label.label Nome
        p.control
          input.input(type="text" placeholder="Distrito 2017" v-model="data.reportGroup.name")
        label.label Estado
          select(v-model="data.reportGroup.active")
            option(value='true') Ativo
            option(value='false') Inativo
        div.control.is-grouped.submit-group
          p.control
            button.button.is-success(type="submit") Salvar
          p.control
            button.button.is-danger(@click="close()") Cancelar
</template>

<script>
  import repGrpService from '../../../../services/transparency/reportGroups'
  import { Modal } from 'vue-bulma-modal'

  export default {
    components: {
      Modal
    },

    props: {
      visible: Boolean,
      data: Object
    },
    methods: {
      close () {
        this.$emit('close', false)
      },
      updateReportGroup () {
        console.log(this.data.reportGroup)
        const formattedData = {
          name: this.data.reportGroup.name,
          active: this.data.reportGroup.active
        }
        repGrpService.updateReportGroup(this.data.reportGroup._id, formattedData)
        .then((response) => {
          const reference = {
            index: this.data.index,
            reportGroup: response.body
          }
          this.$emit('close', true)
          this.$emit('confirm', reference)
        }, response => {
          if (response.status === 409) {
            let message = 'Este nome já está sendo utilizado!'
            this.customErrors.email.push(message)
          }
        })
      }
    }
  }
</script>
<style lang="sass" scoped>
  h4
    border-bottom: 1px solid rgba(0,0,0,0.4)
  h5
    padding-top: 2rem
    padding-bottom: 2rem
  .submit-group
    padding-top: 1rem
</style>
