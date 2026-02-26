# ReceiptService

Servicio para la gestión de boletas (comprobantes de pago) en el sistema.

## Responsabilidades
- Carga de imágenes de boletas al almacenamiento de Supabase (bucket `receipts`).
- Creación de registros de boletas asociados a hogares.
- Vinculación de boletas con transacciones financieras.
- Procesamiento OCR de boletas utilizando IA (Gemini).

## Métodos Principales

| Método | Descripción |
|--------|-------------|
| `uploadReceiptImage` | Sube un archivo al bucket `receipts` organizado por `household_id`. |
| `createReceipt` | Crea un registro de boleta en la base de datos. |
| `updateReceiptProcessed` | Actualiza una boleta existente con merchant, raw_ocr_data y status `processed`. |
| `createReceiptItems` | Inserta líneas de ítems en `receipt_items` para una boleta. |
| `getReceipts` | Lista boletas filtradas por hogar, transacción o estado. |
| `processOcr` | Invoca la Edge Function `scan-receipt-inventory` para extraer monto, fecha y comercio. |
| `linkReceiptToTransaction` | Asocia una boleta ya subida con una transacción existente. |

## Integración con IA
Anteriormente utilizaba `ocr-receipt` (Google Vision API). Actualmente utiliza `scan-receipt-inventory` (Gemini Flash) para una mejor precisión y menores costos.
