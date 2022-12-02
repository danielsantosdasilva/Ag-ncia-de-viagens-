// NAVBAR
let menu = document.queryCommandSelector('#menu-icon')
let navbar = document.queryCommandSelector('.navbar')

menu.onclick = () =>{
    menu.classList.toggle('bx-x');
    navbar.classList.toggle('open')
}