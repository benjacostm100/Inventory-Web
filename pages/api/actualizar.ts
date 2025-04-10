import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// Ruta al archivo de datos
const filePath = path.resolve('./datos.csv');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Lógica de búsqueda
    const { nombre } = req.query;

    if (!nombre) {
      return res.status(400).json({ error: 'Falta el parámetro "nombre"' });
    }

    try {
      const data = fs.readFileSync(filePath, 'utf8');
      const lines = data.split('\n');
      const productos: any[] = [];
      const categorias: any[] = [];

      lines.forEach((line) => {
        const [categoria, producto, cantidad, precio] = line.split(',');

        // Validar que los datos estén correctamente formateados
        if (producto && cantidad && precio) {
          // Buscar productos que coincidan con el nombre
          if (producto.toLowerCase().includes(nombre.toString().toLowerCase())) {
            productos.push({ categoria, nombre: producto, cantidad, precio });
          }

          // Buscar categorías que coincidan con el nombre
          if (categoria.toLowerCase().includes(nombre.toString().toLowerCase())) {
            categorias.push({ categoria, nombre: categoria });
          }
        }
      });

      res.status(200).json({ productos, categorias });
    } catch (error) {
      res.status(500).json({ error: 'Error al leer el archivo' });
    }
  } else if (req.method === 'POST') {
    // Lógica de actualización
    const { nombre, nuevoNombre, nuevaCantidad, nuevoPrecio } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: 'Falta el parámetro "nombre"' });
    }

    try {
      const data = fs.readFileSync(filePath, 'utf8');
      const lines = data.split('\n');
      let updated = false;
      let updatedData = '';

      lines.forEach((line) => {
        const [categoria, producto, cantidad, precio] = line.split(',');

        // Si encontramos el producto o categoría a actualizar
        if (producto === nombre || categoria === nombre) {
          // Modificamos los valores
          const newProduct = [
            categoria,
            nuevoNombre || producto,
            nuevaCantidad || cantidad,
            nuevoPrecio || precio,
          ].join(',');

          updatedData += newProduct + '\n';
          updated = true;
        } else {
          updatedData += line + '\n';
        }
      });

      if (!updated) {
        return res.status(404).json({ error: 'No se encontró el producto o categoría' });
      }

      // Escribir el archivo actualizado
      fs.writeFileSync(filePath, updatedData, 'utf8');
      res.status(200).json({ message: 'Actualización exitosa' });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el archivo' });
    }
  } else {
    // Si el método no es GET ni POST, respondemos con un error 405 (Method Not Allowed)
    res.status(405).json({ error: 'Método no permitido' });
  }
}
