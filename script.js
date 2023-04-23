const fileInput = document.getElementById("file-input");
const submitButton = document.getElementById("submit-button");
const imageContainer = document.getElementById("image-container");
const resultsContainer = document.getElementById("results-container");

submitButton.addEventListener("click", async (event) => {
  event.preventDefault();
  const file = fileInput.files[0];
  if (!file) {
    return;
  }
  const formData = new FormData();
  formData.append("image", file);
  try {
    const response = await fetch("https://vision.googleapis.com/v1/images:annotate?key=AIzaSyA0qVYf6Zdra461mULsurRxy-s-NOqpst8", {
      method: "POST",
      body: JSON.stringify({
        requests: [{
          image: { content: await toBase64(file) },
          features: [{ type: "LABEL_DETECTION" }]
        }]
      })
    });
    const json = await response.json();
    const labels = json.responses[0].labelAnnotations;
    const results = labels.map((label) => label.description);
    showResults(results);
  } catch (error) {
    console.error(error);
  }
});

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = (error) => reject(error);
  });
}

function showResults(results) {
  imageContainer.innerHTML = `<img src="${URL.createObjectURL(fileInput.files[0])}" alt="Uploaded Image">`;
  resultsContainer.innerHTML = `<h2>Prediction Results:</h2><ul>${results.map((result) => `<li>${result}</li>`).join("")}</ul>`;
}
