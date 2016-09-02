const os = require('os');
const spawn = require('child_process').spawnSync;

/**
 * Returns human size
 *
 * @param   {int}    filesize   File size
 * @param   {int}    precision  Number of decimals
 * @returns {string}            Human size
 */

var getSize = function(bytes, precision){
	var ltr = '';
	var units = {
		Y: 1208925819614629174706176,
		Z: 1180591620717411303424,
		E: 1152921504606846976,
		P: 1125899906842624,
		T: 1099511627776,
		G: 1073741824,
		M: 1048576,
		K: 1024
	}
	for (var unit in units) {
		if (filesize > 1024) {
			ltr = unit;
			filesize /= 1024;
		} else {
			break;
		}
	}
	return filesize.toFixed(precision||2) + ltr + 'B';
}



/**
 * Returns a command that exists in the system among $cmds
 * Lifted from github.com/shevabam/ezservermonitor-web
 *
 * @param   {array}  cmds             List of commands
 * @param   {string} args             List of arguments (optional)
 * @param   {bool}   returnWithArgs   If true, returns command with the arguments
 * @returns {string}                  Command
 */

var whichCommand = function(cmds, args, returnWithArgs) {
	args = args||[];
	var ret = '';
	for(var cmd in cmds) {
		var out = spawn(cmds[cmd],args);
		if(out.stdout.toString().trim()!=='') {
			return returnWithArgs ? cmds[cmd]+args.toString() : cmds[cmd];
			break;
		}
	}
	return ret;
}



/**
 * Seconds to human readable text
 * Eg: for 36545627 seconds => 1 year, 57 days, 23 hours and 33 minutes
 * Lifted from github.com/shevabam/ezservermonitor-web
 *
 * @param   {int}    Seconds     Number of seconds to convert
 * @returns {string} Text
 */

var getHumanTime = function(seconds) {
	var units = {
		year: 31536000,
		day: 86400,
		hour: 3600,
		minute: 60
		// second: 1
	}

	// This wasn't in the original, but I think it's useful
	// It adds seconds for period of less than 1/2 hour
	if(seconds < 1800) {
		units.second = 1;
	}

	var parts = [];

	for(var name in units) {
		var divisor = units[name];
		var div = Math.floor(seconds / divisor);

		if(div===0) {
			continue;
		} else if(div===1) {
			parts.push(div + " " + name);
		} else {
			parts.push(div + " " + name + "s");
		}
		seconds %= divisor;
	}

	var last = parts.splice(parts.length-1,1);

	return parts.length===0 ? last : parts.join(", ") + " and " + last;
}

exports = {
	getSize: getSize,
	whichCommand: whichCommand.
	getHumanTime: getHumanTime
}
