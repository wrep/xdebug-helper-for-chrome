(function() {
	var ideKey = "XDEBUG_ECLIPSE";
	var traceTrigger = ideKey;
	var profileTrigger = ideKey;
	const anchors = document.getElementsByTagName("a");
	const actions = document.getElementsByClassName("action");

	// Check if localStorage is available and get the ideKey out of it if any
	if (localStorage)
	{
		if (localStorage["xdebugIdeKey"])
		{
			ideKey = localStorage["xdebugIdeKey"];
		}

		if (localStorage["xdebugTraceTrigger"])
		{
			traceTrigger = localStorage["xdebugTraceTrigger"];
		}

		if (localStorage["xdebugProfileTrigger"])
		{
			profileTrigger = localStorage["xdebugProfileTrigger"];
		}
	}

	// Request the current state from the active tab
	chrome.tabs.query({ active: true, windowId: chrome.windows.WINDOW_ID_CURRENT }, function(tabs)
	{
		chrome.tabs.sendMessage(
				tabs[0].id,
				{
					cmd: "getStatus",
					idekey: ideKey,
					traceTrigger: traceTrigger,
					profileTrigger: profileTrigger
				},
				function(response)
				{
					// Highlight the correct option
					document.querySelector('a[data-status="' + response.status + '"]').classList.add("active");
				}
			);
	});

	// Attach handler when user clicks on
	const anchorClickHanlder = function(eventObject) {
		var newStatus = eventObject.currentTarget.dataset.status;

		// Set the new state on the active tab
		chrome.tabs.query({ active: true, windowId: chrome.windows.WINDOW_ID_CURRENT }, function(tabs)
		{
			chrome.tabs.sendMessage(
				tabs[0].id,
				{
					cmd: "setStatus",
					status: newStatus,
					idekey: ideKey,
					traceTrigger : traceTrigger,
					profileTrigger : profileTrigger
				},
				function(response)
				{
					// Make the backgroundpage update the icon and close the popup
					chrome.runtime.getBackgroundPage(function(backgroundPage) {
						backgroundPage.updateIcon(response.status, tabs[0].id);
						window.close();
					});
				}
			);
		});
	};
	for (const anchor of anchors) {
		anchor.addEventListener("click", anchorClickHanlder);
	}

	// Shortcuts
	key("d", function() { document.getElementById("action-debug").click(); });
	key("p", function() { document.getElementById("action-profile").click(); });
	key("t", function() { document.getElementById("action-trace").click(); });
	key("s", function() { document.getElementById("action-disable").click(); });
	key("space,enter", function() { document.querySelector("a:focus").click(); });
	key("down,right", function()
	{
		var current = document.querySelector(".action:focus");
		if (current === null)
		{
			actions[0].focus();
		}
		else
		{
			current.parentElement.nextElementSibling.querySelector("a").focus();
		}
	});
	key("up,left", function()
	{
		var current = document.querySelector(".action:focus");
		if (current.length === 0)
		{
			actions[actions.length - 1].focus();
		}
		else
		{
			current.parentElement.previousElementSibling.querySelector("a").focus();
		}
	});

	// Bit of a hack to prevent Chrome from focussing the first option automaticly
	const focusHandler = function(eventObject)
	{
		eventObject.currentTarget.blur();
		for (const anchor of anchors) {
			anchor.removeEventListener("focus", focusHandler);
		}
	};
	for (const anchor of anchors) {
		anchor.addEventListener("focus", focusHandler);
	}
})();
