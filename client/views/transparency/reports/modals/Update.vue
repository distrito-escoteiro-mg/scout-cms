<template lang="pug">
  modal(:visible="visible" @close="close")
    div.box
      h4.title Atualizar Dados
      form(v-on:submit.prevent="updateReport()" v-if="data && data.report")
        label.label Tipo
          select(id="active")
            option Despesa
            option Receita
        label.label Descrição
        p.control
          input.input(type="text" placeholder="Reembolso" v-model="newReport.short_description")
        label.label Valor
        p.control
          input.input(type="number" placeholder="15,75" v-model="newReport.value")
        label.label Data
        p.control
          input.input(type="date" placeholder="30/11/2017" v-model="newReport.date")
        div.control.is-grouped.submit-group
          p.control
            button.button.is-success(type="submit") Salvar
          p.control
            button.button.is-danger(@click="close()") Cancelar
</template>

<script>
  import { Modal } from 'vue-bulma-modal'
  import repService from '../../../../services/transparency/reports'

  export default {
    components: {
      Modal
    },

    props: {
      visible: Boolean,
      data: Object
    },
    data () {
      return {
        customErrors: {
          email: []
        }
      }
    },
    methods: {
      close () {
        this.$emit('close', false)
      },
      updateReport () {
        const formattedData = {
          type: this.data.report.type,
          short_description: this.data.report.short_description,
          value: this.data.report.value,
          date: this.data.report.date
        }
        repService.updateReport(this.data.report._id, formattedData)
        .then((response) => {
          const reference = {
            index: this.data.index,
            report: response.body
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
