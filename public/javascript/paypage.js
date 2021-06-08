
var stripe = Stripe('pk_test_51IwvTRHKxDxRJvOZMgN25jdDWv8ryGJzj3D8TnuZu150fflHBv8SfKlGTNJmGZJSe66cGDSfEOPEAbgwOfgPDyvw00o8iDbV3y');
var elements = stripe.elements();
var style = {
    base: {
        color: "#32325d",
    }
};

var checkoutButton = document.getElementById("checkout-button");
checkoutButton.addEventListener("click", function () {
    fetch("/sections/create-checkout-session", {
        method: "POST",
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (session) {
            return stripe.redirectToCheckout({ sessionId: session.id });
        })
        .then(function (result) {
            // If redirectToCheckout fails due to a browser or network
            // error, you should display the localized error message to your
            // customer using error.message.
            if (result.error) {
                alert(result.error.message);
            }
        })
        .catch(function (error) {
            console.error("Error:", error);
        });
});

var card = elements.create("card", { style: style });
card.mount("#card-element");

card.on('change', function(event) {
    var displayError = document.getElementById('card-errors');
    if (event.error) {
        displayError.textContent = event.error.message;
    } else {
        displayError.textContent = '';
    }
});

var form = document.getElementById('payment-form');

form.addEventListener('submit', function(ev) {
    ev.preventDefault();
    // If the client secret was rendered server-side as a data-secret attribute
    // on the <form> element, you can retrieve it here by calling `form.dataset.secret`
    stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: card,
            billing_details: {
                name: 'Jenny Rosen'
            }
        }
    }).then(function(result) {
        if (result.error) {
            // Show error to your customer (e.g., insufficient funds)
            console.log(result.error.message);
        } else {
            // The payment has been processed!
            if (result.paymentIntent.status === 'succeeded') {
                // Show a success message to your customer
                // There's a risk of the customer closing the window before callback
                // execution. Set up a webhook or plugin to listen for the
                // payment_intent.succeeded event that handles any business critical
                // post-payment actions.
            }
        }
    });
});
