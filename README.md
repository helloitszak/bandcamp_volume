# Bandcamp Volume

A browser extension to add a volume slider to most [Bandcamp](https://bandcamp.com) pages.

## Installation
Install this extension for
[Chrome / Chromium](https://chrome.google.com/webstore/detail/bandcamp-volume/nlikaonifbagdlcjoepofomefchkahab)

## Background
I browse Bandcamp a lot for albums which uses an html5 based audio player. This player, however, lacks any form of volume control. When asked about it, Bandcamp responded with the following:

From the old Bandcamp FAQ page:
> There isn't one. If your fans want to change the volume of the audio on Bandcamp, they adjust their computer's volume -- simple as that. We're not trying to build the ultimate platform for them to stream your albums while they play World of Warcraft in another window (which we completely agree would require an independent volume control). The streams on Bandcamp are there so visitors can listen to your music, decide if they like it, and if so, download it. Nothing more.

## Contributing
You can test or develop by cloning the repository and simply loading it into
your browser as an unpackaged extention from `chrome://extensions/`, or in
Firefox, `about:debugging`.

Feel free to send pull requests with bug fixes, new features etc.
Please make sure it passes [ESLint](https://eslint.org/) before submitting the PR.

## Changelog

### Version 2.0

- [[josh-bridge](https://github.com/josh-bridge)] Added options page
- [[josh-bridge](https://github.com/josh-bridge)] Volume slider now controls every audio player on a page
- [[josh-bridge](https://github.com/josh-bridge)] Changed Extension Icon set to new logo
- [[josh-bridge](https://github.com/josh-bridge)] Code improvements & comments
- [[josh-bridge](https://github.com/josh-bridge)] Fixed slider not appearing on home page
- [[josh-bridge](https://github.com/josh-bridge)] Fixed slider not changing audio volume on home page (Issue #3)
- [[josh-bridge](https://github.com/josh-bridge)] Volume slider now changes audio volume while being dragged (not just when user lets go of the slider)
- [[josh-bridge](https://github.com/josh-bridge)] Added new CSS stylesheet for easier style management
- [[josh-bridge](https://github.com/josh-bridge)] Changed style & position of volume slider on album page & home pages
- [[josh-bridge](https://github.com/josh-bridge)] Added speaker icon with mute/unmute functionality (Speaker icon changes on volume level)

## Known Limitations
- The extension can't operate on custom domains without having the `<all_urls>`
  permission and running on every page, or having a list of every bandcamp
  custom domain.
- The volume slider does not work on the compact UI yet (only album pages don't
  work, It will work on other pages such as the home page). When you make the
  page smaller, the volume bar does not show up on the compact UI.

## License
All source code in this project are licensed under the MIT license.

Copyright © 2013 Zak Kristjanson.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the “Software”), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

## Trademarks
Bandcamp and Bandcamp.com are Copyright © Bandcamp, Inc.
