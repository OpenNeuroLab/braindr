<template name="leaderboard">
  <div class="container" id="leaderboard">
    <h1>Leaderboard</h1>
    <b-table striped hover :items="allUsers" :fields="fields"
    :sort-desc.sync="sortDesc" :sortBy.sync="sortBy"></b-table>
  </div>
</template>

<style>
#leaderboard {
  min-height: 100vh;
}
</style>

<script>

  export default {
    name: 'leaderboard',
    props: ['allUsers', 'levels'],
    data() {
      return {
        sortBy: 'score',
        sortDesc: true,
        fields: [
          {
            key: '.key',
            label: 'Player',
            sortable: false,
          },
          {
            key: 'score',
            label: 'Score',
            sortable: true,
          },
          {
            key: 'level',
            label: 'Level',
            sortable: true,
          },
        ],
      };
    },
  };
</script>
