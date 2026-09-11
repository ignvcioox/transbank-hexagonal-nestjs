# Transbank Hexagonal

Demo de integración de **Webpay Plus** con **NestJS**, utilizando arquitectura hexagonal.

Permite crear y confirmar pagos en el ambiente de integración de Transbank.

## Tecnologías

- NestJS
- TypeScript
- Transbank SDK
- HTML, CSS y JavaScript

## Instalación

```bash
npm install
```

## Configuración

Crea un archivo `.env` utilizando `.env.example`:

```env
PORT=3000
APP_URL=http://localhost:3000

TRANSBANK_ENVIRONMENT=integration

TRANSBANK_COMMERCE_CODE=
TRANSBANK_API_KEY=
```

## Ejecución

```bash
npm run start:dev
```

Abre en el navegador:

```text
http://localhost:3000
```

## Tarjeta de prueba

- **Número:** `4051 8856 0044 6623`
- **Vencimiento:** `12/30`
- **CVV:** `123`
- **RUT:** `11.111.111-1`
- **Clave:** `123`

> Estos datos funcionan únicamente en el ambiente de integración de Transbank.
