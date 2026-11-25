#!/usr/bin/env python3
"""
Genera il PDF di un preventivo a partire da un file JSON di dati,
usando il template grafico in template.html.jinja.

Uso:
    python3 genera_pdf.py dati.json [output.pdf]

Se non indichi output.pdf, il PDF viene salvato come
"Preventivo <numero> - <cliente>.pdf" nella stessa cartella.
"""
import json
import re
import sys
from pathlib import Path

from jinja2 import Environment, FileSystemLoader
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent


def slugify(text: str) -> str:
    text = re.sub(r"[^\w\s-]", "", text, flags=re.UNICODE).strip()
    return re.sub(r"[\s]+", " ", text)


def main():
    if len(sys.argv) < 2:
        print("Uso: python3 genera_pdf.py dati.json [output.pdf]")
        sys.exit(1)

    data_path = Path(sys.argv[1]).resolve()
    with open(data_path, encoding="utf-8") as f:
        data = json.load(f)

    if len(sys.argv) >= 3:
        output_path = Path(sys.argv[2]).resolve()
    else:
        cliente = slugify(data.get("cliente", {}).get("nome", "cliente"))
        numero = slugify(data.get("numero", ""))
        output_path = HERE / f"Preventivo {numero} - {cliente}.pdf"

    env = Environment(loader=FileSystemLoader(str(HERE)))
    template = env.get_template("template.html.jinja")
    html = template.render(**data)

    rendered_html_path = HERE / "_rendered_preview.html"
    rendered_html_path.write_text(html, encoding="utf-8")

    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path="/opt/pw-browsers/chromium", args=["--no-sandbox"])
        page = browser.new_page()
        page.goto(rendered_html_path.as_uri())
        page.pdf(
            path=str(output_path),
            format="A4",
            print_background=True,
            prefer_css_page_size=True,
        )
        browser.close()

    print(f"PDF generato: {output_path}")


if __name__ == "__main__":
    main()
