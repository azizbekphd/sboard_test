export default function showSnackbar(message: string) {
    const snackbarsContainer = document.querySelector('#snackbars')!;

    const snackbar = document.createElement('div');
    snackbar.classList.add('snackbar');

    snackbar.innerHTML = `
        <div class="message">${message}</div>
        <button class="close" aria-label="Close" onclick="this.parentElement.remove()"></button>
    `;

    snackbarsContainer.appendChild(snackbar);

    setTimeout(() => {
        if (snackbar) {
            snackbar.remove();
        }
    }, 2000);
}
