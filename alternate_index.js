const qs = require('querystring');

const url = "https://console.aws.amazon.com/iamv2/home#/security_credentials";

/**
 *
 * This method is used to retrieve required headers
 */
async function getHeaders() {
  //get request to console's URL
  const response = await fetch(url);
  const cookies = response.headers["set-cookie"];

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Cookie: cookies,
    Referer: url,
  };

  return headers;
}

/**
 *
 * Print access key in the console function
 */
async function printAccessKey(headers) {
  const accessKeyURL = `${url}/#/create-access-key/root`;

  //send GET rquest to retrieve the access key after user has logged in
  const response = await fetch(accessKeyURL, {
    headers,
  });
  const cookies = response.headers["set-cookie"];

  //we will extract the HTML data from the response
  const html = response.data;
  const form = {};

  //creating our own div and assigning HTML to it - this will help us simulate
  const div = document.createElement("div");
  div.innerHTML = html;
  const inputs = div.querySelectorAll("input[name]");
  inputs.forEach((input) => {
    const name = input.getAttribute("name");
    const value = input.getAttribute("value");
    form[name] = value;
  });

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Cookie: cookies,
    Referer: accessKeyURL,
  };

  //converting the form object to URL-encoded string
  const params = qs.stringify(form, {
    encode: false,
  });

  //we will now send a POST request to the access key URL
  const result = await fetch(accessKeyURL, params, "POST", {
    headers: headers,
  });

  //extract the access key value
  const startIndex = result.data.indexOf('name="access_key_id"');
  const valueStartIndex = result.data.indexOf('value="', startIndex) + 7;
  const valueEndIndex = result.data.indexOf('"', valueStartIndex);
  const accessKey = result.data.substring(valueStartIndex, valueEndIndex);

  //extract the secret access key value
  const secretStartIndex = result.data.indexOf('name="secret_access_key"');
  const secretValueStartIndex =
    result.data.indexOf('value="', secretStartIndex) + 7;
  const secretValueEndIndex = result.data.indexOf('"', secretValueStartIndex);
  const secretAccessKey = result.data.substring(
    secretValueStartIndex,
    secretValueEndIndex
  );

  console.log("Access key:", accessKey);
  console.log("Secret access key:", secretAccessKey);
}

/**
 * execute and call getHeaders and printAccessKey
 */
(async () => {
  try {
    const headers = await getHeaders();
    await printAccessKey(headers);
  } catch (error) {
    console.log(error);
  }
})();
