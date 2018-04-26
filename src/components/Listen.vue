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
      date: {{currentCount['.key']}}
      <transition :key="swipe" :name="swipe" >
        <div class="user-card" :key="currentIndex">
            <div class="image_area" @click="playSound">
              <div v-if="status == 'loading'">
                <grid-loader class="loader" color="#ffc107"></grid-loader>
              </div>
              <progressive-img class="user-card__picture mx-auto" :src="currentImage"
              placeholder="https://unsplash.it/500"
              :aspect-ratio="1"
              >
              </progressive-img>
            </div>
          <div class="user-card__name">
            <p style="float:left;">
              <b> ave vote </b>: {{stats.ave_vote}}
            </p>
            <p style="float:right;">
              <b> num_votes </b>: {{stats.num_votes}}
            </p>
          </div>
        </div>

      </transition>


      <b-alert :show="dismissCountDown"
         :variant="score.variant"
         class="toast"
         @dismissed="dismissCountdown=0"
         @dismiss-count-down="countDownChanged">
         {{score.message}}
      </b-alert>

    </div>
    <div class="imageChat container">
      <h3 class="mb-2">Whale Chat</h3>
      <div class="chatHistory pl-3 pr-3 pt-3 pb-3 mb-3" v-if="chatOrder.length">
        <p v-for="msg in chatOrder" class="text-left">
          <b>{{msg.username}}</b>: {{msg.message}}
        </p>
      </div>
      <div v-else>
        <p>No one has said anything yet!</p>
      </div>
      <b-form @submit="sendChat">
        <b-form-group id="exampleInputGroup1"
                label="Enter chat message:"
                label-for="exampleInput1"
                description="">
          <b-form-input id="exampleInput1"
                        type="text"
                        v-model="chatMessage"
                        required
                        placeholder="Enter your message">
          </b-form-input>
          <b-button class="mt-2" variant="primary" @click="sendChat">Send</b-button>
        </b-form-group>
      </b-form>

    </div>

  </div>
</template>

<style>
  /*https://github.com/pudymody/tinderSwipe/blob/gh-pages/style.css*/

  .main {
    min-height: 80vh;
  }

  .imageChat {
    max-width: 600px;
  }

  .chatHistory {
    max-height: 200px;
    overflow: auto;
    border-style: solid;
    border-radius: 5px;
    border-width: thin;
    border-color: #17a2b8;
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
      height: 100%;
      display: block;
  }

  .progressive-image-main {
    width: 100%;
    height: 100% !important;
  }

  .image_area {
    background: white !important;
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
  import config from '../config';
  import VueProgressiveImage from '../../node_modules/vue-progressive-image/dist/vue-progressive-image';

  window.db = db;

  Vue.use(VueProgressiveImage);
  Vue.use(VueHammer);

  Vue.use(require('vue-shortkey'));

  function randomInt(min, max) {
    return Math.floor(Math.random() * ((max - min) + 1)) + min;
  }


  export default {
    name: 'listen',
    firebase: {
      // images: db.ref('images'),
      /* imageCount: {
        source: db.ref('imageCount').orderByChild('num_votes').limitToFirst(100),
        readyCallback() {
          console.log('is ready', this.imageCount);
          this.status = 'loading';
          // _.map(this.imageCount, (v) => {
          //  this.preloadImage(v['.key']);
          //  console.log('preloaded', v['.key']);
          // });
          this.setCurrentImage();
        },
      }, */ // DEBUG: uncomment for non-random
    },
    props: ['userInfo', 'userData', 'levels', 'currentLevel'],
    data() {
      return {
        // images: [],
        currentImage: {
          pic: 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==', // this is a blank gray base64
        },
        currentCount: {},
        prevImage: null,
        imageBaseUrl: config.imageBaseUrl,
        currentIndex: null,
        imageCount: [],
        preloaded: null,
        swipe: null,
        startTime: null,
        dismissSecs: 1,
        pointsAward: null,
        dismissCountDown: 0,
        currentAudio: null,
        stats: { ave_vote: null, n_votes: null },
        score: {
          variant: 'warning',
          message: '',
        },
        status: 'loading',
        chatMessage: '',
        chatHistory: {},
      };
    },
    computed: {
      /* currentCount() {
        return this.imageCount[this.currentIndex];
      }, */ // DEBUG: uncomment for unrandom
      chatOrder() {
        const chats = [];
        _.mapValues(this.chatHistory, (v) => {
          chats.push(v);
        });
        chats.reverse();
        return chats;
      },
    },
    watch: {
      $route() {
        console.log('changed route');
        this.setCurrentImage();
      },
    },
    mounted() {
      this.setCurrentImage();
    },
    components: { VueHammer, GridLoader },
    directives: {
      imagesLoaded,
    },
    methods: {
      playSound() {
        if (this.currentAudio) {
          this.currentAudio.pause();
          this.currentAudio = null;
        }
        const soundUrl = this.currentImage.replace('.jpg', '.wav');
        const audio = new Audio(soundUrl);
        this.currentAudio = audio;
        audio.play();
        const self = this;
        audio.onended = function setEnd() {
          self.currentAudio = null;
        };
      },
      sendChat(e) {
        e.preventDefault();
        const key = this.$route.params.key;
        db.ref('imageChat').child(key).push({
          username: this.userData['.key'],
          message: this.chatMessage,
          time: new Date().toISOString(),
        });
        db.ref('userChat').child(this.userData['.key']).child(key).set({
          watch: 1,
        });
        this.chatMessage = '';
        // TODO: need to add a flag to all other users following this chat.
        const usersToNotify = [];
        this.chatOrder.forEach((v) => {
          if (usersToNotify.indexOf(v.username) < 0 && v.username !== this.userData['.key']) {
            usersToNotify.push(v.username);
          }
        });
        usersToNotify.forEach((u) => {
          db.ref('notifications').child(u).child(key).set(true);
        });
        console.log('users to notify', usersToNotify);
      },
      setCurrentImage() {
        db.ref('imageCount').child(this.$route.params.key)
          .once('value')
          .then((snap) => {
            const data = snap.val();
            console.log('snap si', data);
            const key = this.$route.params.key;
            data['.key'] = this.$route.params.key;
            console.log('data snap is', data);
            this.currentImage = `${this.imageBaseUrl}/${key}.${config.imageExt}`;
            this.currentCount = data;
            console.log(this.currentImage);
            this.startTime = new Date();
            this.status = 'ready';
            this.playSound();
            db.ref('votes')
              .orderByChild('image_id')
              .equalTo(key)
              .once('value')
              .then((snap1) => {
                const vdata = snap1.val();
                console.log('votedata', vdata);
                if (vdata) {
                  let votes = 0;
                  let N = 0;
                  _.mapValues(vdata, (v) => {
                    console.log(v);
                    votes += v.vote;
                    N += 1;
                  });
                  console.log(votes, N);
                  this.stats.ave_vote = votes / N;
                  this.stats.num_votes = N;
                }
              });

            db.ref('imageChat').child(key)
              .on('value', (snap2) => {
                const chatData = snap2.val();
                this.chatHistory = chatData;
              });

            // TODO: only do this if this key is in the notifications/username tho
            db.ref('notifications')
              .child(this.userData['.key'])
              .child(key)
              .set(false);
          });
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
        // this.$firebaseRefs.imageCount
        db.ref('imageCount')
            .child(this.currentCount['.key'])
            .set({
              ave_score: score.ave,
              num_votes: score.size,
            });
        // send the actual vote
        this.sendVote(0).then(() => {
          console.log('sent vote');
        });

        this.setCurrentImage();
      },
      sendVote(vote) {
        // console.log('this startTime', this.startTime);
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

            // this.$firebaseRefs.imageCount
            db.ref('imageCount')
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
        db.ref('imageCount')
            .child(this.currentCount['.key'])
            .set({
              ave_score: score.ave,
              num_votes: score.size,
            });

        this.sendVote(1).then(() => {
          console.log('sent vote');
        });

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
