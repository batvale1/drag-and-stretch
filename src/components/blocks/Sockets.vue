<template>
  <div class="sockets">
    <AppButton class="sockets__start-btn" @click="start">Запуск</AppButton>
    <AppButton class="sockets__stop-btn" @click="stop">Остановка</AppButton>
    <AppButton class="sockets__stop-btn" @click="clear">Сброс</AppButton>
    <table class="sockets__table">
      <thead class="sockets__thead">
        <tr class="sockets__tr">
          <th class="sockets__th">From</th>
          <th class="sockets__th">To</th>
          <th class="sockets__th">Amount</th>
        </tr>
      </thead>
      <tbody class="sockets__tbody">
        <tr class="sockets__tr"
          v-for="(item, index) in txNodes"
          :key="index"
        >
          <td class="sockets__td">
            <p
              class="sockets__text"
              v-for="(itemFrom, index) in item.inputs"
              :key="index"
            >
              {{ itemFrom.prev_out.addr }}
            </p>
          </td>
          <td class="sockets__td">
            <p
                class="sockets__text"
                v-for="(itemTo, index) in item.outputs"
                :key="index"
            >
              {{ itemTo.addr }}
            </p>
          </td>
          <td class="sockets__td">{{ item.value }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import AppButton from '@/components/ui/AppButton'
export default {
  name: 'Sockets',
  components: {
    AppButton
  },
  data() {
    return {
      websocket: null,
      txNodes: []
    }
  },
  methods: {
    start() {
      this.websocket.send('{"op":"unconfirmed_sub"}');
    },
    stop() {
      this.websocket.send('{"op":"unconfirmed_unsub"}');
    },
    clear() {
      this.websocket.send('{"op":"unconfirmed_unsub"}');
      this.txNodes = [];
    }
  },
  created() {
    const websocket = new WebSocket('wss://ws.blockchain.info/inv');

    websocket.onmessage = (event) => {
      const msgData = JSON.parse(event.data);

      if (msgData.op === 'utx'){
        const txHash = msgData.x.hash;
        const outputs = msgData.x.out;
        const inputs = msgData.x.inputs;
        let totalTxValue = 0;
        for(let j=0; j<outputs.length; j++){
          const output = outputs[j];
          totalTxValue += output.value;
        }
        totalTxValue /= 100000000;
        const newTx = {id:txHash, value: totalTxValue, scaledValue: 5 + Math.log(totalTxValue), outputs, inputs };
        this.txNodes.push(newTx);
        if (this.txNodes.length > 400)
        {
          this.txNodes.shift();
        }

      }
    }

    this.websocket = websocket;
  }
}
</script>

<style>
  .sockets__table {
    width: 100%;
  }

  .sockets__th, .sockets__td {
    border: 1px solid #000;
  }
</style>
