<template name="tutorial">
  <div class="tutorial">
    <div class="">
      <h1 v-if="!currentImage"> Tutorial</h1>

      <b-modal id="tutDone" ref="tutDone" title="You're Ready" ok-only ok-title="Keep practicing" ok-variant="secondary">
        <p class="my-4">
          <h4> Lets Go!  </h4>
            <b-button to="/play" class="mb-3" variant="primary" size="lg">Start Playing</b-button>
        </p>
      </b-modal>

      <div v-if="!currentImage && stage==0">
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
            <b-col v-for="lev in levels" v-if="lev.img && lev.level <= 3">
              <div>
                <b-img fluid class="pokemon" :src="lev.img_grey" alt="Thumbnail"/>
                <br>
                Level {{lev.level}}
                <br>
                <span>{{lev.min}} points</span>
              </div>
            </b-col>
          </b-row>
        </b-container>
      </div>

      <div v-if="!currentImage && stage==1">

        <p class="lead">
          There are two types of brain tissue: Gray matter and White matter:
        </p>

        <div class="user-card unstack">
            <div class="image_area">
              <img class="user-card__picture mx-auto" src="../assets/braindrIntro.png">
            </div>
          <div class="user-card__name">
            Gray and White matter
          </div>
        </div>

        <p class="lead">
          In a passing image, you can clearly see the two tissue types:
        </p>

        <div class="user-card unstack">
            <div class="image_area">
              <img class="user-card__picture mx-auto" src="../assets/braindrPass.png">
            </div>
          <div class="user-card__name">
            Example of a passing image
          </div>
        </div>

        <p class="lead">
          In a failing image, you cannot distinguish the tissue types.
          <br>
          It looks like there are "bands" or blurriness:
        </p>

        <div class="user-card unstack">
            <div class="image_area">
              <img class="user-card__picture mx-auto" src="../assets/braindrFail.png">
            </div>
          <div class="user-card__name">
            A failing image has motion "bands" or is blurry
          </div>
        </div>

        <p class="lead">
          Your task is to swipe to rate the images.
        </p>


      </div>

      <p class="lead">
        <span :class="{ '': this.currentType === null, 'text-danger': this.currentType === 0, 'text-success': this.currentType === 1 }">{{message}}</span>
      </p>
      <b-button @click="incrementStage(1)" v-if="!currentImage && stage==0" variant="primary">Next</b-button>
      <b-button @click="setImage(1)" v-if="!currentImage && stage==1" variant="primary" class="mb-3">Start</b-button>
      <b-button to="/play" v-if="count >= 5" class="mb-3" variant="primary">Start Playing</b-button>



      <transition :key="swipe" :name="swipe">
        <div class="user-card" :key="currentType" v-if="currentImage">
            <div class="image_area">
              <!--<img class="user-card__picture mx-auto" :src="currentImage.pic"
              v-hammer:swipe.horizontal="onSwipe"
              ></img>-->
              <div v-if="status == 'loading'">
                <grid-loader class="loader" color="#ffc107"></grid-loader>
              </div>
              <progressive-img class="user-card__picture mx-auto" :src="currentImage.pic"
              v-hammer:swipe.horizontal="onSwipe"
              placeholder="https://unsplash.it/500"
              :aspect-ratio="1"
              >
              </progressive-img>
            </div>
          <div class="user-card__name">
            <b-button variant="danger"
              style="float:left"
              @click="swipeLeft"
              v-shortkey="['arrowleft']"
              @shortkey="swipeLeft"
              v-hammer:swipe.left="swipeLeft"
            > <i class="fa fa-long-arrow-left" aria-hidden="true"></i>  Fail </b-button>
            <span class="align-middle">Fail or Pass</span>
            <b-button variant="success"
              style="float:right"
              @click="swipeRight"
              v-shortkey="['arrowright']"
              @shortkey="swipeRight"
            > Pass <i class="fa fa-long-arrow-right" aria-hidden="true"></i> </b-button>
          </div>
        </div>
      </transition>

  </div>
</div>

</template>

<style>
/*https://github.com/pudymody/tinderSwipe/blob/gh-pages/style.css*/
.user-card {
    max-width: 500px;
    height: fit-content;
    width: 100%;
    border: 1px solid #ccc;
    padding: 8px;
    box-shadow: 0px 2px 5px 0px #ccc;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto
}

.unstack {
  position: relative !important;
  margin-bottom: 10px;
}

.user-card__picture {
    width: 100%;
    display: block;
}

.progressive-image-main {
  width: 100%;
  height: 100%;
}

.image_area {
  background: black;
}

.user-card__name {
    margin-bottom: 0;
    margin-top: 8px;
}

.swipe-left {
    -webkit-animation: swipe-left 1s forwards;
            animation: swipe-left 1s forwards;
}

.swipe-right {
    -webkit-animation: swipe-right 1s forwards;
            animation: swipe-right 1s forwards;
}

@-webkit-keyframes swipe-left {
    to {
        -webkit-transform: rotate(-13deg) translate3d(-100%, 0, 0);
                transform: rotate(-13deg) translate3d(-100%, 0, 0);
        opacity: 0;
    }
}

@keyframes swipe-left {
    to {
        -webkit-transform: rotate(-13deg) translate3d(-100%, 0, 0);
                transform: rotate(-13deg) translate3d(-100%, 0, 0);
        opacity: 0;
    }
}

@-webkit-keyframes swipe-right {
    to {
        -webkit-transform: rotate(13deg) translate3d(100%, 0, 0);
                transform: rotate(13deg) translate3d(100%, 0, 0);
        opacity: 0;
    }
}

@keyframes swipe-right {
    to {
        -webkit-transform: rotate(13deg) translate3d(100%, 0, 0);
                transform: rotate(13deg) translate3d(100%, 0, 0);
        opacity: 0;
    }
}

/* Enter and leave animations can use different */
/* durations and timing functions.              */
.swipe-right-enter-active {
  transition: all .3s ease;
}

.swipe-right-enter-to {
  transition: all .3s ease;
}

.swipe-right-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.swipe-right-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  -webkit-transform: rotate(13deg) translate3d(100%, 0, 0);
          transform: rotate(13deg) translate3d(100%, 0, 0);
  opacity: 0;
}
.swipe-left-enter-active {
  transition: all .3s ease;
}
.swipe-left-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.swipe-left-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  -webkit-transform: rotate(-13deg) translate3d(-100%, 0, 0);
          transform: rotate(-13deg) translate3d(-100%, 0, 0);
  opacity: 0;
}

.toast {
  width: auto;
  max-width: 300px;
  top: 60px;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
}

.right {
  color: green;
}
</style>

<script>
import Vue from 'vue';
import { VueHammer } from 'vue2-hammer';
import _ from 'lodash';
import GridLoader from 'vue-spinner/src/PulseLoader';
import VueProgressiveImage from '../../node_modules/vue-progressive-image/dist/vue-progressive-image';
import { db } from '../firebaseConfig';
import config from '../config';

function randomInt(min, max) {
  return Math.floor(Math.random() * ((max - min) + 1)) + min;
}

Vue.use(VueHammer);
Vue.use(VueProgressiveImage);

export default {
  name: 'tutorial',
  firebase: {
    imgCounts: db.ref('imageCount').orderByChild('adminVote').startAt(null), // .limitToFirst(50),
  },
  data() {
    return {
      imgCounts: [],
      imageBaseUrl: config.imageBaseUrl,
      currentType: null,
      currentImage: null,
      startTime: 0,
      swipe: null,
      count: 0,
      stage: 0,
    };
  },
  computed: {
    passes() {
      return _.filter(this.imgCounts, val => val.adminVote === 1);
    },
    fails() {
      return _.filter(this.imgCounts, val => val.adminVote === 0);
    },
    message() {
      if (this.currentType === null) {
        return 'Ready to train?';
      } else if (this.currentType === 1) {
        return 'Swipe Right (or press right arrow) to Pass this image';
      }

      return 'Swipe Left (or press left arrow) to Fail this image';
    },
  },
  components: { VueHammer, GridLoader },
  props: ['levels'],
  watch: {
    count() {
      if (this.count === 5) {
        this.$emit('taken_tutorial', true);
        this.$refs.tutDone.show();
      }
    },
  },
  methods: {
    incrementStage(v) {
      this.stage = v;
    },
    swipeLeft() {
      if (this.currentType === 0) {
        this.setSwipe('swipe-left');
        this.setImage(1);
        this.count += 1;
      } else {
        console.log('wrong way!');
      }
    },
    swipeRight() {
      if (this.currentType === 1) {
        this.setSwipe('swipe-right');
        this.setImage(0);
        this.count += 1;
      } else {
        console.log('wrong way!');
      }
    },
    setImage(type) {
      if (this.stage === 1) {
        this.stage += 1;
      }
      window.scrollTo(0, 0);
      let img = null;
      console.log('this passes', this.passes, this.fails);
      if (type) {
        const N = this.passes.length;
        const rando = randomInt(0, N - 1);
        img = this.passes[rando];
        console.log('here 1', type, img);
      } else {
        const N = this.fails.length;
        const rando = randomInt(0, N - 1);
        img = this.fails[rando];
        console.log('here 0', type, img);
      }
      console.log('img is', img);
      this.currentImage = { pic: `${this.imageBaseUrl}/${img['.key']}.${config.imageExt}` };
      this.currentType = img.adminVote;
    },
    setSwipe(sw) {
      console.log('setting swipe', sw);
      this.swipe = sw;
    },
    onSwipe(evt) {
      if (evt.direction === 2) {
        this.swipeLeft();
      } else {
        this.swipeRight();
      }
    },
  },
};
</script>
