# Chatbot para la gestión de trámites ciudadanos
Este repositorio contiene el código fuente y la documentación de un chatbot inteligente desarrollado para ayudar a los ciudadanos a gestionar sus trámites administrativos con el gobierno local de San Miguel de Ibarra, Ecuador.
# Introducción
El chatbot se nutre de inteligencia artificial (IA) y utiliza el procesamiento del lenguaje natural (NLP -Dialogflow) para comprender las consultas de los usuarios y ofrecer respuestas pertinentes.
# Características
Disponibilidad 24/7: El chatbot está siempre disponible para ayudar a los usuarios, independientemente de la hora o la ubicación.
Guía de trámites: El chatbot puede ayudar a la obtención de información sobre las áres de: 
- Administración de mercados
- Colegio de Ingenieros Civiles (CICI)
- Cuerpo de Bomberos Ibarra
- Avalúos y Catastros
- Comisaria de construcciones
- Dirección financiera
- Colegio de Arquitectos (CAE)
- Comisaria Municipal
- Gestión Ambiental
# Instalación
 1. Asegúrese de tener instalado Node.js en su máquina. Puede descargarlo desde el sitio web oficial: https://nodejs.org
 2. Clone o descargue el repositorio del chatbot
 3. Cree una cuenta en Dialogflow y configure su proyecto. Puede seguir las instrucciones en la documentación oficial de Dialogflow: https://cloud.google.com/dialogflow/docs/quickstart
 4. Cree una cuenta en WhatsApp Business y solicite acceso a su API de WhatsApp Business. Puede seguir las instrucciones en la documentación oficial de WhatsApp Business: https://developers.facebook.com/docs/whatsapp/getting-started/business-api
 5. Configure el archivo de configuración de la aplicación con las credenciales de su proyecto de Dialogflow y la API de WhatsApp Business.
 Para completar la instalación:
 - Crear un archivo .env en la raíz del proyecto y completar los campos necesarios con la información correspondiente. Los campos necesarios son los siguientes:
 - TOKEN: token proporcionado por la API de WhatsApp Business.
 - PORT: puerto en el que se ejecutará el servidor Node.js (por defecto es el puerto 3000).
 - VERIFY_TOKEN: token utilizado para verificar la autenticidad de las solicitudes entrantes a la API de WhatsApp Business.
 - APP_SECRET: secreto de la aplicación proporcionado por Facebook para la integración con la API de WhatsApp Business.
 - CREDENTIALS: ruta del archivo JSON con las credenciales de Google Cloud Storage (solo si se va a utilizar el almacenamiento de conversaciones en Google Cloud Storage).
 - Se puede utilizar el archivo .env.example como base para crear el archivo .env.

 - Ejecutar el comando npm install para instalar todas las dependencias necesarias.
 
 - Ejecutar el comando npm start para iniciar el servidor Node.js.
 
 - Se puede utilizar ngrok: para poder usar el chatbot en WhatsApp, se debe tener en cuenta que se necesita una dirección URL pública para que WhatsApp Business API pueda enviar mensajes al servidor Node.js. Para ello, se recomienda el uso de Ngrok, que permite crear una dirección URL pública temporal que redirige el tráfico entrante al servidor local. Una vez que se ha instalado y configurado Ngrok, se debe iniciar Ngrok y crear la dirección URL pública utilizando el puerto especificado en el archivo .env. La dirección URL generada debe ser proporcionada a WhatsApp Business API como punto final para la comunicación.

 - Configurar la cuenta de WhatsApp Business para que redirija los mensajes al servidor Node.js utilizando la dirección y puerto correctos.
