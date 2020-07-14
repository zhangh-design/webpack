<template>
  <div :class="$style.userName">11111 <p :class="$style.textCls">22222</p></div>
  <!-- <common-user></common-user> -->
</template>

<script>
// 用户管理
export default {}
</script>

<style scoped lang="scss"></style>
<style module lang="scss">
@import "./user.scss";
.user-name {
  display: flex;
  transform: translate(60px);
}
</style>
