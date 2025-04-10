import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

type ProductoReponer = {
  producto: string;
  stock: number;
};

type CategoriaValor = {
  categoria: string;
  valorCategoria: number;
};

// Función para limpiar el archivo CSV de líneas vacías
const limpiarCSV = (filePath: string) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const cleanedData = data.split('\n').filter(line => line.trim() !== '').join('\n');
    fs.writeFileSync(filePath, cleanedData, 'utf8');
  } catch (error) {
    console.error('Error al limpiar el archivo CSV', error);
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Llamar a la función limpiarCSV antes de procesar el archivo
  const filePath = path.join(process.cwd(), 'datos.csv');
  limpiarCSV(filePath);

  // Función para calcular el valor total del inventario por categoría
  const valorTotalInventario = (): { categorias: CategoriaValor[], total: number } => {
    let total = 0;
    let parcial = 0;
    let categoria = '';
    const categorias: CategoriaValor[] = [];

    try {
      const data = fs.readFileSync(filePath, 'utf8');
      const lines = data.split('\n');

      lines.forEach((line, index) => {
        const registros = line.split(',');

        if (index === 0) return; // Omitir la primera línea (cabeceras)
        if (index === 1) {
          categoria = registros[0];
        } else if (categoria !== registros[0]) {
          categorias.push({ categoria, valorCategoria: parcial });
          total += parcial;
          parcial = 0;
          categoria = registros[0];
        }
        parcial += parseInt(registros[2]) * parseInt(registros[3]);
      });

      categorias.push({ categoria, valorCategoria: parcial });
      total += parcial;

      return { categorias, total };
    } catch (error) {
      console.error('Error al leer el archivo', error);
      throw new Error('Error al leer el archivo');
    }
  };

  // Función para obtener productos con menos de 5 unidades en stock
  const reposicion = (): ProductoReponer[] => {
    const productosReponer: ProductoReponer[] = [];

    try {
      const data = fs.readFileSync(filePath, 'utf8');
      const lines = data.split('\n');

      lines.forEach((line, index) => {
        const registros = line.split(',');

        if (index === 0) return; // Omitir la primera línea (cabeceras)
        if (parseInt(registros[2]) < 5) {
          productosReponer.push({
            producto: registros[1],
            stock: parseInt(registros[2]),
          });
        }
      });

      return productosReponer;
    } catch (error) {
      console.error('Error al leer el archivo', error);
      throw new Error('Error al leer el archivo');
    }
  };

  try {
    if (req.method === 'GET') {
      const { categorias, total } = valorTotalInventario();
      const productosReponer = reposicion();

      res.status(200).json({ categorias, total, productosReponer });
    } else {
      res.status(405).json({ error: 'Método no permitido' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al generar los reportes' });
  }
}
