import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const filePath = path.join(process.cwd(), 'datos.csv');

  if (req.method === 'POST') {
    const { accion, tipo, nombre } = req.body;

    if (!tipo || !nombre || !accion) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    try {
      const data = fs.readFileSync(filePath, 'utf8');
      const lines = data.split('\n');

      if (accion === 'buscar') {
        // Verificar si el producto o categoría existe
        const existe = lines.some((line) => {
          const [categoria, producto] = line.split(',');
          return tipo === 'producto' ? producto === nombre : categoria === nombre;
        });

        if (!existe) {
          return res.status(404).json({ error: `${tipo} no encontrado` });
        }

        return res.status(200).json({ message: `${tipo} encontrado` });
      }

      if (accion === 'eliminar') {
        // Eliminar el producto o categoría
        const filteredLines = lines.filter((line) => {
          const [categoria, producto] = line.split(',');
          return tipo === 'producto' ? producto !== nombre : categoria !== nombre;
        });

        fs.writeFileSync(filePath, filteredLines.join('\n'));
        return res.status(200).json({ message: `${tipo} eliminado correctamente` });
      }

      return res.status(400).json({ error: 'Acción no válida' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Método ${req.method} no permitido` });
  }
}
