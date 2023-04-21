const allResourceTypes = Object.values(
  chrome.declarativeNetRequest.ResourceType
);

const rules = [
  {
    id: 1,
    priority: 1,
    action: {
      type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
      requestHeaders: [
        {
          operation: chrome.declarativeNetRequest.HeaderOperation.SET,
          header: "x-test-request-header",
          value: "header-tweakr",
        },
      ],
    },
    condition: {
      urlFilter: "https://httpbin.org/headers",
      resourceTypes: allResourceTypes,
    },
  },
];

chrome.declarativeNetRequest.updateDynamicRules({
  removeRuleIds: rules.map((rule) => rule.id), // remove existing rules
  addRules: rules,
});
