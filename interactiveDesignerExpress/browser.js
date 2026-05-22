const puppeteer = require("puppeteer");

let browserPromise = null;

async function getBrowser() {
    if (browserPromise) {
        try {
            const browser = await browserPromise;
            if (browser && browser.isConnected()) {
                return browser;
            }
        } catch (err) {
            browserPromise = null;
        }
    }

    browserPromise = puppeteer.launch({
        headless: "new",
        ignoreHTTPSErrors: true,
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--disable-extensions",
            "--no-first-run",
            "--disable-background-networking",
            "--disable-background-timer-throttling",
            "--disable-renderer-backgrounding",
            "--disable-features=Translate,BackForwardCache",
            "--font-render-hinting=medium",
        ],
    }).catch((err) => {
        browserPromise = null;
        throw err;
    });

    const browser = await browserPromise;

    browser.on("disconnected", () => {
        browserPromise = null;
    });

    return browser;
}

module.exports = getBrowser;
