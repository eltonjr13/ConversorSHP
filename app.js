const express = require("express");
const shapefile = require("shapefile");
const geojsonToKml = require("geojson-to-kml");
const fs = require("fs");
const AdmZip = require("adm-zip");
const path = require("path");
const fileUpload = require("express-fileupload");

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(fileUpload());

// Função para converter SHP para KML
async function convertShpToKml(zipFilePath) {
    try {
        const zip = new AdmZip(zipFilePath);
        const zipEntries = zip.getEntries();
        let shpFilePath, dbfFilePath;

        zipEntries.forEach(entry => {
            if (entry.entryName.endsWith('.shp')) {
                shpFilePath = entry.entryName;
            } else if (entry.entryName.endsWith('.dbf')) {
                dbfFilePath = entry.entryName;
            }
        });

        if (!shpFilePath || !dbfFilePath) {
            throw new Error('Arquivos .shp e .dbf não encontrados no ZIP.');
        }

        const tempDir = path.join(__dirname, 'temp');
        fs.mkdirSync(tempDir, { recursive: true });
        zip.extractAllTo(tempDir, true);

        const geojson = await shapefile.read(path.join(tempDir, shpFilePath), path.join(tempDir, dbfFilePath));
        const kml = geojsonToKml(geojson);

        // Gerar o nome do arquivo de saída baseado no nome do ZIP
        const kmlFileName = path.basename(zipFilePath, '.zip') + '.kml';
        const outputKmlPath = path.join(tempDir, kmlFileName); // Armazenar no temp dir

        // Salvar o KML em um arquivo
        fs.writeFileSync(outputKmlPath, kml);

        return outputKmlPath; 
    } catch (error) {
        throw new Error("Erro durante a conversão: " + error.message);
    }
}

// Rota para upload e conversão
app.post("/upload", async (req, res) => {
    if (!req.files || !req.files.zipFile) {
        return res.status(400).send("Nenhum arquivo ZIP foi enviado.");
    }

    const zipFile = req.files.zipFile;
    const zipFilePath = path.join(__dirname, zipFile.name);
    
    // Salvar o arquivo ZIP temporariamente
    zipFile.mv(zipFilePath, async (err) => {
        if (err) return res.status(500).send(err);

        try {
            const kmlPath = await convertShpToKml(zipFilePath);

            // Gerar o nome do arquivo KML baseado no nome do ZIP
            const kmlFileName = path.basename(zipFile.name, '.zip') + '.kml';

            res.download(kmlPath, kmlFileName, (err) => { // Passar o nome do KML aqui
                if (err) {
                    console.error(err);
                }
                // Remover o arquivo ZIP e KML temporários após o download
                fs.unlinkSync(zipFilePath);
                fs.unlinkSync(kmlPath);
            });
        } catch (error) {
            res.status(500).send(error.message);
        }
    });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
