/**
 * Despliegue del botón de paypal
 */
function initPayPalButton() {
    paypal.Buttons({
        style: {
            shape: 'rect',
            color: 'gold',
            layout: 'horizontal',
            label: 'paypal'
        },

        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{"amount":{"currency_code":pay_currency,"value":pay_price}}]
            });
        },

        onApprove: function(data, actions) {
            return actions.order.capture().then(function() {
                savePayment();
                window.location.replace("http://localhost:3000/sections/payinfo");
            });
        },

        onError: function(err) {
            console.log(err);
        }
    }).render('#paypal-button-container');
}
    initPayPalButton();
