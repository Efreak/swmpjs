#!/usr/bin/env node
var fs = require('fs');
var ejs = require('ejs');
var express = require('express');
var system = require('./lib/system.js');
var morgan = require('morgan');

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
var app = express();

app.use(morgan('combined'));
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
		title: config.title,
		config: {
			title: config.title,
			theme: req.query && req.query.theme ? req.query.theme : config.theme,
			reload: config.reload,
			show_errors: config.errors
		}
	}
	res.render('index.ejs', data);
});
app.use(express.static('js'));
app.use(express.static('css'));
app.use(express.static('.',{extensions: ['svg','png','ico']}));
app.listen(parseInt(config.port),config.listen);
