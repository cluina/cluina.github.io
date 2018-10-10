let isExtended = false
const nav = document.getElementById("toggle-nav")
const toggleNav = () => {
    !isExtended ? nav.classList.add('extended') : nav.classList.remove('extended')
    isExtended = !isExtended
}
for (item of document.getElementsByTagName('a')) {
    item.addEventListener('click' , e => toggleNav())
}
