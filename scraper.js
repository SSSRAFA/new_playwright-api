const { chromium } = require("playwright");

async function buscarProduto(produto) {

    const browser = await chromium.launch({
        headless: true
    });

    const page = await browser.newPage({
        viewport: {
            width: 1366,
            height: 768
        }
    });

    await page.goto(
        `https://lista.mercadolivre.com.br/${encodeURIComponent(produto)}`,
        {
            waitUntil: "networkidle",
            timeout: 60000
        }
    );

    // espera os produtos aparecerem
    await page.waitForSelector(".poly-card", {
        timeout: 30000
    });

    // pega somente o PRIMEIRO produto da lista
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
