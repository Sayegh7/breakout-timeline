#!/usr/bin/env node

// var lib = require('../lib/index.js');
// var utils = lib.storage;
var fs = require('fs');
var homeDir = require('home-dir');
var Datastore = require('nedb'),
    db = new Datastore({
        filename: homeDir('/breakout-timeline.db'),
        autoload: true
    });
switch (process.argv[2]) {
    case '-np':
        var doc = {
            project_name: process.argv[3],
            created: new Date().getTime(),
            features: [],
        };
        db.insert(doc, function(err, newDoc) { // Callback is optional
            if (err) throw err;
            console.log("Project created");
        });
        break;
    case '-nf':

        db.update({ project_name: process.argv[5]}, { $addToSet: { features: {feature_name: process.argv[3]} } }, {upsert: true}, function (err, docs) {
          if(err) throw err;
          if(docs === 0) return console.log("Project or feature do not exist");
          console.log("Feature Added");
        });
        break;

    case '-xf':
    db.update({ project_name: process.argv[5]}, { $pull: { features: {feature_name: process.argv[3]} } }, {}, function (err, docs) {
      if(err) throw err;
      if(docs === 0) return console.log("Project or feature do not exist");
      console.log("Feature Removed");
    });

        break;


    case '-hf':

    db.find({ project_name: process.argv[5]}, function (err, docs) {
      if(err) throw err;
      if(!docs) return console.log("Project or feature not found");
      var project = docs[0];
      var index = 0;
      for (var i = 0; i < project.features.length; i++) {
        if(project.features[i].feature_name === process.argv[3]){
          index = i;
          break;
        }
      }
      var feature = project.features[index];
      var lastEntry = feature[Object.keys(feature)[Object.keys(feature).length - 1]];
      if(lastEntry === "Paused"){
        return console.log("Entry is already held");
      }
      feature[new Date().getTime()] = "Paused";
      db.update({ project_name: process.argv[5]}, project, {}, function (err, newDoc) {
        if(err) throw err;
        console.log("Feature held");
      })
    });
        break;

    case '-rf':
    db.find({ project_name: process.argv[5]}, function (err, docs) {
      if(err) throw err;
      if(!docs) return console.log("Project or feature not found");
      var project = docs[0];
      var index = 0;
      for (var i = 0; i < project.features.length; i++) {
        if(project.features[i].feature_name === process.argv[3]){
          index = i;
          break;
        }
      }
      var feature = project.features[index];
      var lastEntry = feature[Object.keys(feature)[Object.keys(feature).length - 1]];
      if(lastEntry !== "Paused"){
        return console.log("Entry is already running");
      }
      feature[new Date().getTime()] = "Resumed";
      db.update({ project_name: process.argv[5]}, project, {}, function (err, newDoc) {
        if(err) throw err;
        console.log("Feature resumed");
      })
    });
        break;

    case '-lf':
    db.find({ project_name: process.argv[5]}, function (err, docs) {
      if(err) throw err;
      if(!docs) return console.log("Project or feature not found");
      var project = docs[0];
      var index = 0;
      for (var i = 0; i < project.features.length; i++) {
        if(project.features[i].feature_name === process.argv[3]){
          index = i;
          break;
        }
      }
      if(process.argv[6] !== "-m"){
        return console.log("You should add your message with a '-m' flag");
      }
      project.features[index][new Date().getTime()] = process.argv[7];
      db.update({ project_name: process.argv[5]}, project, {}, function (err, newDoc) {
        if(err) throw err;
        console.log("Logged message");
      })
    });
        break;
    case 'log':
      db.find({project_name: process.argv[3]}, function (err, docs) {
        if(err) throw err;
        if(!docs || docs.length === 0) return console.log("Project or feature not found");
        var project = docs[0];
        fs.writeFile(homeDir('/breakout-timeline.json'), JSON.stringify(project), function (err) {
          if (err) return console.log(err);
          console.log('Data written to breakout-timeline.json');
        });

      })
      break;

    default:
        console.log("Invalid flag");
}
