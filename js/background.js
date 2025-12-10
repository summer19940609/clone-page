function getActivedTabId(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        callback && callback(tabs.length ? tabs[0].id : null);
    });
}

function getTab(tabId, callback) {
    chrome.tabs.get(tabId, function (tab) {
        callback && callback(tab);
    });
}

function getActivedTab(callback) {
    getActivedTabId(function (tabId) {
        getTab(tabId, function (tab) {
            callback && callback(tab);
        });
    });
}

// MV3: browserAction 改为 action
chrome.action.onClicked.addListener(function () {
    getActivedTab(function (tab) {
        if (tab) {
            chrome.tabs.create({ url: tab.url, index: tab.index + 1 });
        }
    });
});

// MV3: 在 onInstalled 事件中创建菜单
chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        id: "clone-tab",
        title: chrome.i18n.getMessage("action_clone")
    });
});

// MV3: onclick 属性不再支持，改用 onClicked 监听器
chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId === "clone-tab") {
        getActivedTab(function (activeTab) {
            if (activeTab) {
                chrome.tabs.create({ url: activeTab.url, index: activeTab.index + 1 });
            }
        });
    }
});
