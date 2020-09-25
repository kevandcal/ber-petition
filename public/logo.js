const berLogo = document.getElementById('ber-logo');
const badLogo = document.getElementById('bad-logo');

const logoSwap = () => {
  berLogo.style.opacity = 1;
  badLogo.style.opacity = 0;
  setInterval(() => {
    berLogo.style.opacity = berLogo.style.opacity === '1' ? '0' : '1';
    badLogo.style.opacity = badLogo.style.opacity === '0' ? '1' : '0';
  }, 4000);
}

logoSwap();