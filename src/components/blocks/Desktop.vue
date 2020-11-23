<template>
  <div class="list" ref="list">
    <ResizableDragAndDrop
      v-for="card in cards"
      :key="card.id"
      :x="card.x"
      :y="card.y"
      :width="card.width"
      :height="card.height"
      :zIndex="card.zIndex"
      :gridStep="50"
      @position-change="(payload) => updatePosition(payload, card)"
      @size-change="(payload) => updateSize(payload, card)"
      @bring-forward="bringForward(card)"
    >
      <DummyCardContent
        :title="card.index"
        :text="card.text"
        @delete="deleteCard(card)"
      />
      <template #drag-point>
        <div class="list__item-point"></div>
      </template>
    </ResizableDragAndDrop>
    <AppButton class="list__bring-back-btn" @click="bringBack">bring back</AppButton>
  </div>
</template>

<script>
import ResizableDragAndDrop from "@/components/universal/ResizableDragAndDrop";
import DummyCardContent from "@/components/common/DummyCardContent";
import AppButton from "@/components/ui/AppButton";
export default {
  data() {
    return {
      defaultCardWidth: 300,
      defaultCardHeight: 100,
      xCenter: 0,
      yCenter: 0,
    }
  },
  components: {
    AppButton,
    ResizableDragAndDrop,
    DummyCardContent
  },
  computed: {
    cards() {
      return this.$store.getters['cards/getCards'];
    },
  },
  methods: {
    updatePosition(payload, card) {
      this.$store.dispatch('cards/updatePosition', { ...payload , card });
    },
    updateSize(payload, card) {
      this.$store.dispatch('cards/updateSize', {...payload, card });
    },
    bringForward(card) {
      this.$store.dispatch('cards/bringForward', { card });
    },
    deleteCard(card) {
      this.$store.dispatch('cards/deleteCard', { card });
    },
    bringBack() {
      this.$store.dispatch('cards/bringBack', {
        x: this.xCenter - this.defaultCardWidth / 2,
        y: this.yCenter - this.defaultCardHeight / 2,
        height: this.defaultCardHeight,
        width: this.defaultCardWidth
      });
    },
    calculateCenter() {
      this.xCenter = this.$refs.list.offsetWidth / 2;
      this.yCenter = this.$refs.list.offsetHeight / 2;
    }
  },
  created() {
    if (this.$store.getters['cards/getCards'].length === 0) {
      this.$store.dispatch('cards/getCards');
    }
  },
  mounted() {

    window.addEventListener('resize', this.calculateCenter);
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('resize', this.calculateCenter);
    });

    this.calculateCenter();

  }
}
</script>

<style scoped>
  .list {
    background-color: beige;
    position: relative;
    height: 100vh;
    width: 100vw;
    margin: 0;
  }

  .list__item-point {
    width: 20px;
    height: 20px;
    background-color: green;
  }

  .list__bring-back-btn {
    position: absolute;
    bottom: 5%;
    left: 50%;
    transform: translate(50%);
  }
</style>