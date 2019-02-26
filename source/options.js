(function () {

	// setTimeout() return value
	let disablePopupTimeout;
	const slctIde = document.getElementById("ide");
	const inptIdeKey = document.getElementById("idekey");
	const inptRacetrigger = document.getElementById("tracetrigger");
	const inptProfiletrigger = document.getElementById("profiletrigger");

	function save_options()
	{
		localStorage["xdebugIdeKey"] = document.getElementById("idekey").value;
		localStorage["xdebugTraceTrigger"] = document.getElementById("tracetrigger").value;
		localStorage["xdebugProfileTrigger"] = document.getElementById("profiletrigger").value;
		localStorage.xdebugDisablePopup = document.getElementById('disable-popup').checked ? '1' : '0';
	}

	function restore_options()
	{
		// Restore IDE Key
		idekey = localStorage["xdebugIdeKey"];

		if (!idekey)
		{
			idekey = "XDEBUG_ECLIPSE";
		}

		if (idekey == "XDEBUG_ECLIPSE" || idekey == "netbeans-xdebug" || idekey == "macgdbp" || idekey == "PHPSTORM")
		{
			slctIde.value = idekey;
			inptIdeKey.disabled = true;
		}
		else
		{
			slctIde.value = "null";
			inptIdeKey.disabled = false;
		}
		inptIdeKey.value = idekey;

		// Restore Trace Triggers
		var traceTrigger = localStorage["xdebugTraceTrigger"];
		inptRacetrigger.value = traceTrigger || "";

		// Restore Profile Triggers
		var profileTrigger = localStorage["xdebugProfileTrigger"];
		inptProfiletrigger.value = profileTrigger || "";

		// Restore Disable Popup
		document.getElementById('disable-popup').checked = (localStorage.xdebugDisablePopup === '1') ? true : false;
	}

	(function()
	{
		slctIde.addEventListener("change", function ()
		{
			if (slctIde.value != "null")
			{
				inptIdeKey.disabled = true;
				inptIdeKey.value = inptIdeKey.value;

				save_options();
			}
			else
			{
				inptIdeKey.disabled = false;
			}
		});

		inptIdeKey.addEventListener("change", save_options);

		// Persist Disable Popup on onChange event
		document.getElementById("disable-popup").addEventListener("change", disablePopupChanged);

		const saveBtns = document.getElementsByClassName("save-button");
		for (const saveBtn of saveBtns) {
			saveBtn.addEventListener("click", save_options);
		}

		restore_options();
	})();

	/**
	 * Disable Popup checkbox changed, persist it.
	 */
	function disablePopupChanged() {
		const disablePopupSaved = document.getElementById("disable-popup-saved");

		disablePopupSaved.classList.add("show");

		// First clear interval
		clearInterval(disablePopupTimeout);
		// Hide after 2 seconds
		disablePopupTimeout = setTimeout(() => disablePopupSaved.classList.remove("show"), 2000);

		// Persist
		save_options();

		// We need to reload the extension, because to hide the popup
        chrome.extension.getBackgroundPage().window.location.reload(true);
	}

})();
