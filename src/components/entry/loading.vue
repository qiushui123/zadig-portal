<template>
  <div class="loading-container">
    <div class="loading">
      <span class="letter">L</span>
      <span class="letter">o</span>
      <span class="letter">a</span>
      <span class="letter">d</span>
      <span class="letter">i</span>
      <span class="letter">n</span>
      <span class="letter">g</span>
    </div>
    <div class="desc">
      服务准备中，耐心等一会哦 ~
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters([
      'signupStatus'
    ])
  },
  methods: {
    checkInit () {
      this.$store.dispatch('getSignupStatus').then(() => {
        if (this.signupStatus.inited) {
          this.$router.push('/')
        } else {
          this.$router.push('/setup')
        }
      }).catch(() => {
        setTimeout(() => {
          this.checkInit()
        }, 5000)
      })
    }
  },
  created () {
    this.checkInit()
  }
}
</script>

<style lang="less" scoped>
@keyframes bounce {
  0% {
    text-shadow: rgba(255, 255, 255, 0.4) 0 0 0.05em;
    transform: translate3d(0, 0, 0);
  }

  100% {
    text-shadow: rgba(255, 255, 255, 0.4) 0 1em 0.35em;
    transform: translate3d(0, -0.5em, 0);
  }
}

.loading-container {
  width: 100%;
  height: 100%;
  margin: 0;
  overflow-y: hidden;
  color: #1989fa;
  background: #2d303a;

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 80%;
    white-space: nowrap;

    .letter {
      display: inline-block;
      margin-top: 0.5em;
      font-weight: 500;
      font-size: 6rem;
      letter-spacing: 1rem;
      text-shadow: rgba(255, 255, 255, 0.4) 0 0 0.05em;
      transform: translate3d(0, 0, 0);
      animation: bounce 0.75s cubic-bezier(0.05, 0, 0.2, 1) infinite alternate;
    }

    .letter:nth-of-type(1) {
      animation-delay: -0.083333333s;
    }

    .letter:nth-of-type(3) {
      animation-delay: 0.0833333333s;
    }

    .letter:nth-of-type(4) {
      animation-delay: 0.1666666667s;
    }

    .letter:nth-of-type(5) {
      animation-delay: 0.25s;
    }

    .letter:nth-of-type(6) {
      animation-delay: 0.3333333333s;
    }

    .letter:nth-of-type(7) {
      animation-delay: 0.4166666667s;
    }
  }

  .desc {
    text-align: center;
  }
}
</style>
