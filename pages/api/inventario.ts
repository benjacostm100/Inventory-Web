// pages/api/inventario.ts
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

type Producto = {
  producto: string;
  cantidad: number;
  precio: number;
};

type Categoria = {
  categoria: string;
  productos: Producto[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const productos: Categoria[] = [];

  try {
    // Verifica si el archivo 'datos.csv' existe en la raíz del proyecto
    const filePath = path.join(process.cwd(), 'datos.csv');

    // Usar el método asíncrono para leer el archivo
    const data = await fs.promises.readFile(filePath, 'utf8');

    const lines = data.split('\n');
    let categoria = '';

    lines.forEach((line, index) => {
      const registros = line.split(',');

      if (index === 0) return; // Omitir la primera línea (cabeceras)

      if (categoria !== registros[0]) {
        categoria = registros[0];
        productos.push({ categoria, productos: [] });
      }

      productos[productos.length - 1].productos.push({
        producto: registros[1],
        cantidad: parseInt(registros[2]),
        precio: parseFloat(registros[3]),
      });
    });

    // Responder con el inventario procesado
    res.status(200).json(productos);
  } catch (error) {
    console.error('Error al leer el archivo:', error);
    res.status(500).json({ error: 'Error al leer el archivo' });
  }
}
