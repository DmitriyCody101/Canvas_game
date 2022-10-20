const menu = document.querySelector(".menu")
const games = document.querySelector(".games")
const gamesBtns = document.querySelectorAll(".menu .btn")
const logoContainer = document.querySelector(".container-pixel-point")

gamesBtns.forEach((item, _i, _arr) => {
    item.addEventListener('click', () => {
        menu.style.display = "none"
        games.style.display = "flex"
        logoContainer.style.display = "none"
    })
})
