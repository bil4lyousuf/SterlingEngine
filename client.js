document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('toggleButton');
  const drop = document.getElementById('drop');

  toggleButton.addEventListener('click', () => {
    toggleButton.textContent = toggleButton.textContent === '+' ? '✔' : '+';
    drop.classList.toggle('hidden');
  });

  drop.addEventListener('mouseover', () => {
    drop.classList.remove('hidden');
  });

  drop.addEventListener('mouseout', () => {
    drop.classList.add('hidden');
  });
});
