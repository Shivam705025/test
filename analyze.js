function analyzeImage() {
  const apiKey = '755a7c49d2614dcaa77711b9445282e9';
  const modelId = 'aaa03c23b3724a16a56b629203edc62c';
  const input = document.getElementById('inputImage');
  const file = input.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onloadend = function () {
    const base64Image = reader.result.split(',')[1];
    const params = {
      method: 'POST',
      headers: {
        'Authorization': 'Key ' + apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'inputs': [{
          'data': {
            'image': {
              'base64': base64Image
            }
          }
        }]
      })
    };

    fetch('https://api.clarifai.com/v2/models/' + modelId + '/outputs', params)
      .then(response => response.json())
      .then(result => {
        const output = document.getElementById('output');
        output.innerHTML = `<p><strong>Categories:</strong> ${result.outputs[0].data.concepts[0].name}</p>
                            <p><strong>Tags:</strong> ${result.outputs[0].data.concepts.map(concept => concept.name).join(', ')}</p>`;
      })
      .catch(error => console.error(error));
  };
}
