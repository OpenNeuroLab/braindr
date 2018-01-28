<template>
  <div class="viz">
    <h1> Data Visualization </h1>
    <div class="container barplot">
      <div>
        <p class="lead"> Realtime updating charts describing the data collected on braindr. </p>
      </div>
      <div class="stats">
        <b-container>
        <b-row>
          <b-col>
            <h1> {{allUsers.length}} </h1>
            <p class="text-muted">  # users </p>
          </b-col>
        <b-col>
          <h1>{{sumCounts}}</h1>
          <p class="text-muted"> # ratings </p>
        </b-col>
      </b-row>
        </b-container>

      </div>

       <hr>
      <h2> Number of votes per image </h2>
      <p class="lead">
        We want every image to have been rated at least 5 times
      </p>
      <span v-if="this.status != 'ready'">{{status}}</span>
      <div v-for="(bin, index) in makeHist" class="line">
        <span class="label x"> {{index}} </span>
        <div class="bar" :style="bin" @click="plotDist(bin)">

        </div>
        <span class="label y">{{bin.text}}</span>
      </div>
      <hr>
      <h2> Average vote distribution </h2>
      <p class="lead">
        Some images clearly pass or fail QC, but some are in between.
      </p>
      <span v-if="this.status != 'ready'">{{status}}</span>
      <div v-for="(bin, index) in histData" class="line">
        <span class="label x wide"> {{bin.x0 | formatNumber }} - {{bin.x1 | formatNumber }} </span>
        <div class="bar" :style="bin">

        </div>
        <span class="label y">{{bin.value}}</span>
      </div>
      <hr>



    </div>
  </div>
</template>

<style>

.stats {
  margin-top: 2em;
  display: inline-flex;
}

.stat {
    font-size: 2em;
    margin-right: 3em;
    margin-left: 3em;
}

.bar {
  background-color: steelblue;
  color: white;
  margin: 5px;
  text-align: right;
  height: 20px;
}

.bar:hover{
  background-color: #ecb058;
}

.line {
  display: flex;
}

.x {
  color: grey;
  min-width: 20px;
}

.wide {
  min-width: 60px;
}


.barplot {

}

hr {
  margin: 40px;
}
</style>

<script>
import _ from 'lodash';
const d3 = require('d3-array');
import numeral from 'numeral';
import Vue from 'vue';
import { db } from '../firebaseConfig';

Vue.filter('formatNumber', value => numeral(value).format('0.0[0]'));

export default {
  name: 'viz',
  firebase: {
    imageCount: {
      source: db.ref('imageCount').orderByChild('num_votes'),
      readyCallback() {
        // console.log(this.imageCount);
        this.status = 'ready'
        this.plotDist();
      },
    },
  },
  data() {
    return {
      ready: false,
      histData: [],
      status: 'Loading',
    };
  },
  components: {  },
  props: ['allUsers'],
  created(){
    this.status = 'Loading..';
  },
  computed: {
    makeHist() {
      if (this.ready && document.getElementsByClassName('barplot')[0]) {
        const data = _.groupBy(this.imageCount, 'num_votes');
        const w = document.getElementsByClassName('barplot')[0].clientWidth || 100;
        const vals = [];
        _.mapValues(data, (v) => {
          vals.push(v.length);
        });
        const m = _.max(vals) * 1.1;
        const bins =   _.mapValues(data, (v) => {
          return { width: v.length/m * w +'px', text: v.length};
        });
        this.plotDist();
        this.status = 'ready';
        return bins;
      }
    },
    sumCounts() {
      const data = _.map(this.imageCount, v =>  v.num_votes);
      return _.sum(data);
    }
  },
  methods: {
    plotDist(bin) {

      if (!bin) {
        // plot the full distribution
        const histogram = d3.histogram()
                       .thresholds(10)
                       .value(d => d.ave_score);
        const histogramData = histogram(this.imageCount);
        const w = document.getElementsByClassName('barplot')[0].clientWidth || 100;
        //console.log('hist data', histogramData);
        const vals = _.map(histogramData, v => v.length - 2);
        const m = _.max(vals) * 1.1;
        const data = _.mapValues(histogramData, (v) => {
          return { width: (v.length - 2)/m * w + 'px', value: v.length - 2, x0: v.x0, x1: v.x1 }
        });
        //console.log(data);
        this.histData = data;
      } else {
        //console.log('bin is', bin);
      }
    },
  },
  mounted(){
    this.ready = true;
  }
};
</script>
