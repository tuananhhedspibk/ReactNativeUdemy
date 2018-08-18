const functions = require('firebase-functions');
const admin = require('firebase-admin');
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

admin.initializeApp({
  credential: admin.credential.cert(require('./awesome-places.json')) 
})

// origin: true => accept any origin to access

exports.storeImage = functions.https.onRequest((request, response) => {
  // request: the request that have from firebase
  if(!request.headers.authorization ||
    !request.headers.authorization.startsWith('Bearer ')) {
      console.log('No token present!');
      response.status(403).json({error: 'Unautorized'});
      return;
  }
  let idToken = request.headers.authorization.split('Bearer ')[1];
  admin.auth().verifyIdToken(idToken)
  .then(decodedToken => {
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
              '?alt=media&token=' + uuid,
            imagePath: '/places/' + uuid + '.jpg'
          });
        }
        else {
          console.log(err);
          response.status(500).json({error: err});
        }
      });
    });
    return;
  })
  .catch(error => {
    console.log('Token is invalid!');
    response.status(403).json({error: 'Unauthorized'});
  })
});

exports.deleteImage = functions.database.ref('/places/{placeId}').onDelete(event => {
  const placeData = event._data
  const imagePath = placeData.imagePath;

  const bucket = gcs.bucket('awesome-places-8a128.appspot.com');
  return bucket.file(imagePath).delete();
});
