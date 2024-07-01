<template>
  <div class="app-container">
    <slot></slot>
  </div>
</template>
<script setup lang="ts"></script>
<style lang="scss">
.app-container {
  height: 100%;
}
:root {
  --app-header-height: 56px;
  --app-size--1x: 8px;
  --app-size--3x: 24px;
  --app-size--4x: calc(var(--app-size--1x) * 4);
  --app-icon--bg: transparent;
  --app-icon--size: 24px;
  --app-font-weight--medium: 500;
  --app-nav-item--width: auto;
  --app-color--black: #000;
  --app-color--blue10: #2e4994;
  --app-color--blue20: #3457b1;
  --app-color--blue30: #3e6ae1;
  --app-color--green: #12bb00;
  --app-color--grey10: #171a20;
  --app-color--grey15: #222;
  --app-color--grey20: #393c41;
  --app-color--grey25: #444;
  --app-color--grey30: #5c5e62;
  --app-color--grey35: #8e8e8e;
  --app-color--grey40: #a2a3a5;
  --app-color--grey45: #bbb;
  --app-color--grey50: #d0d1d2;
  --app-color--grey60: #e2e3e3;
  --app-color--grey65: #eee;
  --app-color--grey70: #f4f4f4;
  --app-color--red10: #b74134;
  --app-color--red20: #ed4e3b;
  --app-color--white: #fff;
  --app-color--yellow: #fbb01b;
  --app-text--white: #fff;
  --app-bezier: cubic-bezier(0.5, 0, 0, 0.75);
}
</style>
