const puppeteer = require('puppeteer');
const fsLibrary = require('fs');

//Read from file, seperate by a new line.
let textFile = fsLibrary.readFileSync("./recipe_urls/alchemy_urls.txt", 'utf-8');
let recipeUrls = textFile.split('\n');


const options = {
    headless: false,
    defaultViewport: null,
    args: ['--window-size=1200,800'],
    executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
};

(async () => {


    try {

        const browser = await puppeteer.launch(options);


        // Loop through all the recipe urls, opening and closing a new page for each.
        // for (let i = 0; i < recipeUrls.length; i++) {

        //     const page = await browser.newPage();
        //     await page.setDefaultNavigationTimeout(0);
        //     await page.goto(recipeUrls[i]);



        //     await page.close();

        // }

        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto('https://tbc.wowhead.com/spell=31444/black-belt-of-knowledge');


        let reagents = await page.evaluate(() => {

            // Gather the html nodes that hold the reagents data we need.
            let htmlNodes = Array.from(document.querySelectorAll('#icon-list-reagents > tbody > tr'));

            // Filter through the html nodes looking only for the ones which are currently being displayed.
            let filteredReagents = htmlNodes.filter(html => !html.outerHTML.includes('style="display:none"'));

            // Create a new array to hold the html strings of the reagents.
            let reagentStrings = filteredReagents.map((value) => {
                return value.outerHTML;
            })

            return reagentStrings;
        });



        function gatherReagentQuantity(reagent) {
            let quantityStartIndex = reagent.indexOf('quantity');
            let quantityEndIndex = reagent.indexOf('"><th');
            return reagent.substring(quantityStartIndex + 10, quantityEndIndex);
        }

        function gatherReagentName(reagent) {
            let nameEndIndex = reagent.lastIndexOf('</a>');
            let cutReagentString = reagent.substring(nameEndIndex - 60, nameEndIndex);
            let nameStartIndex = cutReagentString.indexOf('class="');

            return cutReagentString.substring(nameStartIndex + 11, nameEndIndex);

        }

        async function gatherReagentId() {

            let reagentId = await page.evaluate(() => {
                let href = document.querySelector('#spelldetails > tbody > tr:nth-child(7) > td > table > tbody > tr > td > span > a').getAttribute('href');
                let itemIdStartIndex = href.indexOf('item');
                let itemIdEndIndex = href.lastIndexOf('/');
                return href.substring(itemIdStartIndex + 5, itemIdEndIndex);
            });

            return reagentId;
        }


        console.log(await gatherReagentId());

        // Loop through the reagents array parsing the quantity numbers for each reagent.
        for (let i = 0; i < reagents.length - 1; i++) {

            console.log(gatherReagentQuantity(reagents[i]));
            console.log(gatherReagentName(reagents[i]));




        }



        await browser.close();



    } catch (err) {
        console.log("Error: " + err);


    } finally {
        process.exit(1);
    }

})();