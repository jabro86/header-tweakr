chrome.storage.sync.get("headers", (data) => {
  setHeaders(data.headers || {});
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.headers) {
    setHeaders(changes.headers.newValue || {});
  }
});

function setHeaders(headers) {
  if (chrome.webRequest.onBeforeSendHeaders.hasListener(onBeforeSendHeaders)) {
    chrome.webRequest.onBeforeSendHeaders.removeListener(onBeforeSendHeaders);
  }

  chrome.webRequest.onBeforeSendHeaders.addListener(
    onBeforeSendHeaders,
    { urls: ["<all_urls>"] },
    ["blocking", "requestHeaders"]
  );

  function onBeforeSendHeaders(details) {
    const newHeaders = details.requestHeaders;

    for (const [name, value] of Object.entries(headers)) {
      let found = false;

      for (const header of newHeaders) {
        if (header.name.toLowerCase() === name.toLowerCase()) {
          header.value = value;
          found = true;
          break;
        }
      }

      if (!found) {
        newHeaders.push({ name: name, value: value });
      }
    }

    return { requestHeaders: newHeaders };
  }
}
