<template>
  <div id="about">
    <h1> About braindr. </h1>

    <b-container>
      <p>Braindr is an app for quality control of images from the
        <a href="https://www.biorxiv.org/content/early/2017/06/13/149369"> Healthy Brain Network </a>
      </p>

      <p>
        5 images for each T1-weighted MRI image have been uploaded to this site
      </p>

      <p>
        Your objective is to classify these slices as "Pass" or "Fail" by swiping right or left
      </p>

      <p>
        Any similarities to the Tinder dating app are completely coincidental
      </p>

      <p>
        You get points for each image you rate.
      </p>

      <p>
        You can unlock the following animals based on the number of points you have:
      </p>

      <b-container fluid class="p-4">
        <b-row>
          <b-col v-for="lev in levels" v-if="lev.img">
            <div >
              <b-img fluid class="pokemon" :src="lev.img_grey" alt="Thumbnail"/>
              <br>
              Level {{lev.level}}
              <br>
              <span>{{lev.min}} points</span>
            </div>
          </b-col>
        </b-row>
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


#about {
  min-height: 100vh;
}

</style>

<script>
export default {
  name: 'about',
  data() {
    return {
      count: 1,
    };
  },
  props: ['levels'],
};
</script>
