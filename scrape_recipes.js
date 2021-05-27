const puppeteer = require('puppeteer');

const options = {
    headless: false,
    defaultViewport: null,
    args: ['--window-size=1200,800'],
    executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
};

(async () => {

    try {

        // Launch Puppeteer
        console.log('Launching...');
        const browser = await puppeteer.launch(options);
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);

        console.log("Navigating to website.");
        // Go to Profession website
        await page.goto('https://tbc.wowhead.com/spells/professions/alchemy');

        // Wait for selector that holds the data we want to load.
        console.log("Waiting...");
        await page.waitForSelector('#lv-spells');
        console.log("Selector Loaded...");

        let recipe = await page.evaluate(() => {

            let recipeLink = document.querySelector('#lv-spells > div.listview-scroller-horizontal > div > table > tbody > tr:nth-child(2) > td:nth-child(2) > div > a').textContent;



            return recipeLink;

        });

        console.log(recipe);








        await browser.close();

    } catch (err) {
        console.log("Error: " + err);


    }

})();