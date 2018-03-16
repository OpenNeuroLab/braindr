<template name="upload">
  <div class="upload container">
    <h1> Data Management </h1>
    <p>
      This is a dashboard for the researcher to upload and view images in the braindr database.
    </p>

    <hr>
    <h2>File Upload</h2>
    <p class="lead">Select images to upload</p>
    <b-alert variant="warning" show>
      <strong>Warning:</strong> Make sure your filenames are unique!
    </b-alert>
    <div class="upload mb-3">
      {{files.length}}
      <ul>
        <li v-for="(file, index) in files" :key="file.id">
          <span>{{file.name}}</span> -
          <span>{{file.size | formatSize}}</span> -
          <span v-if="file.error">{{file.error}}</span>
          <span v-else-if="file.success">success</span>
          <span v-else-if="file.active">active</span>
          <span v-else></span>
        </li>
      </ul>
      <div class="example-btn mb-3">
        <file-upload
          class="btn btn-primary mb-0"
          :post-action="null"
          extensions="gif,jpg,jpeg,png,webp"
          accept="image/png,image/gif,image/jpeg,image/webp"
          :multiple="true"
          :size="1024 * 1024 * 10"
          v-model="files"
          @input-filter="inputFilter"
          @input-file="inputFile"
          ref="upload">
          <i class="fa fa-plus"></i>
          Select files
        </file-upload>
        <button type="button" class="btn btn-success" @click="doUpload">
          <i class="fa fa-arrow-up" aria-hidden="true"></i>
          Start Upload
        </button>
      </div>
    </div>
    <hr>
    <textarea v-model="keyToUpdate"/>
    <button type="button" class="btn btn-success" @click="updateAllScores">
      <i class="fa fa-arrow-up" aria-hidden="true"></i>
      Update scores
    </button>

    <hr>
    <b-container class="mt-3">
      <h2>
        All images: {{imageCount.length}}
      </h2>
      <p class="lead"> images that are currently in the database</p>
    <section id="photos" class="mt-2">
      <img v-for="image in images" :src="image.pic"/>
    </section>
    </b-container>
  </div>
</template>

<style>
  #photos {
     /* Prevent vertical gaps */
     line-height: 0;

     -webkit-column-count: 5;
     -webkit-column-gap:   0px;
     -moz-column-count:    5;
     -moz-column-gap:      0px;
     column-count:         5;
     column-gap:           0px;
  }

  #photos img {
    /* Just in case there are inline attributes */
    width: 100% !important;
    height: auto !important;
  }

  @media (max-width: 1200px) {
    #photos {
    -moz-column-count:    4;
    -webkit-column-count: 4;
    column-count:         4;
    }
  }
  @media (max-width: 1000px) {
    #photos {
    -moz-column-count:    3;
    -webkit-column-count: 3;
    column-count:         3;
    }
  }
  @media (max-width: 800px) {
    #photos {
    -moz-column-count:    2;
    -webkit-column-count: 2;
    column-count:         2;
    }
  }
  @media (max-width: 400px) {
    #photos {
    -moz-column-count:    1;
    -webkit-column-count: 1;
    column-count:         1;
    }
  }

</style>

<script>
import Vue from 'vue';
import FileUpload from 'vue-upload-component';
import _ from 'lodash';
import { db } from '../firebaseConfig';


Vue.filter('formatSize', (size) => {
  if (size > 1024 * 1024 * 1024 * 1024) {
    return (size / 1024 / 1024 / 1024 / 1024).toFixed(2) + ' TB';
  } else if (size > 1024 * 1024 * 1024) {
    return (size / 1024 / 1024 / 1024).toFixed(2) + ' GB';
  } else if (size > 1024 * 1024) {
    return (size / 1024 / 1024).toFixed(2) + ' MB';
  } else if (size > 1024) {
    return (size / 1024).toFixed(2) + ' KB';
  }
  return size.toString() + ' B';
});

export default {
  name: 'upload',
  components: {
    FileUpload,
  },
  data() {
    return {
      files: [],
      images: [],
      imageCount: [],
      keyToUpdate: '',
      votes: [],
    };
  },
  firebase: {
    /*images: db.ref('images').limitToLast(5),*/
    /*imageCount: db.ref('imageCount')*/
    // votes: db.ref('votes'),
  },
  methods: {
    inputFilter(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        // Before adding a file

        // Filter system files or hide files
        if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
          return prevent();
        }

        // Filter php html js file
        if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
          return prevent();
        }
      }
    },

    doVotes(){
      console.log(this.votes);
    },

    inputFile(newFile, oldFile) {
      if (newFile && !oldFile) {
        // add
        console.log('add', newFile);
      }
      if (newFile && oldFile) {
        // update
        console.log('update', newFile);
      }

      if (!newFile && oldFile) {
        // remove
        console.log('remove', oldFile);
      }
    },

    doUpload(e) {
      e.preventDefault();
      const self = this;
      this.files.forEach((val) => {
        console.log('va;', val.file);
        self.getBase64(val);
      });
    },

    getBase64(img) {
      const reader = new FileReader();
      const self = this;
      reader.readAsDataURL(img.file);
      reader.onload = function () {
        const b64 = reader.result;
        self.$firebaseRefs.images.child(img.name.split('.')[0]).set({
          filename: img.name,
          pic: b64,
        }).then(() => {
          img.success = true;
          self.$firebaseRefs.imageCount.child(img.name.split('.')[0]).set({
            num_votes: 0,
            ave_score: 0,
          });
        });
      };
      reader.onerror = function (error) {
        console.log('Error: ', error);
      };
    },
    computeScore(data) {
      let voteScore = 0;
      let size = 0;

      _.mapValues(data, (v) => {
        voteScore += v.vote;
        size += 1;
        return v.vote;
      });

      const aveVote = voteScore / size;
      return { aveVote , size };
    },

    updateAllScores() {
      //const data = _.map(this.imageCount, (v) => {return v['.key']});
      //const N = data.length;
      //console.log(N);
      const self = this;
      const data = this.keyToUpdate.split('\n');
      console.log(data)
      /*(function theLoop (i) {
        setTimeout(function () {
          console.log('updating', data[i])
          self.updateScores(data[i]);
          if (--i) {          // If i > 0, keep going
            theLoop(i);       // Call the loop again, and pass it the current value of i
          }
        }, 3000);
      })(data.length);*/

    },

    updateScores(key) {
      // get all scores for the images
      // then run computeScore to get the points
      console.log('trying ', key);
      return db.ref('votes')
        .orderByChild('image_id')
        .equalTo(key)
        .once('value')
        .then((snap) => {
          const data = snap.val();
          console.log('snap data is', data);
          const score = this.computeScore(data);
          console.log('score for', key, 'is', score);
          this.$firebaseRefs.imageCount
              .child(key)
              .set({
                ave_score: score.aveVote,
                num_votes: score.size,
              });
        });
    },

  },


};
</script>
