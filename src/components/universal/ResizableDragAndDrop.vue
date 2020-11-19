<template>
  <div
      :class="['block', {'block_active': isActive}]"
      ref="block"
      @mousedown.stop.prevent="startDragging"
      @click="$emit('clicked')"
  >
    <div class="block__content">
      <slot></slot>
    </div>
    <div
        class="block__drag-point block__drag-point_left"
        @mousedown.stop.prevent="(event) => startStretchingX(event, 'left')"
    >
      <slot name="drag-point" :title="'simple title'">
        <DragPoint />
      </slot>
    </div>
    <div
        class="block__drag-point block__drag-point_right"
        @mousedown.stop.prevent="(event) => startStretchingX(event, 'right')"
    >
      <slot name="drag-point">
        <DragPoint />
      </slot>
    </div>
    <div
        class="block__drag-point block__drag-point_top"
        @mousedown.stop.prevent="(event) => startStretchingY(event, 'top')"
    >
      <slot name="drag-point">
        <DragPoint />
      </slot>
    </div>
    <div
        class="block__drag-point block__drag-point_bottom"
        @mousedown.stop.prevent="(event) => startStretchingY(event, 'bottom')"
    >
      <slot name="drag-point">
        <DragPoint />
      </slot>
    </div>
  </div>
</template>

<script>
import DragPoint from "@/components/service/DragPoint";

export default {
  data() {
    return {
      desktop: null,
      isActive: null,
      isMoving: false,
      isStretchingX: false,
      isStretchingY: false,
      startMousePageX: null,
      startMousePageY: null,
      direction: null,
      gridAccX: 0,
      gridAccY: 0
    }
  },
  props: {
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    },
    width: {
      type: Number,
      default: 100,
    },
    height: {
      type: Number,
      default: 100,
    },
    zIndex: {
      type: Number,
      default: 0
    },
    gridStep: {
      type: Number,
      default: 1
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  components: {
    DragPoint
  },
  mounted() {
    this.desktop = this.$el.parentElement;
    this.$refs.block.style.left = this.x + 'px';
    this.$refs.block.style.top = this.y + 'px';
    this.$refs.block.style.width = this.width + 'px';
    this.$refs.block.style.height = this.height + 'px';
    this.$refs.block.style.zIndex = this.zIndex;
    this.desktop.addEventListener('mousemove', this.move);
    this.desktop.addEventListener('mouseup', this.mouseUp);

    this.$once('hook:beforeDestroy', () => {
      this.desktop.removeEventListener('mousemove', this.move);
      this.desktop.removeEventListener('mouseup', this.mouseUp);
    })
  },
  watch: {
    width(newValue) {
      this.$refs.block.style.width = newValue + 'px';
    },
    height(newValue) {
      this.$refs.block.style.height = newValue + 'px';
    },
    zIndex(newValue) {
      this.$refs.block.style.zIndex = newValue;
    },
  },
  updated() {
    this.$refs.block.style.left = this.x + 'px';
    this.$refs.block.style.top = this.y + 'px';
  },
  methods: {
    move(event) {
      if (this.isMoving) {
        this.dragging(event)
      } else if (this.isStretchingX) {
        this.StretchingX(event)
      } else if (this.isStretchingY) {
        this.StretchingY(event)
      }
    },
    startDragging(event) {
      this.isMoving = true;
      this.isActive = true;
      this.startMousePageX = event.pageX;
      this.startMousePageY = event.pageY;
      this.gridAccX = 0;
      this.gridAccY = 0;
    },
    dragging(event) {
      if (this.isMoving && this.isActive) {
        const currentMouseOffsetX = this.startMousePageX - event.pageX;
        const currentMouseOffsetY = this.startMousePageY - event.pageY;
        let x = this.x - currentMouseOffsetX;
        let y = this.y - currentMouseOffsetY;
        if (this.gridStep) {

          if (Math.abs(this.gridAccX) - this.gridStep > 0) {
            x = this.gridAccX > 0 ? this.x - this.gridStep : this.x + this.gridStep;
            this.gridAccX = 0;
          } else {
            x = this.x;
            this.gridAccX += currentMouseOffsetX;
          }

          if (Math.abs(this.gridAccY) - this.gridStep > 0) {
            y = this.gridAccY > 0 ? this.y - this.gridStep : this.y + this.gridStep;
            this.gridAccY = 0;
          } else {
            y = this.y;
            this.gridAccY += currentMouseOffsetY;
          }
        }
        this.startMousePageX = event.pageX;
        this.startMousePageY = event.pageY;
        this.$emit('position-change', {x, y});
      }
    },

    startStretchingX(event, direction) {
      this.isStretchingX = true;
      this.isActive = true;
      this.direction = direction;
      this.startMousePageX = event.pageX;
      this.gridAccX = 0;
    },

    StretchingX(event) {
      if (this.isStretchingX) {
        const currentMouseOffsetX = this.startMousePageX - event.pageX;
        let width = this.direction === 'left' ? this.width + currentMouseOffsetX : this.width - currentMouseOffsetX;
        let x = this.direction === 'left' ? this.x - currentMouseOffsetX : this.x;
        if (this.gridStep) {
          if (Math.abs(this.gridAccX) - this.gridStep > 0) {
            if (this.gridAccX > 0) {
              width = this.direction === 'left' ? this.width + this.gridStep : this.width - this.gridStep;
              x = this.direction === 'left' ? this.x - this.gridStep : this.x;
            } else {
              width = this.direction === 'left' ? this.width - this.gridStep : this.width + this.gridStep;
              x = this.direction === 'left' ? this.x + this.gridStep : this.x;
            }
            this.gridAccX = 0;
          } else {
            x = this.x;
            width = this.width;
            this.gridAccX += currentMouseOffsetX;
          }
        }
        this.startMousePageX = event.pageX;
        this.$emit('size-change', {width, height: this.height, x: x, y: this.y });
      }
    },

    startStretchingY(event, direction) {
      this.isStretchingY = true;
      this.isActive = true;
      this.direction = direction;
      this.startMousePageY = event.pageY;
    },

    StretchingY(event) {
      if (this.isStretchingY) {
        const currentMouseOffsetY = this.startMousePageY - event.pageY;
        let height = this.direction === 'top' ? this.height + currentMouseOffsetY : this.height - currentMouseOffsetY;
        let y = this.direction === 'top' ? this.y - currentMouseOffsetY : this.y;

        if (this.gridStep) {
          if (Math.abs(this.gridAccY) - this.gridStep > 0) {
            if (this.gridAccY > 0) {
              height = this.direction === 'top' ? this.height + this.gridStep : this.height - this.gridStep;
              y = this.direction === 'top' ? this.y - this.gridStep : this.y;
            } else {
              height = this.direction === 'top' ? this.height - this.gridStep : this.height + this.gridStep;
              y = this.direction === 'top' ? this.y + this.gridStep : this.y;
            }
            this.gridAccY = 0;
          } else {
            y = this.y;
            height = this.height;
            this.gridAccY += currentMouseOffsetY;
          }
        }

        this.startMousePageY = event.pageY;
        this.$emit('size-change', {width: this.width, height: height, x: this.x, y: y });
      }
    },

    mouseUp() {
      this.isMoving = false;
      this.isStretchingX = false;
      this.isStretchingY = false;
      this.isActive = false;
    }
  }
}
</script>

<style scoped>
  .block {
    width: 100px;
    height: 100px;
    background-color: #2c3e50;
    position: absolute;
  }

  .block_active {
    box-shadow: 5px 5px 22px 0px #000000;
  }

  .block__drag-point {

  }

  .block__drag-point_left {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translate(-50%, -50%);
    cursor: e-resize;
  }

  .block__drag-point_right {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate(50%, -50%);
    cursor: w-resize;
  }

  .block__drag-point_top {
    position: absolute;
    top: 0;
    right: 50%;
    transform: translate(50%, -50%);
    cursor: s-resize;
  }

  .block__drag-point_bottom {
    position: absolute;
    bottom: 0;
    right: 50%;
    transform: translate(50%, 50%);
    cursor: n-resize;
  }
</style>