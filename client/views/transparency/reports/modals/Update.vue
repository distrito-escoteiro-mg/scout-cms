<template lang="pug">
  modal(:visible="visible" @close="close")
    div.box
      h4.title Atualizar Dados
      form(v-on:submit.prevent="updateReport()" v-if="data && data.report")
        label.label Origem
          select(v-model="data.report.report_group.name" )
        label.label Tipo
        select(v-model="data.report.type")
          option Despesa
          option Receita
        label.label Descrição Curta
        p.control
          input.input(type="text" placeholder="Reembolso"
          v-model="data.report.short_description")
        label.label Descrição Completa (Opcional)
        p.control
          input.input(type="text" placeholder="Reembolso para o chefe josé da compra de frutas para a atividade" v-model="data.report.complete_description")
        label.label Data
        p.control
          input.input(type="date" placeholder="30/11/2017" v-model="data.report.date")
        label.label Fornecedor
        p.control
          input.input(type="text" placeholder="Supermercados EPA"
          v-model="data.report.provider")
        label.label Valor
        p.control
          input.input(type="number" placeholder="15,75"
          v-model.number="data.report.value" step="0.01")
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
          date: this.data.report.date,
          report_group: this.data.report.report_group,
          complete_description: this.data.report.complete_description,
          provider: this.data.report.provider,
          value: this.data.report.value
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
