function menuHandle(item) {
  console.log($(`.menu__forms`).children())
  $(`.menu__forms`).children().css('display', 'none')

  $(`.${item}`).slideToggle('fast')
}