# fanfic-dl
 An open-source command-line utility to download stories from fanfiction.net under Cloudflare restrictions using Puppeteer.

### Background
 Currently all FFnet downloaders are broken due to FFN adding Cloudflare protection to their site. The one I've been using all these years (the best solution out there, in my opinion) - _ficsave.xyz_ (https://github.com/waylaidwanderer/FicSave) - might take a bit of time to figure out how to bypass these restrictions (https://twitter.com/FicSave/status/1340421325366546432). Until then, I want to have a way to download multi-chapter stories without needing to manually copy-paste text or generate PDFs chapter-by-chapter. I'm still learning JavaScript / Node and this tool is the result of only half a day's work, so this is in no way as robust or elegant as the other solutions out there (the process is actually quite slow and brute-force-y.). However, I believe this Puppetter-based option is worth having until we find a truly programmatic workaround.

### Usage
 **After cloning the repo and installing the package.json dependencies, from a terminal window, run:**

 node main.js <story-id> <download-location>

 Example (on a Windows computer): _node main.js 13768498 C:\Users\ishaniray\Desktop_

 [Note: <download-location> is an optional argument. If not provided, the story will be downloaded to the project's root folder.]

 ### Future Scope
 I have not been able to make headless Puppeteer work with the code I have currently. While this doesn't hamper the tool's functionality, visually, I feel having a Chromium window pop up and close every two seconds for as many times as there are number of chapters in the story, is a bit jarring. I plan to work on this - and maybe even a more permanent, efficient solution - soon.

 Comments / suggestions are welcome!
