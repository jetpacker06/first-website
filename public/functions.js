function rightHereButtonClick() {
    let rando = Math.random()
    while (rando === 0.9) {
        rando = Math.random()
    }
    if (rando > 0.5) {
        alert("You clicked the button")
    } else if (rando > 0.2) {
        alert("Good job")
    } else {
        alert("Click!")
    }
}
