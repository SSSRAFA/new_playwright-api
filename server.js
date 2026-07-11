const express = require("express");
const { buscarProduto } = require("./scraper");

const app = express();

app.get("/", (req, res) => {
    res.send("Playwright API funcionando!");
});

app.get("/search", async (req, res) => {

    const produto = req.query.produto;

    if (!produto) {
        return res.status(400).json({
            erro: "Informe o produto"
        });
    }

    try {

        const resultado = await buscarProduto(produto);

        res.json(resultado);

    } catch (e) {

        res.status(500).json({
            erro: e.message
        });

    }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {

    console.log(`Servidor iniciado na porta ${PORT}`);

});
