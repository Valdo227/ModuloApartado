/**
 * Guarda la información despues del pago
 * @RequestBody nombre,correo y telefono del cliente; id de la propiedad y el inmueble
 */
function savePayment() {
    const response = fetch('save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept':'text/html'
        },
        body: JSON.stringify({
            name: document.getElementById("name").value,
            phone: document.getElementById("number").value,
            email:document.getElementById("email").value,
            property_id: property_id,
            real_estate_development_id: real_state_development
        })
    })
}

/**
 * Lógica de pago por Stripe
 */
document.addEventListener('DOMContentLoaded', async () => {

    //Carga la llave publica desde el servidor
    const { publishableKey } = await fetch('/payment/config').then((r) => r.json());
    if (!publishableKey) {
        addMessage(
            'No publishable key returned from the server. Please check `.env` and try again'
        );
        alert('Please set your Stripe publishable API key in the .env file');
    }

        const stripe = Stripe(publishableKey, {
        apiVersion: '2020-08-27',
    });

    //Carga los inputs de Stripe
    const elements = stripe.elements();
    const card = elements.create('card');
    card.mount('#card-element');

    //Proceso una vez se ha envíado el formulario
    const form = document.getElementById('payment-form');
    let submitted = false;

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Se evita enviar el formulario dos veces
            if (submitted) {
                return;
            }
            submitted = true;
            form.querySelector('button').disabled = true;

            // Se hace una llamada del back para crear un intento de pago y se guarda el client_secret.
            const {error: backendError, clientSecret} = await fetch(
                '/payment/create-payment-intent',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        amount: pay_price*10,
                        currency: pay_currency
                    })
                }
            ).then((r) => r.json());

            // Si hay un error en el back
            if (backendError) {
                addMessage(backendError.message);

                //Se reactiva el formulario
                submitted = false;
                form.querySelector('button').disabled = false;
                return;
            }

            //addMessage('Client secret returned.');

            const nameInput = document.querySelector('#name');
            const emailInput = document.querySelector('#email');

            //Confirmación de que el pago con tarjeta con el client_secret se haya creado en el servidor
            const {error: stripeError, paymentIntent} = await stripe.confirmCardPayment(
                clientSecret,
                {
                    payment_method: {
                        card: card,
                        billing_details: {
                            name: nameInput.value,
                            email: emailInput.value
                        },
                    },
                }
            );

            //Si hay un error por parte de Stripe
            if (stripeError) {
                addMessage(stripeError.message);

                //Se reactiva el formulario
                submitted = false;
                form.querySelector('button').disabled = false;
                return;
            }

            //Se guarda la información de pago en la BDD
            if(paymentIntent.status === 'succeeded'){
                addMessage('Pago realizado correctamente')
                savePayment();
                window.location.replace("http://localhost:3000/sections/payinfo");

            }
            addMessage(`Payment ${paymentIntent.status}: ${paymentIntent.id}`);
            }
        );
    }
});

async function Paypal() {
    if (!(document.getElementById("name").value === "" ||
        document.getElementById("number").value === "" ||
        document.getElementById("email").value === ""
    )){
        const {token} = await fetch('/payment/paypal-create-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: pay_price,
                currency: pay_currency
            })
        }).then((r) => r.json());

        window.location.replace(`https://www.sandbox.paypal.com/checkoutnow?token=${token}`)
        savePayment();

    }
}

/**
 * Despliega los mensajes
 * @param message mensaje a mostrar
 */
const addMessage = (message) => {
    const messagesDiv = document.querySelector('#messages');
    messagesDiv.style.display = 'block';
    messagesDiv.innerHTML = '';
    const messageWithLinks = addDashboardLinks(message);
    messagesDiv.innerHTML += `${messageWithLinks}<br>`;
    console.log(`Debug: ${message}`);
};

/**
 * Agrega links para visualizar los pagos exitosos
 * @param message mensaje a mostrar
 * @returns message mensaje con links
 */
const addDashboardLinks = (message) => {
    const piDashboardBase = 'https://dashboard.stripe.com/test/payments';
    return message.replace(
        /(pi_(\S*)\b)/g,
        `<a href="${piDashboardBase}/$1" target="_blank">$1</a>`
    );
};
