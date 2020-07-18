# MediaToAscii - Convert images and videos to ASCII art!

This repository aims to provide a very needed, very important service: converting images and videos to ASCII art!

## Goals

* Public website [TODO]
* Public API [WIP]
* CLI version [WIP]

## Setup

If you want to help, or download and test this yourself, you're going to want to follow these instructions.

### Requirements

* [Node.JS](https://nodejs.org/en/) (v12 should be fine)
* ffmpeg ([Win](https://windowsloop.com/install-ffmpeg-windows-10/), [Linux](https://www.ostechnix.com/install-ffmpeg-linux/), [Mac](https://sites.duke.edu/ddmc/2013/12/30/install-ffmpeg-on-a-mac/))
  * I don't own a Mac, so if the instructions are wrong... figure it out yourself I guess

### Setting up the...

#### Base:

To setup the base program, just run `npm install` in the main project directory.

#### API:

1. `node api/api`

#### CLI

1. TODO

#### Frontend

1. TODO

## Using the API

There are currently two endpoints, `/image` and `/video`.

### /image
To use the `/image` endpoint, you must send a `form-data` request with an image attached, and optionally a resolution to convert to.

Example:

![Image from Postman](https://pasteboard.co/JibR3Nd.jpg)

### /video

TODO
