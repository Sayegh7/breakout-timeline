# breakout-timeline


[![npm
version](https://badge.fury.io/js/breakout-timeline.svg)](https://badge.fury.io/js/breakout-timeline)

A small time logging tool that uses NeDB to save the log locally

# Installation

```sh
$ npm install -g breakout-timeline
```
# Usage

Create a project
```sh
$ breakout-timeline -np <project-name>
```

Start a new feature in an existing project
```sh
$ breakout-timeline -nf <feature-name> -p <project-name>
```

Pause or hold feature in an existing project
```sh
$ breakout-timeline -hf <feature-name> -p <project-name>
```

Resume a paused feature in an existing project
```sh
$ breakout-timeline -rf <feature-name> -p <project-name>
```

Log a message related to a feature in an existing project
```sh
$ breakout-timeline -lf <feature-name> -p <project-name> -m <message>
```
