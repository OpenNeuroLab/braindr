<template>
  <div id="profile">
    <!-- Only show stuff is the user is authenticated -->
    <b-container fluid>
      <!-- userInfo is a prop that was passed in from App -->
      <h1>
        <b-img rounded="circle" width="75"
          height="75" blank-color="#777"
          alt="img" class="m-1"
          :src="currentLevel.img"
          v-if="currentLevel.img"
          />
        {{userInfo.displayName}}
      </h1>

      <p class="lead">
        You have {{userData.score}} points!
      </p>
      <hr>

      <h3>Level {{currentLevel.level}}</h3>
      <p class="lead">
        Keep playing to unlock the remaining animals!
      </p>

      <b-container fluid class="p-4">
        <b-row>
          <b-col v-for="lev in levels" v-if="lev.img">
            <div >
              <b-img fluid class="pokemon" :src="lev.img" alt="Thumbnail" v-if="lev.level <= currentLevel.level"/>
              <b-img fluid class="pokemon" :src="lev.img_grey" alt="Thumbnail" v-else/>
              <br>
              Level {{lev.level}}
              <br>
              <span v-if="lev.level > currentLevel.level">{{lev.min}} points</span>
            </div>
          </b-col>
        </b-row>
      </b-container>

      <b-container>
        <select v-model="selectedTheme" v-on:change="setTheme">
          <option v-for="(href, name) of themes" v-bind:value="name">
            {{ name }}
          </option>
        </select>
        <span>Selected: {{ selectedTheme }}</span>

      </b-container>

    </b-container>

  </div>
</template>

<style>
.pokemon{
  min-width: 25px;
  min-height: 25px;
  width: 100px;
  height: 100px;
}

#profile {
  min-height: 100vh;
}

</style>

<script>
export default {
  name: 'profile',
  data() {
    return {
      selectedTheme: null,
    };
  },
  // the parent component feeds these vars to this component
  props: ['userInfo', 'userData', 'levels', 'currentLevel', 'themes'],
  methods: {
    setTheme() {
      this.$emit('theme', this.selectedTheme);
    },
  },
};
</script>
