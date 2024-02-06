document.addEventListener("DOMContentLoaded", function () {
  // 1. Add an event listener to the form to listen for the submission event
  document.getElementById("form").addEventListener("submit", function (event) {
      event.preventDefault(); // 2. Prevent the default form submission behavior

      // 3. Retrieve the file from the input field
      const fileInput = document.getElementById("file");
      const file = fileInput.files[0];

      if (file) {
          // 4. Check if the file is a PNG image
          if (file.type === "image/png") {
              // 5. Load the image and perform verifications
              const reader = new FileReader();
              reader.onload = function (e) {
                  const image = new Image();
                  image.onload = function () {
                      // Verify size
                      if (image.width === 512 && image.height === 512) {
                          // Verify non-transparent pixels within a circle
                          if (isNonTransparentWithinCircle(image)) {
                              // Verify colors to give a "happy" feeling
                              if (isHappyColorPalette(image)) {
                                  displayResult(true, image);
                              } else {
                                  displayResult(false, null, "Colors don't convey a happy feeling.");
                              }
                          } else {
                              displayResult(false, null, "Non-transparent pixels are not within a circle.");
                          }
                      } else {
                          displayResult(false, null, "Image size must be 512x512 pixels.");
                      }
                  };
                  image.src = e.target.result;
              };
              reader.readAsDataURL(file);
          } else {
              displayResult(false, null, "Please upload a PNG image.");
          }
      } else {
          displayResult(false, null, "Please select an image to upload.");
      }
  });

  // Function to display the result to the user
  function displayResult(success, image, message) {
      const resultDiv = document.getElementById("result");
      resultDiv.innerHTML = ""; // Clear previous result

      if (success) {
          const imgElement = document.createElement("img");
          imgElement.src = image.src;
          resultDiv.appendChild(imgElement);
          const pElement = document.createElement("p");
          pElement.textContent = "Verification successful!";
          resultDiv.appendChild(pElement);
      } else {
          const pElement = document.createElement("p");
          pElement.textContent = message;
          resultDiv.appendChild(pElement);
      }
  }

  // Function to check if non-transparent pixels are within a circle
  function isNonTransparentWithinCircle(image) {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);

    const data = ctx.getImageData(0, 0, image.width, image.height).data;
    const centerX = image.width / 2;
    const centerY = image.height / 2;
    const radius = Math.min(centerX, centerY);

    for (let i = 0; i < data.length; i += 4) {
      const x = i / 4 % image.width;
      const y = Math.floor(i / 4 / image.width);
      const distanceFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);

      if (distanceFromCenter > radius && data[i + 3] !== 0) { // Check for non-transparent pixel outside circle
        return false;
      }
    }

    return true;
  }

  // Function to check if colors give a "happy" feeling
  function isHappyColorPalette(image) {
      // Implement logic to check if colors convey a "happy" feeling
      // Couldn't find a satisfying solution for this one.
  }
});
