# CATch

## Description

This project involves creating a mini-game while learning the following technologies:

- TypeScript
- React Native for Web
- Webpack
- React Navigation
- Redux
- Maps JavaScript API

## How to Install and Run

Follow these steps:

1. Get a Maps JavaScript API key and replace `{KEY}` in index.html.
2. Run `yarn` to install the dependencies.
3. Run `yarn run serve` to start the development server hosted by Webpack.

## How to Use This App

This mini-game is about catching a cat that has run away somewhere in Dublin city.

**Start the Game**

![c1](https://github.com/user-attachments/assets/f7e52e79-f8b3-47e1-8da1-bab6119d2307)

Press the `START GAME` button. You will see a cat running away!

**Find the Cat**

![c2](https://github.com/user-attachments/assets/bb60a179-3b2e-4e99-9955-13fe0e4000a0)

Drag the marker around the Google map and try to find a suspicious marker. The hints shown on the map will let you know if you are getting close.

**Get inside Street View and CATch!**

![c3](https://github.com/user-attachments/assets/9d395b19-3517-4915-b223-017313212930)

After you find a suspicious marker, it will take you inside Street View. Try to find the cat, and when you do, click on it to catch it!

## Tech Notes

### How Long It Took to Create This App

27 hours, including brainstorming ideas, designing the game, and implementation.

### What Was Easy?

Using basic Google Maps features was easy. The API documentation provided clear instructions and code samples.

### What Was Difficult?

The latest Maps JavaScript API does not support markers in Street View. To display the markers, I needed to use absolute positioning with CSS. I used the [Street View Tour from Team Maps](http://teammaps.com) to implement this feature. This code calculates the distance from your viewpoint to the target place and generates x and y coordinates. Then it places the cat image in Street View using those coordinates with CSS. This runs every time the viewpoint changes.

### What I Learned

Through this project, I learned the following:

- How to set up React Native for Web with Webpack.
- How to set up React Navigation and React Native for Web.
- How to use the Maps JavaScript API.

### Future Work

I would like to add the following features:

- Include other countries.
- Refine the UI design.
- Add more gaming features, such as more cat characters, a time limit to find the cat, releasing multiple cats at once, and more.

## License

**MIT License**

Copyright © 2024 jiji

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation, the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

\*\*THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
