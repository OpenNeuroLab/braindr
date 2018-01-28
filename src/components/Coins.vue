<template>
  <!-- This is a dynamic route
    Source: https://scotch.io/tutorials/getting-started-with-vue-router
  -->
  <div>
    <h1>{{ coin.name }}</h1>

    <p>This is a dynamic route. The URL tells us which coin we want to look up,
      and the vue component gets the info for that coin</p>

    <p>Symbol: {{ coin.symbol }}</p>
    <p>Price (USD): {{ coin.price_usd }}</p>
  </div>
</template>
<script>
  import axios from 'axios';

  export default {
    name: 'Coins',

    data() {
      return {
        coin: {},
      };
    },

    created() {
      this.fetchData();
    },

    watch: {
      $route: 'fetchData',
    },

    methods: {
      fetchData() {
        axios.get(`https://api.coinmarketcap.com/v1/ticker/${this.$route.params.id}/`)
        .then((resp) => {
          this.coin = resp.data[0];
        })
        .catch(() => {
        });
      },
    },
  };
</script>
