<template>
  <div>
    as
  </div>
</template>

<script>
import uniqueId from 'lodash/uniqueId'
// import Worksheet from './worksheet'
// import DefinedNames from './lib/defined-names'
// import XLSX from './../xlsx/xlsx'
// import CSV from './../csv/csv'
export default {
  name: 'Workbook',
  data () {
    return {
      created: new Date(),
      modified: this.created,
      properties: {},
      _worksheets: [],
      views: [],
      media: [],
      // _definedNames: new DefinedNames(),
    }
  },
  methods: {
    xlsx () {
      // if (!this._xlsx) this._xlsx = new XLSX(this);
      // return this._xlsx;
    },
    csv() {
      // if (!this._csv) this._csv = new CSV(this);
      return this._csv;
    },
    addWorksheet(name, options) {
      const id = uniqueId();

      if (name && (name.length > 31)) {
        console.warn(`Worksheet name ${name} exceeds 31 chars. This will be truncated`);
      }
      name = (name || `sheet${id}`).substring(0, 31);
      if (this._worksheets.find(ws => ws && ws.name === name)) {
        throw new Error(`Worksheet name already exists: ${name}`);
      }

      const lastOrderNo = this._worksheets.reduce((acc, ws) => ((ws && ws.orderNo) > acc ? ws.orderNo : acc), 0);
      const worksheetOptions = Object.assign({}, options, {
        id,
        name,
        orderNo: lastOrderNo + 1,
        workbook: this,
      });

      const worksheet = new Worksheet(worksheetOptions);

      this._worksheets[id] = worksheet;
      return worksheet;
    }
  },
}
</script>

<style scoped>

</style>
