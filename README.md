# Angeloni Scraper

Este es un script en Node.js que utiliza **Playwright** para hacer scraping del sitio de Angeloni y extraer productos de la categoría **Bebidas / Refrigerante**.

Desarrollado por **Facundo Rodríguez** como parte de un challenge técnico.

---

## Características

- Usa **Playwright** para automatizar la carga y scroll de productos.
- Extrae información como nombre, precio, imagen, URL y categoría.
- Permite definir cuántos productos se desean obtener.
- Incluye manejo de errores y logs informativos.
- Sobrescribe el array de productos en cada iteración para mantener siempre los últimos cargados.

---

## Instalación

1. Clonar el repositorio o copiar los archivos en tu proyecto local.
2. Ejecutar en la terminal:

```bash
npm install
```

Esto instalará las dependencias definidas en `package.json`:

- `axios`
- `cheerio`
- `playwright`

---

## Uso

Ejecutá el script con el siguiente comando:

```bash
npm start
```

Por defecto, el script scrapea la URL:

```
https://www.angeloni.com.br/super/bebidas/refrigerante
```

y busca **20 productos**.

Podés modificar ese valor cambiando este bloque en `evaluation_spider.js`:

```js
const scrapingInput = {
  url: 'https://www.angeloni.com.br/super/bebidas/refrigerante',
  productsCount: 20
};
```

---

## Salida esperada

El script imprime por consola:

- La cantidad de productos encontrados.
- Un aviso si no se llegó a la cantidad solicitada.
- Un array con los datos de los productos (hasta la cantidad requerida).

---

## Consideraciones

- El scroll automático se repite hasta que no se cargan más productos.
- Solo se mantiene la última carga de productos (no se concatena).
- Si el sitio cambia su estructura (por ejemplo, clases CSS o estructura DOM), el selector puede dejar de funcionar.

---

## Licencia

MIT

---

**Autor:** Facundo Rodríguez  
**Email:** (podés agregarlo si querés)