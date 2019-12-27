<template>
  <div id="app">
    <Table
      v-model="data"
      :columns="columns"
      table-name="asd"
    />
  </div>
</template>

<script>
import Table from './Table/index'
export default {
  name: 'APP',
  components: {
    Table
  },
  data () {
    return {
      columns: [
        { source: 'id', label: 'ID', inputComponent: 'input' },
        { source: 'name.first', label: 'FirstName', inputComponent: 'datePicker' },
        { source: 'name.last', label: 'SecondName', inputComponent: 'select' },
        { source: 'address', label: 'Адресс', inputComponent: 'input' },
        ...(() => {
          const res = []
          for (let j = 0; j < 20; j++) {
            res[j] = {}
            res[j].source = `${j}`
            res[j].label = `${j}`
            res[j].inputComponent = 'input'
          }
          return res
        })()
      ],
      data: (() => {
        const res = Array(50)
        for (let i = 0; i < 50; i++) {
          const g = (() => {
            const res = {}
            for (let j = 0; j < 50; j++) {
              res[j] = j * i
            }
            return res
          })()
          g.id = i
          g.name = { first: `Ted${i}`, last: 'Right' }
          g.address = 'asd'
          res[i] = g
        }
        return res
      })()
    }
  },

}
</script>

<style lang="scss">
  html, body, #app {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  *{box-sizing: border-box}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
