var xdebug = (function()
{//create closure for idekey
	var idekey = 'XDEBUG_ECLIPSE',
	expose = {};
	expose.handler = function(request, sender, sendResponse)
	{
		var result = {result : undefined};
		if (request.idkey)
		{
			idekey = request.idekey;
		}
		if (request.cmd === 'status')
		{
			result.result = expose.checkStatus();
		}
		else if (request.cmd === 'toggle')
		{
			result.result = expose.toggle();
		}
		sendResponse(result);
	};
	expose.checkStatus = function()
	{
		switch(idekey)
		{
			case expose.getCookie('XDEBUG_SESSION'):
				return 1;
			case expose.getCookie('XDEBUG_PROFILE'):
				return 2;
			case expose.getCookie('XDEBUG_TRACE'):
				return 3;
		}
		return 0;
	};
	expose.toggle = function()
	{
		var debuggingState = expose.checkStatus();
		switch (expose.checkStatus())
		{
			case 0:
				expose.setCookie('XDEBUG_SESSION', idekey, 60);
				expose.setCookie('XDEBUG_PROFILE', null, -60);
				expose.setCookie('XDEBUG_TRACE', null, -60);
			break;
			case 1:
				expose.setCookie('XDEBUG_SESSION', null, -60);
				expose.setCookie('XDEBUG_PROFILE', idekey, 60);
				expose.setCookie('XDEBUG_TRACE', null, -60);
			break;
			case 2:
				expose.setCookie('XDEBUG_SESSION', null, -60);
				expose.setCookie('XDEBUG_PROFILE', null, -60);
				expose.setCookie('XDEBUG_TRACE', idekey, 60);
			break;
			case 3:
				expose.setCookie('XDEBUG_SESSION', null, -60);
				expose.setCookie('XDEBUG_PROFILE', null, -60);
				expose.setCookie('XDEBUG_TRACE', null, -60);
		}
		return expose.checkStatus();
	};
	expose.setCookie = function (cookieName, cookieVal, minutes)
	{
		var exp = new Date();
		exp.setTime(exp.getTime() + ((minutes || 0) * 60000));
		document.cookie = cookieName + "=" + cookieVal + "; expires=" + exp.toGMTString() + "; path=/";
	};
	expose.getCookie = function(name)
	{
		var prefix = name + '=';
		var startIdx = document.cookie.indexOf(prefix);
		if (startIdx === -1)
		{
			return null;
		}
		startIdx += name.length + 1;
		return document.cookie.substring(startIdx).match(/^[^;]+/)[0];
	};
	return expose;
}());
chrome.extension.onRequest.addListener(xdebug.handler);

