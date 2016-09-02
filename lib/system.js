const os = require('os');
const utils = require('./utils');

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
	if(config.ip && config.ip.constructor===String) {
		return config.ip.constructor;
	}
	try {
		return os.networkInterfaces()[cfg.interface][0].address;
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
 * @param {array} errors errors in this function are written to this array
 * @returns {array}  the cpu load data
 */
/*
 * I have no idea how the rest of this works
 * I don't have a multi-core linux system handy (my server is single-core)
 * so I'll just return nothing for now
*/
var getCpuLoadData = function(errors) {
	errors.push("CPU load data could not be determined");
	return [0,0,0];
}

/*	var out = utils.runCommand('sh',['-c','cat /proc/loadavg | awk \'{print $1","$2","$3}\'']);
	if(!out.stdout) {
		errors.push("CPU load data could not be determined");
		return [0,0,0];
	}

	var cores = getCpuCoresNumber();
	var load_exp = out.stdout.split(',');
//original php resumes here
        $cpuloaddata = array_map(
            function ($value, $cores) {
                $v = (int)($value * 100 / $cores);
                if ($v > 100)
                    $v = 100;
                return $v;
            },
            $load_exp,
            array_fill(0, 3, $cores)
        );
    }
    return $cpuloaddata;
}
*/


//to be finished...
