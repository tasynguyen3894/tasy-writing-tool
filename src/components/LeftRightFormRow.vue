<template>
  <div class="left-right-container">
    <div>
      <slot name="left" />
    </div>
    <div>
      <slot name="right" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.left-right-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
