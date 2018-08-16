const functions = require('firebase-functions');
const cors = require('cors')({origin: true});
const fs = require('fs');
const UUID = require('uuid-v4');

// projectId: id of firebase project
// keyFileName is the file which we can download from firebase project
// that hold the credentials - use to access to firebase project

const gcconfig = {
  projectId: 'awesome-places-8a128',
  keyFileName: 'awesome-places.json'
}

const gcs = require('@google-cloud/storage')(gcconfig);

// origin: true => accept any origin to access

exports.storeImage = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    // extract and store image
    const body = JSON.parse(request.body);
    fs.writeFileSync("/tmp/uploaded-image.jpg", body.image, 'base64', err => {
      console.log(err);
      return response.status(500).json({error: err});
    });
    const bucket = gcs.bucket('awesome-places-8a128.appspot.com');
    const uuid = UUID();

    bucket.upload('/tmp/uploaded-image.jpg', {
      uploadType: 'media',
      destination: '/places/' + uuid + '.jpg',
      metadata: {
        metadata: {
          contentType: 'image/jpeg',
          firebaseStorageDownloadTokens: uuid
        }
      }
    }, (err, file) => {
      if(!err) {
        response.status(201).json({
          imageUrl: 'https://firebasestorage.googleapis.com/v0/b/' +
            bucket.name +
            '/o/' +
            encodeURIComponent(file.name) +
            '?alt=media&token=' + uuid
        });
      }
      else {
        console.log(err);
        response.status(500).json({error: err});
      }
    });
  });
});
