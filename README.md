# ConversorSHP
# Conversor SHP para KML

Um simples conversor de arquivos que permite a conversão de arquivos SHP (Shapefile) em arquivos KML (Keyhole Markup Language) através do upload de um arquivo ZIP que contém os arquivos SHP e DBF.

## Tecnologias Utilizadas

- **Node.js**: Para o backend.
- **Express**: Framework web para Node.js.
- **express-fileupload**: Middleware para manipulação de uploads de arquivos.
- **AdmZip**: Biblioteca para manipulação de arquivos ZIP.
- **shapefile**: Biblioteca para leitura de arquivos SHP.
- **geojson-to-kml**: Biblioteca para conversão de GeoJSON para KML.

## Funcionalidades

- Upload de arquivos ZIP contendo arquivos SHP e DBF.
- Conversão de arquivos SHP em KML.
- Download automático do arquivo KML convertido.

## Pré-requisitos

Antes de executar o projeto, verifique se você tem o Node.js instalado na sua máquina. Você pode baixar o Node.js em [nodejs.org](https://nodejs.org/).

## Instalação

1. Clone este repositório:


   ```bash
   git clone https://github.com/eltonjr13/ConversorShp
   cd ConversorShp
