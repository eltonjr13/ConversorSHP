document.getElementById("uploadForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const messageDiv = document.getElementById("message");
    messageDiv.innerText = "Processando...";

    const formData = new FormData();
    formData.append("zipFile", document.getElementById("zipFile").files[0]);

    try {
        const response = await fetch("/upload", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "output.kml"; // Nome padrão para o arquivo KML
            document.body.appendChild(a);
            a.click();
            a.remove();
            messageDiv.innerText = "Conversão concluída! O arquivo KML foi baixado.";
        } else {
            const errorText = await response.text();
            messageDiv.innerText = `Erro: ${errorText}`;
        }
    } catch (error) {
        messageDiv.innerText = `Erro: ${error.message}`;
    }
});
