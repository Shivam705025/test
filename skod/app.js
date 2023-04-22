// Load the Clarifai API
clarifai = new Clarifai.App({
  apiKey: '755a7c49d2614dcaa77711b9445282e9'
});

// Analyze the sentence using the Clarifai API and display the best image match
function analyzeSentence() {
  var inputSentence = document.getElementById("inputSentence").value;
  clarifai.models.predict(Clarifai.GENERAL_MODEL, inputSentence).then(
    function(response) {
      var bestImage = response.outputs[0].data.concepts[0].name;
      var bestImageURL = 'https://source.unsplash.com/featured/?' + bestImage;
      $('#outputImage').attr('src', bestImageURL);
      $('#outputCaption').html('Best match for "' + inputSentence + '": ' + bestImage);
      $('#outputImage').show();
    },
    function(err) {
      console.error(err);
    }
  );
}
