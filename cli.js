#!/usr/bin/env node

import minimist from "minimist";
import moment from "moment-timezone";
import fetch from "node-fetch";

const args = minimist(process.argv.slice(2))

if(args.h){
    console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
    -h            Show this help message and exit.
    -n, -s        Latitude: N positive; S negative.
    -e, -w        Longitude: E positive; W negative.
    -z            Time zone: uses tz.guess() from moment-timezone by default.
    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
    -j            Echo pretty JSON from open-meteo API and exit.`);
    process.exit(0);
}

const timezone = args.z || moment.tz.guess();
let lat = 0;
let long = 0;

if (args.n) {
    lat = args.n;
} else if (args.s) {
    lat = -args.s;
} else {
    console.log("Latitude must be specified");
    return;
}

if (args.e) {
    long = args.e;
} else if (args.w) {
    long = -args.w;
} else {
    console.log("Longitude must be specified.");
    return;
}

const days = Math.max(0, Math.min(args.d || 1, 6));

const response = await fetch(
    "https://open-meteo.com/en/docs#latitude=" + lat + "&longitude=" + long + "&hourly=temperature_2m,precipitation&daily=temperature_2m_max,temperature_2m_min,precipitation_hours&timezone=" + timezone
    );
const data = await response.json();
const dayMessage = days === 1 ? "today" : days === 1 ? "tomorrow" : 'in ' + days + ' days';

if (data.daily.precipitation_hours[days] !== 0) {
    console.log('You might need your galoshes ' + dayMessage + '.');
} else {
    console.log('You will not need your galoshes ' + dayMessage + '.');
}
