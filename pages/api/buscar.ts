import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import * as readline from 'readline';

interface Producto {
  categoria: string;
  nombre: string;
  stock: number;
  precio: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { nombre } = req.query;

  if (!nombre || typeof nombre !== 'string') {
    return res.status(400).json({ error: 'Falta el parámetro "nombre"' });
  }

  try {
    const filePath = path.resolve('./datos.csv');
    const fileStream = fs.createReadStream(filePath);

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    const resultados: Producto[] = [];
    const nombreBusqueda = nombre.toLowerCase();

    for await (const line of rl) {
      const registros = line.split(',');

      if (registros.length >= 4) {
        const [categoria, nombreProducto, stock, precio] = registros;

        if (
          categoria.toLowerCase().includes(nombreBusqueda) ||
          nombreProducto.toLowerCase().includes(nombreBusqueda)
        ) {
          resultados.push({
            categoria: categoria.trim(),
            nombre: nombreProducto.trim(),
            stock: parseInt(stock.trim(), 10),
            precio: parseFloat(precio.trim()),
          });
        }
      }
    }

    return res.status(200).json({ resultados });
  } catch (error) {
    console.error('Error al leer el archivo:', error);
    return res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
}
