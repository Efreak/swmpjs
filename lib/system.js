const os = require('os');
const utils = require('./utils.js');
const fs = require('fs');

/**
 * Returns hostname
 *
 * @param   {array}   errors    errors in this function are written to this array
 * @returns {string}  Hostname
 */

var hostname = function(errors){
	return os.hostname();
}



/**
 * Returns server IP
 * Lifted from github.com/shevabam/ezservermonitor-web
 *
 * @param   {array}   errors    errors in this function are written to this array
 * @param   {Object}  config    configuration
 * @returns {string}  Server    local IP
 */
var getLanIp = function(errors, config) {
	if(config.ip===false) {
		return '';
	}
	try {
		var interfaces = os.networkInterfaces();
		if(interfaces[config.interface]) {
			var iface = interfaces[config.interface];
			var ret = []
			for(var i in iface) {
				ret.push(iface[i].address);
			}
			return ret;
		}
	} catch(err) {
		return '';
		errors.push("Cannot get Server IP");
	}
}



/**
 * Returns CPU cores number
 * Lifted from github.com/shevabam/ezservermonitor-web
 *
 * @param   {array} errors           errors in this function are written to this array
 * @returns {int}   Number of cores
 */

var getCpuCoresNumber = function(errors) {
	try {
		return os.cpus().length;
	} catch(err) {
		errors.push("Cannot get number of cores");
		return '';
	}
}



/**
 * Returns the operating system
 *
 * @param {array} errors errors in this function are written to this array
 * @returns {string}  name of OS
 */
var getOperatingSystem = function(errors) {
	var rl = utils.runCommand('lsb_release',['-d','-s']);
	if(!rl.error && rl.stdout && rl.stdout !== '') {
		return rl.stdout;
	}
	if(os.platform==="win32") {
		return "Windows " + os.release();
	}
	try {
		return fs.readFileSync('/etc/issue.net').toString().trim();
	} catch(err) {
		errors.push("Cannot get OS release");
		return os.platform();
	}
}



/**
 * Returns the kernel name
 *
 * @returns {string}  name of the kernel
 */
var getKernel = function() {
	return os.release();
}



/**
 * Returns the current uptime in human readable format
 *
 * @returns {string}  the current uptime
 */
var getUptime = function() {
	return utils.getHumanTime(os.uptime());
}


/**
 * Returns the model of the first CPU
 *
 * @returns {string}  the cpu model
 */
var getCpuModel = function() {
	return os.cpus()[0].model;
}



/**
 * Returns the frequency of the first CPU
 *
 * @returns {string}  the cpu frequency
 */
var getCpuFrequency = function() {
	return parseInt(os.cpus()[0].speed)/1000+' GHz';
}



/**
 * Returns the cache size of the first CPU.
 * Uses nasty `sh -c` instead of doing it properly. Should probably not do this.
 *
 * @param {array} errors errors in this function are written to this array
 * @returns {string}  the cpu cache size
 */
var getCpuCacheSize = function(errors) {
	var out = utils.runCommand('sh',['-c','cat /proc/cpuinfo|grep cache\\ size|head -n 1']);
	if(out.error || !out.stdout) {
		errors.push("CPU cache size could not be determined");
		return '';
	}
	out = out.stdout.split(' ');
	out.splice(0,2);
	return out.join(' ');
}



/**
 * Returns the temperature of the first CPU
 *
 * @param {array} errors errors in this function are written to this array
 * @returns {string}  the cpu temperature
 */
var getCpuTemperature = function(errors) {
	var out = utils.runCommand('sh',['-c','/usr/bin/sensors | grep -E "^(CPU Temp|Core 0)" | cut -d \'+\' -f2 | cut -d \'.\' -f1']);
	if(out.stdout) {
		out = out.stdout.split(' ');
		out.splice(0,2);
		return out.join(' ') + "°C";
	}
	try {
		return parseInt(fs.readFileSync('/sys/class/thermal/thermal_zone0/temp')) / 1000 + "°C";
	} catch(err) {
		errors.push("CPU temperature could not be determined");
		return '';
	}
}



/**
 * Returns the load data of the CPU
 *
 * @returns {array}  the cpu load data
 */
/*
 * I'm assuming this is supposed to return multiple values? I'm not sure what the $cores
 * reference is doing I don't have a multi-core linux system handy (my server is single-core)
 * so I'll just return os.loadavg()
*/
var getCpuLoadData = function() {
	return os.loadavg();
}


/**
 * parses and returns info about memory
 * Part of this function was borrowed from http://stackoverflow.com/a/23588793
 *
 * @returns {Object} parsed object containing values from /proc/meminfo
 */

var getMeminfo = function(errors){
	var info = {};
	try {
		var data = fs.readFileSync('/proc/meminfo').toString();
	} catch(err) {
		errors.push('Could not read RAM data');
		return {};
	}
	data.split(/\n/g).forEach(function(line){
		line = line.split(':');

		// Ignore invalid lines, if any
		if (line.length < 2) {
			return;
		}

		// Remove parseInt call to make all values strings
		info[line[0]] = parseInt(line[1].trim(), 10);
	});
	return info;
}



/**
 * Returns the various data about the RAM
 * You can get free memory with os.freemem()
 * @returns {array}  the ram data
 */

var getRamInfo = function(errors) {
	var info = getMeminfo(errors);
	if(!info.MemFree) {
		errors.push('Could not read RAM data: free memory');
	}
	if(!info.MemTotal) {
		errors.push('Could not read RAM data: total memory');
	}
	if(!info.Buffers) {
		errors.push('Could not read RAM data: buffers');
	}
	if(!info.Cached) {
		errors.push('Could not read RAM data: cached');
	}
	var free = info.MemFree || 0;
	var buffers = info.Buffers || 0;
	var cached = info.Cached || 0;
	var total = info.MemTotal || 0;
	free = free + buffers + cached;
	var used = total - free;

	var percent = (total > 0) ? (100 - Math.floor(free / total * 100)) : 0;

	return {
		used: utils.getSize(used*1024),
		free: utils.getSize(free*1024),
		total: utils.getSize(total*1024),
		percent_used: utils.getSize(percent)
	}
}



/**
 * Returns the boot up time
 *
 * @returns {array}  the time since last boot
 */
var getBootupTime = function() {
	var uptime = os.uptime();
	var date = new Date();
	date.setSeconds(date.getSeconds()-uptime);
	var m = date.getMonth()+1; //counts from 0
	if(m<10) {
		m = "0" + m;
	}
	var H = date.getHours();
	if(H<10) {
		H = "0" + H;
	}
	var i = date.getMinutes();
	if(i<10) {
		i = "0" + i;
	}
	var s = date.getSeconds();
	if(s<10) {
		s = "0" + s;
	}

	//I have no idea why this is an array, but it's easier to leave it...
	return {
		last_boot : date.getFullYear() + "-" + m + "-" +
			date.getDate() + " " + H + ":" + i + ":" + s
	}
}



/**
 * Returns the data about the system swap space
 *
 * @param {array} errors errors in this function are written to this array
 * @returns {array}  the swap data
 */
var getSwapData = function(errors) {
	var info = getMeminfo(errors);

	var free = info.SwapFree || 0;
	if(!info.SwapFree) {
		errors.push("Could not read swap data: free swap");
	}

	var total = info.SwapTotal || 0;
	if(!info.SwapFree) {
		errors.push("Could not read swap data: total swap");
	}

	var used = total-free;

	var percent = total === 0 ? 0 : (100 - Math.floor(free / total * 100));

	return {
		used: utils.getSize(used * 1024),
		free: utils.getSize(free * 1024),
		total: utils.getSize(total * 1024),
		"percent_used": percent
	}
}



/**
 * Returns the data about the network usage
 *
 * @param {array} errors errors in this function are written to this array
 * @returns {array}  the network data
 */
var getNetworkData = function(errors) {
	var datas = [];
	var ifaces = os.networkInterfaces();
	for(var iface in ifaces) {
		var info = {
			interface: iface,
			ip: ifaces[iface][0].address,
		}
		try {
			info.transmit = fs.readFileSync('/sys/class/net/' + iface + '/statistics/tx_bytes').toString().trim();
			info.receive = fs.readFileSync('/sys/class/net/' + iface + '/statistics/rx_bytes').toString().trim();
		} catch(err) {
			errors.push("Could not get network stats for" + iface);
			info.transmit = 0;
			info.receive = 0;
		}
		datas.push(info);
	}
	return datas;
}



/**
 * Returns the data about the disk usage
 *
 * @param {array} errors errors in this function are written to this array
 * @returns {array}  the disk data
 */
var getDiskData = function(errors) {
	var df = utils.runCommand('/bin/df -T | awk -v c=`/bin/df -T | grep -bo "Type" | awk -F: \'{print $2}\'` \'{print substr($0,c);}\' | tail -n +2 | awk \'{print $1","$2","$3","$4","$5","$6","$7}\'');
	var datas = [];
	if(!df.stdout) {
		errors.push("Could not get disk data");
		return {
			total:'N/A',
			used:'N/A',
			free:'N/A',
			"percent_used":0,
			mount:'N/A',
			filesytstem:'N/A'
		}
	}
	var mounts = [];
	var key = 0;
	var parsed = df.split('\n');
	for(var item in parsed) {
		var it = parsed[item];
		if(it.indexOf('tmpfs')) {
			continue;
		}

		it = it.split(',');
		for(var p in it) {
			//trim spaces
			it[p] = it[p].toString().trim();
			//convert numbers
			var sint = parseInt(it[p]).toString();
			if(sint===it[p]||sint+"%"===it[p]) {
				it[p] = sint;
			}
		}
		datas[item] = {
			total: utils.getSize(it[2] * 1024),
			used: utils.getSize(it[3] * 1024),
			free: utils.getSize(it[4] * 1024),
			"precent_used": it[5],
			mount: trim(it[6]),
			filesystem: trim(it[0])
		}
	}
	return datas;
}

module.exports = {
	getSystemHostname: hostname,
	getLanIp: getLanIp,
	getCpuCoresNumber: getCpuCoresNumber,
	getOperatingSystem: getOperatingSystem,
	getKernel: getKernel,
	getUptime: getUptime,
	getCpuModel: getCpuModel,
	getCpuFrequency: getCpuFrequency,
	getCpuCacheSize: getCpuCacheSize,
	getCpuTemperature: getCpuTemperature,
	getCpuLoadData: getCpuLoadData,
	getMeminfo: getMeminfo,
	getRamInfo: getRamInfo,
	getBootupTime: getBootupTime,
	getSwapData: getSwapData,
	getNetworkData: getNetworkData,
	getDiskData: getDiskData
}
