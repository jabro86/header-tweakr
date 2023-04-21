document.addEventListener("DOMContentLoaded", () => {
  // Load saved headers
  chrome.storage.sync.get("headers", (data) => {
    displayHeaders(data.headers || {});
  });

  // Form submission handler
  const form = document.getElementById("header-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const headerName = form["header-name"].value.trim();
    const headerValue = form["header-value"].value.trim();
    if (!headerName || !headerValue) return;

    // Save header
    chrome.storage.sync.get("headers", (data) => {
      data.headers = data.headers || {};
      data.headers[headerName] = headerValue;
      chrome.storage.sync.set({ headers: data.headers }, () => {
        displayHeaders(data.headers);
      });
    });
  });
});

function displayHeaders(headers) {
  const headerList = document.getElementById("header-list");
  headerList.innerHTML = "";

  for (const [name, value] of Object.entries(headers)) {
    const listItem = document.createElement("div");
    listItem.textContent = `${name}: ${value}`;

    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      delete headers[name];
      chrome.storage.sync.set({ headers: headers }, () => {
        displayHeaders(headers);
      });
    });

    listItem.appendChild(deleteButton);
    headerList.appendChild(listItem);
  }
}
