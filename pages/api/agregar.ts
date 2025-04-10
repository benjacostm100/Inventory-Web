import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const filePath = path.join(process.cwd(), 'datos.csv');

  if (req.method === 'POST') {
    const { tipo, nombre, precio, cantidad, categoria } = req.body;

    if (!tipo || !nombre) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    try {
      const data = fs.readFileSync(filePath, 'utf8');
      const lines = data.split('\n');

      let nuevaLinea = '';

      if (tipo === 'producto') {
        if (!precio || !cantidad || !categoria) {
          return res.status(400).json({ error: 'Faltan datos para agregar un producto' });
        }
        nuevaLinea = `${categoria},${nombre},${cantidad},${precio}`;
      } else if (tipo === 'categoria') {
        nuevaLinea = `${nombre},,,`;
      } else {
        return res.status(400).json({ error: 'Tipo no válido' });
      }

      // Agregar la nueva línea al archivo
      fs.appendFileSync(filePath, `\n${nuevaLinea}`);

      res.status(200).json({ message: `${tipo} agregado correctamente` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al agregar datos' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Método ${req.method} no permitido` });
  }
}
