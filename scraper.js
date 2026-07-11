const { chromium } = require("playwright");

async function buscarProduto(produto) {

    const browser = await chromium.launch({
        headless: true
    });

    const context = await browser.newContext({
        viewport: {
            width: 1366,
            height: 768
        },
        userAgent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
        locale: "pt-BR"
    });

    const page = await context.newPage();

    console.log("========================================");
    console.log("Pesquisando:", produto);

    const response = await page.goto(
        `https://lista.mercadolivre.com.br/${encodeURIComponent(produto)}`,
        {
            waitUntil: "domcontentloaded",
            timeout: 60000
        }
    );

    console.log("Status HTTP:", response ? response.status() : "sem resposta");
    console.log("URL Final:", page.url());
    console.log("Título:", await page.title());

    const html = await page.content();

    console.log("Primeiros 2000 caracteres do HTML:");
    console.log(html.substring(0, 2000));
    console.log("========================================");

    await page.waitForSelector(".poly-card", {
        timeout: 30000
    });

    const produtoEncontrado = await page.evaluate(() => {

        const card = document.querySelector(".poly-card");

        if (!card) return null;

        const nome =
            card.querySelector(".poly-component__title")?.innerText || "";

        const preco =
            card.querySelector(".andes-money-amount__fraction")?.innerText || "";

        const imagem =
            card.querySelector("img")?.src ||
            card.querySelector("img")?.getAttribute("data-src") ||
            "";

        const link =
            card.querySelector("a")?.href || "";

        return {
            nome,
            preco,
            imagem,
            link
        };

    });

    await browser.close();

    return produtoEncontrado;
}

module.exports = {
    buscarProduto
};
