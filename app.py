import re
import os
def agregar_producto(categoria, producto, cantidad, precio):
    try:
        archivo = open(r"datos.csv", "rt")
        archivonuevo = open(r"datos2.csv", "wt")
        categoria = categoria.lower()
        producto = producto.lower()
        repetido = False
        for datos in archivo:
            linea = datos.rstrip('\n')
            registros = linea.split(',')
            if producto == registros[1]:
                print("El producto ya existe")
                repetido = True
                break
        if not repetido:
            archivo.seek(0)
            for datos in archivo:
                linea = datos.rstrip('\n')
                registros = linea.split(',')
                if categoria == registros[0] and not repetido:
                    if producto < registros[1]:
                        archivonuevo.write(categoria + ',' + producto + ',' + cantidad + ',' + precio + '\n')
                        archivonuevo.write(datos)
                        repetido = True
                    else:
                        archivonuevo.write(datos)
                else:
                    archivonuevo.write(datos)
            if not repetido:
                archivonuevo.write('\n' + categoria + ',' + producto + ',' + cantidad + ',' + precio)
            archivo.close()
            archivonuevo.close()
            os.remove(r"datos.csv")
            os.rename(r"datos2.csv",r"datos.csv")
    except FileNotFoundError as mensaje:
        print("file not found", mensaje)
    except OSError as mensaje:
        print("error", mensaje)
    except PermissionError as mensaje:
        print("no hay permisos para modificar archivo")
    finally:
        try:
            archivo.close()
            archivonuevo.close()
        except NameError:
            pass
def consultar_inventario():
    print("\nInventario actual:")
    try:
        archivo = open(r"datos.csv", "rt")
        for indice, datos in enumerate(archivo):
            if indice == 0:
                categoria = ""
                continue
            linea = datos.rstrip('\n')
            registros = linea.split(',')
            if indice == 1:
                categoria = registros[0]
                print()
                print(f" Categoría: {categoria.title()} ".center(65, '-'))
                print()
                print("-- Producto --".center(35, ), end="")
                print("-- Cantidad --".center(15), end="")
                print("-- Precio --".center(15))
                print(f"{registros[1].title()}".center(35), end="")
                print(f"{registros[2]}".center(15), end="")
                print(f"${registros[3]}".center(15))
                continue
            elif categoria != registros[0]:
                categoria = registros[0]
                print()
                print(f" Categoría: {categoria.title()} ".center(65, '-'))
                print()
                print("-- Producto --".center(35, ), end="")
                print("-- Cantidad --".center(15), end="")
                print("-- Precio --".center(15))
            print(f"{registros[1].title()}".center(35), end="")
            print(f"{registros[2]}".center(15), end="")
            print(f"${registros[3]}".center(15))
        print()
    except FileNotFoundError as mensaje:
        print("file not found", mensaje)
    except OSError as mensaje:
        print("error", mensaje)
    finally:
        try:
            archivo.close()
        except NameError:
            pass
def eliminar_producto(producto):
    try:
        archivo = open(r"datos.csv", "rt")
        archivonuevo = open(r"datos2.csv", "wt")
        producto = producto.lower()
        eliminado = False
        for datos in archivo:
            linea = datos.rstrip('\n')
            registros = linea.split(',')
            if re.findall(f".*{producto}.*", registros[1]) and not eliminado:
                confirmacion = input(f"Queres eliminar el producto: {registros[1]} (si/no)")
                if confirmacion.lower() == "si":
                    eliminado = True
                    continue
                else:
                    archivonuevo.write(datos)
            else:
                archivonuevo.write(datos)
        if eliminado:
            print(f"Producto {producto} eliminado con éxito.")
        else:
            print(f"Error: El producto {producto} no existe.")
    except FileNotFoundError as mensaje:
        print("file not found", mensaje)
    except OSError as mensaje:
        print("error", mensaje)
    except PermissionError as mensaje:
        print("no hay permisos para modificar archivo")
    finally:
        try:
            archivo.close()
            archivonuevo.close()
            os.remove(r"datos.csv")
            os.rename(r"datos2.csv",r"datos.csv")
        except NameError:
            pass
def actualizar_producto(producto):
    producto = producto.lower()
    try:
        archivo = open(r"datos.csv", "rt")
        archivonuevo = open(r"datos2.csv", "wt")
        cambio = False
        for datos in archivo:
            linea = datos.rstrip('\n')
            registros = linea.split(',')
            if re.findall(f".*{producto}.*", registros[1]) and not cambio:
                confirmacion = input(f"Queres modificar el producto: {registros[1]} (si/no)")
                if confirmacion.lower() == "si":
                    nueva_cantidad = input("Ingrese la nueva cantidad (deje en blanco si no desea actualizar): ")
                    nuevo_precio = input("Ingrese el nuevo precio (deje en blanco si no desea actualizar): ")
                    nueva_cantidad = nueva_cantidad if nueva_cantidad else None
                    nuevo_precio = nuevo_precio if nuevo_precio else None
                    if nueva_cantidad == None:
                        nueva_cantidad = registros[2]
                    if nuevo_precio == None:
                        nuevo_precio = registros[3]
                    archivonuevo.write(registros[0] + ',' + registros[1] + ',' + nueva_cantidad + ',' + nuevo_precio + '\n')
                    cambio = True
                else:
                    archivonuevo.write(datos)
            else:
                archivonuevo.write(datos)
        if cambio:
            print(f"Producto {producto} actualizado con éxito.")
        else:
            print(f"Error: El producto {producto} no existe.")
    except FileNotFoundError as mensaje:
        print("file not found", mensaje)
    except OSError as mensaje:
        print("error", mensaje)
    except PermissionError as mensaje:
        print("no hay permisos para modificar archivo", mensaje)
    finally:
        try:
            archivo.close()
            archivonuevo.close()
            os.remove(r"datos.csv")
            os.rename(r"datos2.csv",r"datos.csv")
        except NameError:
            pass
def valor_total_inventario():
    total = parcial = 0
    texto = "Total"
    print(" Valor por Categoría ".center(65, '-'))
    print()
    try:
        archivo = open(r"datos.csv", "rt")
        for indice, datos in enumerate(archivo):
            linea = datos.rstrip('\n')
            registros = linea.split(',')
            if indice == 0:
                categoria = ""
                continue
            if indice == 1:
                categoria = registros[0]
                print(f"{categoria:<10}".center(45), end="")
            elif categoria != registros[0]:
                print(f"${parcial:>5}".center(20))
                total += parcial
                parcial = 0
                categoria = registros[0]
                print(f"{categoria:<10}".center(45), end="")
            parcial += int(registros[2]) * int(registros[3])
        total += parcial
        print(f"${parcial:>5}".center(20))
        print()
        print(f"{texto:<10}".center(45), end="")
        print(f"${total:>5}".center(20))
        print("-" * 65)
        return total
    except FileNotFoundError as mensaje:
        print("file not found", mensaje)
    except OSError as mensaje:
        print("error", mensaje)
    finally:
        try:
            archivo.close()
        except NameError:
            pass
def reposicion():
    print(" Productos con menos de 5 unidades en Stock para reponer ".center(
        65, '-'))
    print()
    print("------Productos------".center(45), end="")
    print("---Stock---".center(20))
    print()
    try:
        archivo = open(r"datos.csv", "rt")
        for indice, datos in enumerate(archivo):
            linea = datos.rstrip('\n')
            registros = linea.split(',')
            if indice == 0:
                continue
            if int(registros[2]) < 20:
                print(registros[1].center(45).title(), end="")
                print(f"{registros[2]}".center(20))
    except FileNotFoundError as mensaje:
        print("file not found", mensaje)
    except OSError as mensaje:
        print("error", mensaje)
    finally:
        try:
            archivo.close()
        except NameError:
            pass
def buscar_elemento(nombre_busqueda):
    nombre_busqueda = nombre_busqueda.lower()
    encontradocat = False
    try:
        archivo = open(r"datos.csv", "rt")
        for indice, datos in enumerate(archivo):
            linea = datos.rstrip('\n')
            registros = linea.split(',')
            if re.findall(f".*{nombre_busqueda}.*", registros[0]) and not encontradocat:
                print()
                print(f"-- Categoría '{registros[0]}' encontrada ".center(65, '-'))
                print()
                print("------Productos------".center(35), end="")
                print("---Stock---".center(15), end="")
                print("---Precio---".center(15))
                print()
                encontradocat = True
            if re.findall(f".*{nombre_busqueda}.*", registros[0]) and encontradocat:
                print(f"{registros[1].title()}".center(35), end="")
                print(f"{registros[2]}".center(15), end="")
                print(f"${registros[3]}".center(15))
            if re.findall(f".*{nombre_busqueda}.*", registros[1]):
                print()
                print(f"-- Producto encontrado en categoría '{registros[0]}' --".center(65, '-'))
                print()
                print("------Productos------".center(35), end="")
                print("---Stock---".center(15), end="")
                print("---Precio---".center(15))
                print()
                print(f"{registros[1].title()}".center(35), end="")
                print(f"{registros[2]}".center(15), end="")
                print(f"${registros[3]}".center(15))
    except FileNotFoundError as mensaje:
        print("file not found", mensaje)
    except OSError as mensaje:
        print("error", mensaje)
    else:
        print("todo correcto")
    finally:
        try:
            archivo.close()
        except NameError:
            pass
# Función para mostrar la página principal
def pagina_principal():
    while True:
        print("." * 40)
        print()
        print("----------------".center(40))
        print("------- QuickInventories -------".center(40))
        print("----------------".center(40))
        print()
        print(" Direc. Lima 757".ljust(20), end="")
        print("Tel. 46429-1234".rjust(20))
        print()
        print()
        print("\n--Sistema de Gestión de Inventarios--")
        print()
        print("\nBienvenido al Sistema de Gestión de Inventarios:")
        print()
        print("1. Ir al Menú de Gestión de Inventarios")
        print("2. Salir")
        opcion = input("Seleccione una opción (1-2): ")
        if opcion == "1":
            menu()
        elif opcion == "2":
            print("Saliendo del sistema...")
            break
        else:
            print("Opción inválida. Por favor, seleccione 1 o 2.")
# Menú interactivo para gestionar el inventario
def menu():
    while True:
        menu = "O"
        menu = input('Presione "Enter" para ver el menu: ')
        if menu == "":
            print()
            print("----------------".center(40))
            print("MENU".center(40))
            print("----------------".center(40))
            print()
            print("1. Consultar inventario")
            print("2. Agregar productos")
            print("3. Eliminar productos")
            print("4. Actualizar producto")
            print("5. Stock mínimo")
            print("6. Buscar producto o categoría")
            print("7. Calcular valor total del inventario")
            print("8. Volver a la pagina principal")
            print()
            opcion = input("Seleccione una opción (1-8): ")
            if opcion == "1":
                consultar_inventario()
            elif opcion == "2":
                while True:
                    try:
                        categoria = input("Ingrese la categoría del producto: ").lower()
                        producto = input("Ingrese el nombre del producto: ").lower()
                        cantidad = int(input(f"Ingrese la cantidad de {producto}: "))
                        precio = float(input(f"Ingrese el precio de {producto}: "))
                    except ValueError as mensaje:
                        print("Ingrege un valor númerico", mensaje)
                    else:
                        break
                agregar_producto(categoria, producto, cantidad, precio)
            elif opcion == "3":
                producto = input("Ingrese el nombre del producto que desea eliminar: ").lower()
                eliminar_producto(producto)
            elif opcion == "4":
                producto = input("Ingrese el nombre del producto que desea actualizar: ").lower()
                actualizar_producto(producto)
            elif opcion == "5":
                reposicion()
            elif opcion == "6":
                nombre_busqueda = input("Ingrese el nombre del producto o categoría a buscar: ").lower()
                buscar_elemento(nombre_busqueda)
            elif opcion == "7":
                valor_total_inventario()
            elif opcion == "8":
                print("Regresando a la página principal...")
                break
            else:
                print("Opción inválida. Por favor, seleccione una opción del 1 al 8.")
pagina_principal()