# AsciiVert - Convert images and videos to ASCII art!

This repository aims to provide a very needed, very important service: converting images and videos to ASCII art!

## Goals

* Public website [WIP]
* Public API [Done]
* CLI version [WIP]

## Setup

The website poses some retrictions that, if you use the CLI version as an alternative, you can bypass and create larger images and longer videos from.

### Requirements

* [Node.JS](https://nodejs.org/en/) (v12 should be fine)
* ffmpeg ([Win](https://windowsloop.com/install-ffmpeg-windows-10/), [Linux](https://www.ostechnix.com/install-ffmpeg-linux/), [Mac](https://sites.duke.edu/ddmc/2013/12/30/install-ffmpeg-on-a-mac/))
  * I don't own a Mac, so if the instructions are wrong... figure it out yourself I guess

### Setting up the project

To setup the base of the project, just run `npm install` in the main project directory.
To start up the api/website, run `node api/api`.
To use the CLI version, TODO

## Using the API

There are currently two endpoints, `/image` and `/video`.

### /image
To use the `/image` endpoint, you must send a `form-data` POST request with an image attached in the `files` field, and a resolution to convert to.

Example:

![postman](https://i.paste.pics/5a00b4edf2b8f6ff3020ec21da21bdb5.png?trs=7c74ea5877599d9b712bc0a138239b8f75236e1ccae520c4cb95ae3fa4bf98ff)

### /video

To use the `/video` endpoint, you must send a `form-data` POST request with a video file in the `files` field, a resolution, and a framerate.

Example:

![postman](https://user-images.githubusercontent.com/25207995/87893157-dec66000-c9f3-11ea-8780-76aac017c9b1.png)

### /mini

Using the `/mini` endpoint is similar to the `/image` endpoint in that you only need to supply an image and resolution, but the resolution limit is smaller and it returns raw text instead.

Example:

![postman](https://user-images.githubusercontent.com/25207995/87893303-5d230200-c9f4-11ea-9dc0-1c7d9d8b24c9.png)

### /file

When using the `/image` or `/video` endpoints, the request will immediately return a file ID. While the file may not be ready immediately, when it is, you can GET the `/file` endpoint with a `id` URI parameter (eg. `/file?id=1234`).

Example:

![postman](https://user-images.githubusercontent.com/25207995/87893495-f0f4ce00-c9f4-11ea-9596-c6a905a3bcce.png)
