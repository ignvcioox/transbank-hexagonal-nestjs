const params = new URLSearchParams(window.location.search);

const status = params.get('status');
const amount = params.get('amount');
const buyOrder = params.get('buyOrder');
const authorizationCode = params.get('authorizationCode');

const title = document.getElementById('result-title');
const message = document.getElementById('result-message');
const amountElement = document.getElementById('amount');
const buyOrderElement = document.getElementById('buy-order');
const authorizationCodeElement = document.getElementById(
   'authorization-code',
);

const resultContent = {
   APPROVED: {
      title: 'Payment approved',
      message: 'Your payment was successfully authorized.',
   },
   REJECTED: {
      title: 'Payment rejected',
      message: 'Your payment could not be authorized.',
   },
   ABORTED: {
      title: 'Payment cancelled',
      message: 'The payment process was cancelled.',
   },
   FAILED: {
      title: 'Payment failed',
      message: 'An error occurred while processing your payment.',
   },
};

const result = resultContent[status] ?? resultContent.FAILED;

title.textContent = result.title;
message.textContent = result.message;

amountElement.textContent = amount
   ? `$${Number(amount).toLocaleString('es-CL')}`
   : '-';

buyOrderElement.textContent = buyOrder ?? '-';
authorizationCodeElement.textContent = authorizationCode || '-';