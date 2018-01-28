<template name="play">
  <div id="play" class="container">
    <!-- Modal Component -->
    <b-modal id="levelUp" ref="levelUp" title="You've Levelled Up!" ok-only>
      <p class="my-4">
        <h3>Level {{currentLevel.level}}</h3>
        <img :src="currentLevel.img" width="120px" height="120px"/>
        <p class="lead">You've unlocked: {{currentLevel.character}}</p>
      </p>
    </b-modal>

    <div class="main">
      <transition :key="swipe" :name="swipe" >
        <div class="user-card" :key="currentIndex">
            <div class="image_area">
              <div v-if="status == 'loading'">
                <grid-loader class="loader" color="#ffc107"></grid-loader>
              </div>
              <progressive-img class="user-card__picture mx-auto" :src="currentImage"
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
            > <i class="fa fa-long-arrow-left" aria-hidden="true"></i> Fail </b-button>
            <span class="align-middle">Fail or Pass</span>
            <b-button variant="success"
              style="float:right"
              @click="swipeRight"
              v-shortkey="['arrowright']"
              @shortkey="swipeRight"
            > Pass <i class="fa fa-long-arrow-right" aria-hidden="true"></i>  </b-button>
          </div>
        </div>
        <!--<b-card :img-src="images[index].pic"
                img-alt="Card image"
                img-top
                style="position: absolute"
                class="mx-auto"
                :key="index" v-if="images[index]">
          <p class="card-text">
            <b-button variant="danger" style="float:left" @click="swipeLeft"> Fail </b-button>
            <b-button variant="success" style="float:right" @click="swipeRight"> Pass </b-button>
          </p>
        </b-card>-->

      </transition>

      <b-alert :show="dismissCountDown"
         :variant="score.variant"
         class="toast"
         @dismissed="dismissCountdown=0"
         @dismiss-count-down="countDownChanged">
         {{score.message}}
      </b-alert>

    </div>

  </div>
</template>

<style>
  /*https://github.com/pudymody/tinderSwipe/blob/gh-pages/style.css*/

  .main {
    min-height: 100vh;
  }

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

  .user-card__picture {
      width: 100%;
      display: block;
  }

  .image_area {
    background: black;
    position: relative;
  }

  .loader {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9;
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
  /*.swipe-right-enter-active {
    transition: all .3s ease;
  }

  .swipe-right-enter-to {
    transition: all .3s ease;
  }*/

  .swipe-right-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .swipe-right-leave-to
  /* .slide-fade-leave-active below version 2.1.8 */ {
    -webkit-transform: rotate(13deg) translate3d(100%, 0, 0);
            transform: rotate(13deg) translate3d(100%, 0, 0);
    opacity: 0;
  }
  /*.swipe-left-enter-active {
    transition: all .3s ease;
  }*/
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
    max-width: 100px;
    top: 60px;
    left: 0;
    margin: auto;
    position: absolute;
    right: 0;
  }

</style>

<script>
  import Vue from 'vue';
  import _ from 'lodash';
  import { VueHammer } from 'vue2-hammer';
  import imagesLoaded from 'vue-images-loaded';
  import GridLoader from 'vue-spinner/src/PulseLoader';
  import { db } from '../firebaseConfig';
  import VueProgressiveImage from '../../node_modules/vue-progressive-image/dist/vue-progressive-image';

  Vue.use(VueProgressiveImage);
  Vue.use(VueHammer);

  Vue.use(require('vue-shortkey'));

  function randomInt(min, max) {
    return Math.floor(Math.random() * ((max - min) + 1)) + min;
  }


  export default {
    name: 'play',
    firebase: {
      // images: db.ref('images'),
      imageCount: {
        source: db.ref('imageCount').orderByChild('num_votes').limitToFirst(30),
        readyCallback() {
          console.log('is ready', this.imageCount);
          this.status = 'loading';
          /*_.map(this.imageCount, (v) => {
            this.preloadImage(v['.key']);
            console.log('preloaded', v['.key']);
          });*/
          this.setCurrentImage();
        },
      },
    },
    props: ['userInfo', 'userData', 'levels', 'currentLevel'],
    data() {
      return {
        // images: [],
        currentImage: {
          pic: 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==', // this is a blank gray base64
        },
        prevImage: null,
        imageBaseUrl: 'https://dxugxjm290185.cloudfront.net/braindr',
        currentIndex: null,
        imageCount: [],
        preloaded: null,
        swipe: null,
        startTime: null,
        dismissSecs: 1,
        pointsAward: null,
        dismissCountDown: 0,
        score: {
          variant: 'warning',
          message: '',
        },
        status: 'loading',
      };
    },
    computed: {
      currentCount() {
        return this.imageCount[this.currentIndex];
      },
    },
    watch: {
      currentLevel() {
        console.log('detected change', this.userData.score, this.currentLevel.min);
        if (this.userData.score === this.currentLevel.min && this.currentLevel.min) {
          this.$refs.levelUp.show();
          db.ref(`/users/${this.userInfo.displayName}`).child('level').set(this.currentLevel.level);
        }
      },
      imageCount() {
        /*_.map(this.imageCount, (v) => {
          this.preloadImage(v['.key']);
          // console.log('preloaded', v['.key']);
        });*/
      },
    },
    mounted() {
      this.startTime = new Date();
    },
    components: { VueHammer, GridLoader },
    directives: {
      imagesLoaded,
    },
    methods: {
      preloadImage(img) {
        this.preloaded = new Image();
        this.preloaded.src = `${this.imageBaseUrl}/${img}.jpg`;
      },
      setCurrentImage() {
        const fdata = _.filter(this.imageCount,
          val => val.num_votes === this.imageCount[0].num_votes);
        const N = fdata.length;
        this.currentIndex = randomInt(0, N - 1);
        let key = this.currentCount['.key'];
        if (key === this.prevImage) {
          this.currentIndex += 1;
          key = this.currentCount['.key'];
        } else {
          this.prevImage = key;
        }
        console.log('key is', key);
        /*db.ref('images').child(key).once('value').then((snap) => {
          this.currentImage = snap.val();
          this.startTime = new Date();
        });*/
        this.currentImage = `${this.imageBaseUrl}/${key}.jpg`;
        console.log(this.currentImage);
        this.status = "ready";
      },
      getUntrustedScore(data, vote) {
        const size = data.num_votes;
        const aveVote = data.ave_score;
        const newAve = ((aveVote * size) + vote) / (size + 1);
        console.log('size, preave, newave', size, aveVote, newAve, vote);

        if (size <= 5) {
          // not enough votes to say.
          this.score.message = '+ 1';
          this.score.variant = 'success';
          return { score: 1, ave: newAve, size: size + 1 };
        }

        if (aveVote <= 0.3 || aveVote >= 0.7) {
          // the group feels strongly. Do you agree w/ them?
          if (aveVote <= 0.3 && !vote) {
            this.score.message = '+ 1';
            this.score.variant = 'success';
            return { score: 1, ave: newAve, size: size + 1 };
          } else if (aveVote >= 0.7 && vote) {
            this.score.message = '+ 1';
            this.score.variant = 'success';
            return { score: 1, ave: newAve, size: size + 1 };
          }

          // you disagree w/ the majority. You are penalized
          this.score.message = '+ 0';
          this.score.variant = 'danger';
          return { score: 0, ave: newAve, size: size + 1 };
        }

        this.score.message = '+ 1';
        this.score.variant = 'success';
        return { score: 1, ave: newAve, size: size + 1 };
      },
      swipeLeft() {
        console.log(this.currentCount['.key']);
        this.status = 'loading';
        this.setSwipe('swipe-left');
        const score = this.getUntrustedScore(this.currentCount, 0);
        this.showAlert();
        // set the user score
        db.ref('users').child(this.userInfo.displayName)
          .child('score').set(this.userData.score + score.score);
        // set the image count
        this.$firebaseRefs.imageCount
            .child(this.currentCount['.key'])
            .set({
              ave_score: score.ave,
              num_votes: score.size,
            });
        // send the actual vote
        this.sendVote(0);

        this.setCurrentImage();

      },
      sendVote(vote) {
        return db.ref('votes').push({
          username: this.userInfo.displayName,
          time: new Date() - this.startTime,
          vote,
          point: this.pointsAward,
          image_id: this.currentCount['.key'],
        });

         /* this.$firebaseRefs.imageCount
          .child(this.currentCount['.key'])
          .child('num_votes')
          .set(this.currentCount.num_votes + 1); */
      },
      computeScore(data, vote) {
        let voteScore = 0;
        let size = 0;

        _.mapValues(data, (v) => {
          voteScore += v.vote;
          size += 1;
          return v.vote;
        });

        const aveVote = voteScore / size;
        const newAve = (voteScore + vote) / (size + 1);

        if (size <= 5) {
          // not enough votes to say.
          this.score.message = '+ 1';
          this.score.variant = 'success';
          return { score: 1, ave: newAve, size: size + 1 };
        }

        if (aveVote <= 0.3 || aveVote >= 0.7) {
          // the group feels strongly. Do you agree w/ them?
          if (aveVote <= 0.3 && !vote) {
            this.score.message = '+ 1';
            this.score.variant = 'success';
            return { score: 1, ave: newAve, size: size + 1 };
          } else if (aveVote >= 0.7 && vote) {
            this.score.message = '+ 1';
            this.score.variant = 'success';
            return { score: 1, ave: newAve, size: size + 1 };
          }

          // you disagree w/ the majority. You are penalized
          this.score.message = '+ 0';
          this.score.variant = 'danger';
          return { score: 0, ave: newAve, size: size + 1 };
        }

        this.score.message = '+ 1';
        this.score.variant = 'success';
        return { score: 1, ave: newAve, size: size + 1 };
      },
      getScore(vote) {
        // get all scores for the images
        // then run computeScore to get the points

        return db.ref('votes')
          .orderByChild('image_id')
          .equalTo(this.currentCount['.key'])
          .once('value')
          .then((snap) => {
            const data = snap.val();
            console.log('snap data is', data);
            const score = this.computeScore(data, vote);
            this.pointsAward = score.score;
            db.ref('users').child(this.userInfo.displayName)
              .child('score').set(this.userData.score + score.score);

            this.$firebaseRefs.imageCount
                .child(this.currentCount['.key'])
                .set({
                  ave_score: score.ave,
                  num_votes: score.size,
                });
          });
      },
      swipeRight() {
        this.status = 'loading';
        this.setSwipe('swipe-right');
        const score = this.getUntrustedScore(this.currentCount, 1);
        this.showAlert();
        // set the user score
        db.ref('users').child(this.userInfo.displayName)
          .child('score').set(this.userData.score + score.score);
        // set the image count
        this.$firebaseRefs.imageCount
            .child(this.currentCount['.key'])
            .set({
              ave_score: score.ave,
              num_votes: score.size,
            });

        this.sendVote(1);

        this.setCurrentImage();
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
      countDownChanged(dismissCountDown) {
        this.dismissCountDown = dismissCountDown;
      },
      showAlert() {
        this.dismissCountDown = this.dismissSecs;
      },
    },
  };
</script>
