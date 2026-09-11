const paymentForm = document.getElementById('payment-form');
const amountInput = document.getElementById('amount');
const paymentButton = document.getElementById('payment-button');
const paymentError = document.getElementById('payment-error');

paymentForm.addEventListener('submit', async (event) => {
   event.preventDefault();

   paymentError.hidden = true;
   paymentButton.disabled = true;
   paymentButton.textContent = 'Processing...';

   try {
      const amount = Number(amountInput.value);

      const response = await fetch('/payments', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({ amount }),
      });

      const payment = await response.json();

      if (!response.ok) {
         const message = Array.isArray(payment.message)
            ? payment.message.join(', ')
            : payment.message;

         throw new Error(message || 'Unable to create payment');
      }

      const webpayForm = document.createElement('form');

      webpayForm.method = 'POST';
      webpayForm.action = payment.url;

      const tokenInput = document.createElement('input');

      tokenInput.type = 'hidden';
      tokenInput.name = 'token_ws';
      tokenInput.value = payment.token;

      webpayForm.appendChild(tokenInput);
      document.body.appendChild(webpayForm);

      webpayForm.submit();
   } catch (error) {
      paymentError.textContent =
         error instanceof Error
            ? error.message
            : 'Unable to process payment';

      paymentError.hidden = false;
      paymentButton.disabled = false;
      paymentButton.textContent = 'Pay with Webpay';
   }
});