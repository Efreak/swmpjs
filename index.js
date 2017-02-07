#!/usr/bin/env node
var fs = require('fs');
var ejs = require('ejs');
var express = require('express');
var morgan = require('morgan');
var os = require('os');
var config = require('minimist')(process.argv.slice(2), {
	string: ["theme","listen","interface","port","title","reload"],
	boolean: "errors",
	default: {ip:"127.0.0.1",port:"8000",theme:"simplex",errors:false,title:"SWMPjs | {hostname}",interface:"eth0",reload:"60"},
	unknown:function(arg){
		console.log("Available arguments:");
		console.log("\t--errors\tfalse\tshow errors?.");
		console.log("\t--listen\t127.0.0.1\taddress to listen on");
		console.log("\t--theme\tsimplex\tpick a stylesheet from the css/themes directory");
		console.log("\t--port\t8000\tWhat port to listen on?");
		console.log("\t--interface\teth0\tWhat interface to report IP for?");
		console.log("\t--reload\t60\tHow often to refresh the page (in seconds)?");
	}
});

var system = require('./lib/system.js');

var app = express();

var getTitle = function(){
	return config.title.replace("{hostname}",os.hostname())
		.replace("{ip}",system.getLanIp([],config).join(" "))
		.replace("{os}",system.getOperatingSystem([]))
		.replace("{kernel}",system.getKernel([]));
}

app.use(morgan('combined'));
app.set('trust proxy', 'loopback,uniquelocal');
app.set('view engine','ejs');
app.get('/', function(req, res){
	var errors = [];
	var data = {
		hostname: system.getSystemHostname(errors),
		ip: system.getLanIp(errors,config),
		cores: system.getCpuCoresNumber(errors),
		os: system.getOperatingSystem(errors),
		kernel: system.getKernel(errors),
		uptime: system.getUptime(errors),
		bootTime: system.getBootupTime(errors),

		cpumodel: system.getCpuModel(errors),
		cpufrequency: system.getCpuFrequency(errors),
		cpucache: system.getCpuCacheSize(errors),
		cputemp: system.getCpuTemperature(errors),

		cpudata: system.getCpuLoadData(errors),

		ramdata: system.getRamInfo(errors),

		swap: system.getSwapData(errors),
		network: system.getNetworkData(errors),
		disk: system.getDiskData(errors),
		errors: errors,
		title: getTitle(),
		config: {
			theme: req.query && req.query.theme ? req.query.theme : config.theme,
			reload: config.reload,
			show_errors: config.errors
		}
	}
	res.render('index.ejs', data);
});
app.use('/js', express.static(__dirname+'/js'));
app.use('/css', express.static(__dirname+'/css'));
app.use('/', express.static(__dirname,{extensions: ['svg','png','ico']}));
app.listen(parseInt(config.port),config.listen);
