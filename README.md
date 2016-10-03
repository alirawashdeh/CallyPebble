# CallyPebble

CallyPebble is a Pebble smartwatch app that allows you to quickly add events to a Google calendar using speech.

This repository contains the code for the Pebble app, which communicates with Google to add an event to a specified calendar. Please note, this application is dependent on a [CallyPebble-Config](https://github.com/alirawashdeh/CallyPebble-Config) configuration server - see [here](https://github.com/alirawashdeh/CallyPebble-Config) for the source code.

## Configuration

Ensure that [CallyPebble-Config](https://github.com/alirawashdeh/CallyPebble-Config) is configured and deployed somewhere.

Modify the following part of the pebble-js-app.js file to include your Google Developer Client ID and the URL for the CallyPebble-Config application:

```
var client_id = "77e7a497276456d896a7";
var config_url = 'https://cally-pebble-config.herokuapp.com';
```

## Build and run

The easiest way to deploy your Pebble application is to sign up for a [CloudPebble](http://cloudpebble.com/) account. Make sure that the developer connection is running on your phone before deploying through CloudPebble.

```
$ cd CallyPebble
$ pebble build
$ pebble install --cloudpebble
```
