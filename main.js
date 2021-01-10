const puppeteer = require('puppeteer');
const epub = require('epub-gen');
const path = require('path');
const performance = require('perf_hooks').performance;

if (process.argv.length < 3) {
    console.log("Please provide a story ID (required) and download path (optional).");
    process.exit(0);
}

const storyId = process.argv[2];
const url = `https://www.fanfiction.net/s/${storyId}`;

var downloadLocation = '';
if (process.argv.length > 3) {
    downloadLocation = `${process.argv[3]}${path.sep}`;
}

(async () => {
    var browser;
    try {
        let userAgent = '';

        let commencementTimeInMs = performance.now();

        const sections = [];
        let section = {};

        let storyName = '';
        let authorName = '';
        let numberOfChapters = 1;

        for (var chaptersScraped = 0; chaptersScraped < numberOfChapters; ++chaptersScraped) {
            let currentChapter = chaptersScraped + 1;

            browser = await puppeteer.launch(); // need to open a new browser instance at every pass due to Cloudflare restrictions
            if (currentChapter == 1) {
                userAgent = await browser.userAgent();
            }
            let page = await browser.newPage();
            page.setUserAgent(userAgent.replace('Headless', '')); // since Cloudflare is blocking headless Chrome, remove 'Headless' from UA header value
            await page.goto(`${url}/${currentChapter}`, { waitUntil: 'load' });

            if (currentChapter == 1) {
                console.log("Gathering metadata...");

                // Scrape story name
                storyName = await page.evaluate(async () => {
                    while (document.querySelectorAll('b.xcontrast_txt').length === 0) {
                        console.log("Waiting out Cloudflare advanced DDoS check...");
                        await new Promise(resolve => setTimeout(resolve, 5000));
                    }
                    return document.querySelectorAll('b.xcontrast_txt')[0].innerText;
                });
                console.log(`Title of the story: ${storyName}`);

                // Scrape author name
                authorName = await page.evaluate(() => {
                    return document.querySelectorAll('a.xcontrast_txt')[2].innerText;
                });
                console.log(`Name of the author: ${authorName}`);

                // Scrape number of chapters
                numberOfChapters = await page.evaluate(() => {
                    if (document.getElementById("chap_select") === null) {
                        return 1;
                    }
                    return document.getElementById("chap_select").length;
                });
                console.log(`Number of chapters: ${numberOfChapters}`);

                // Scrape cover page contents
                let coverPageHtml = await page.evaluate(() => {
                    let cover = document.getElementById("profile_top");

                    let coverSpans = cover.getElementsByTagName('span');
                    coverSpans[0].parentNode.removeChild(coverSpans[0]); // remove thumbnail

                    let coverButtons = cover.getElementsByTagName('button');
                    coverButtons[0].parentNode.removeChild(coverButtons[0]); // remove Follow/Fav button

                    return cover.innerHTML;
                });

                // Add cover page contents to ebook sections
                section = {
                    title: 'Cover Page',
                    data: coverPageHtml
                };
                sections.push(section);
            }

            // Scrape chapters 1 to n
            console.log(`Downloading Chapter ${currentChapter}: ${url}/${currentChapter}`);
            let chapterTitle = await page.evaluate(async () => {
                while (document.querySelectorAll('b.xcontrast_txt').length === 0) {
                    console.log("Waiting out Cloudflare advanced DDoS check...");
                    await new Promise(resolve => setTimeout(resolve, 5000));
                }
                let chapterTitles = document.getElementById("chap_select");
                if (chapterTitles === null) {
                    return "One";
                }
                return chapterTitles.options[chapterTitles.selectedIndex].text;
            });
            let chapterHtml = await page.evaluate(() => {
                let chapter = document.getElementById("storytext");
                let adContainers = chapter.getElementsByTagName('div');
                while (adContainers[0]) {
                    adContainers[0].parentNode.removeChild(adContainers[0]); // remove ad. containers
                }
                return chapter.innerHTML;
            });

            // Add chapter contents to ebook sections
            section = {
                title: `Chapter ${chapterTitle}`,
                data: chapterHtml
            };
            sections.push(section);

            await page.close();
            await browser.close();

            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Build the ebook
        const pathToDownloadedFile = `${downloadLocation}${storyName} - ${authorName}.epub`;
        const options = {
            title: storyName,
            author: authorName,
            output: pathToDownloadedFile,
            content: sections
        };
        new epub(options).promise.then(() => console.log(`Fanfiction downloaded: ${pathToDownloadedFile}`));

        let completionTimeInMs = performance.now();
        let processingTimeInMs = completionTimeInMs - commencementTimeInMs;
        console.log(`Time taken to download story: ${(processingTimeInMs / 1000).toFixed(1)} seconds`);
        return Promise.resolve('Request completed successfully.');
    } catch (error) {
        console.error(`Error: ${error.message}. Please contact github.com/ishaniray if the issue persists.`);
        return Promise.resolve('Request completed with errors.');
    } finally {
        if (typeof browser !== 'undefined') {
            await browser.close();
        }
    }
})().then((status) => {
    console.log(status);
});
