const url = "https://console.aws.amazon.com/iamv2/home#/security_credentials";

const username = "aws_login_username";
const password = "aws_login_password";

//using the fetch api to retrieve the HTML document
fetch(url)
  .then((response) => {
    if (response.ok) {
      return response.text();
    } else {
      throw new Error("Could not fetch URL");
    }
  })
  .then((html) => {
    //we will now parse this HTML string to Document
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    //if user is not logged in, then we need to find username and password
    const loginUsername = doc.querySelector("#iam_username");
    const loginPassword = doc.querySelector("#iam_password");

    //once we find it, we will setup the values
    loginUsername.value = username;
    loginPassword.value = password;

    //find the signin button and click on it
    const signinButton = doc.querySelector("#signin_button");
    signinButton.click();

    //we will now wait while page loads for access key
    return new Promise((resolve) => {
      const intervalId = setInterval(() => {
        const accessKeyButton = doc.querySelector("#createAccessKey");
        if (accessKeyButton) {
          clearInterval(intervalId);
          resolve(doc);
        }
      }, 100);
    });
  })
  .then((doc) => {
    //once the page loads, we will click on the button
    const accessKeyButton = doc.querySelector("#createAccessKey");
    accessKeyButton.click();

    //now we need to wait for the modal to load 
    return new Promise((resolve) => {
      const intervalId = setInterval(() => {
        const accessKeyModal = doc.querySelector("#access-keys-modal");
        if (accessKeyModal) {
          clearInterval(intervalId);
          resolve(doc);
        }
      }, 100);
    });
  })
  .then((doc) => {
    //once the modal loads, we need to check the checkbox to agree
    const checkbox = doc.querySelector("#access-keys-modal .checkbox");
    checkbox.click();

    //and then click on submit button of the modal
    const submitButton = doc.querySelector(
      '#access-keys-modal button[type="submit"]'
    );
    submitButton.click();

    //now we will wait for the access key to generate
    return new Promise((resolve) => {
      const intervalId = setInterval(() => {
        const accessKeyValue = doc.querySelector("#copyAccessKey");
        if (accessKeyValue) {
          clearInterval(intervalId);
          resolve(doc);
        }
      }, 100);
    });
  })
  .then((doc) => {
    //once the access key is generated, we will find the copy option and copy both keys
    const accessKeyValue = doc.querySelector("#copyAccessKey");
    const secretAccessKeyValue = doc.querySelector("#copySecretAccessKey");
    const accessKey = accessKeyValue.value;
    const secretAccessKey = secretAccessKeyValue.value;

    //printing it to console
    console.log("Access key:", accessKey);
    console.log("Secret access key:", secretAccessKey);
  })
  .catch((error) => {
    console.error(error);
  });