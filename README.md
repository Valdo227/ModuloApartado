# ModuloApartado
Módulo de apartado con implementación de pagos electrónicos

#Base de datos
La base de datos está en la nube gracias a MongoDB Atlas.
Los datos para ingresar están en variables de entorno en el archivo .env
Esos datos están en la uri que uso para la conexión en app.js

Solo tiene una colección de nombre "payments".

La colección tiene los siguientes atributos:
_id, name, phone, email, property_id, real_estate_development_id

#Stripe
Se crea una cuenta, pueden ser datos personales, luego se crea la cuenta de la empresa.
Una vez registrado solo es seguir los pasos que se mostraran en la plataforma para crear la cuenta de la empresa.
Pide información de la empresa para poder activarse.

Si se necesita probar antes de activar, se puede crear la cuenta de la empresa desde arriba
a la izquierda, solo pide el nombre y confirmar con contraseña.

Una vez creado en el inicio se mostrarán dos keys, una privada y pública, ambos soon necesarios,
las guardé en variables de entorno en el archivo .env

#Paypal
Implementé los botones inteligentes, es la manera más sencilla de aplicarlo, personalicé el botón
y los pagos, pero no pude probarlo.
Quise implementar el método de pago por medio del API, pero por momentos me daba errores la página.


#Comentarios
Las referencias a los archivos de js no encontré una mejor forma más limpia de implementarlo,
leí la documentación de Express y según entendí es la mejor manera.

Cualquier detalle, no dude en comentarme.
Gracias
