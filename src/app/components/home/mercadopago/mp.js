
const mercadoPago = require('https://sdk.mercadopago.com/js/v2');

 // Agrega credenciales de SDK
const mp = new MercadoPago('APP_USR-26941b07-f466-4ecd-9d0a-d16fefa22623', {
  locale: 'es-AR'
});

alert("hola");
// Inicializa el checkout
mp.checkout({
  
  preference: {
      id: '736455939-ff08c43d-ed42-4c89-9e47-5e01d1ee894b'
  },
  render: {
        container: '.cho-container', // Indica dónde se mostrará el botón de pago
        label: 'Pagar', // Cambia el texto del botón de pago (opcional)
  }
});