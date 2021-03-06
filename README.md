# fanfic-dl
 An open-source command-line utility to download stories from fanfiction.net under Cloudflare restrictions using Puppeteer and epub-gen.

### Background
 Currently (as on 2021-01-17), most FFnet downloaders are broken due to FFN adding Cloudflare protection to their site. The one I've been using all these years - _ficsave.xyz_ (https://github.com/waylaidwanderer/FicSave) - might take a bit of time to figure out how to bypass these restrictions (https://twitter.com/FicSave/status/1340421325366546432). Until then, I want to have a way to download multi-chapter stories without needing to manually copy-paste text or generate PDFs chapter-by-chapter. I'm still learning JavaScript / Node and this tool is the result of only half a day's work, so this is in no way as robust or elegant as the other solutions out there (the process is actually quite slow and brute-force-y.). However, I believe this Puppetter-based option is worth having until we find a truly programmatic workaround.

### Usage
 **After cloning the repo and installing the package.json dependencies, from a terminal window, run:**

    node main.js <-story-id-> <-download-location->

 **Example (on a Windows computer):**

    node main.js 13768498 C:\Users\ishaniray\Desktop

 [Note: _<-download-location->_ is an optional argument. If not provided, the story will be downloaded to the project's root folder.]

 Comments / suggestions are welcome!
