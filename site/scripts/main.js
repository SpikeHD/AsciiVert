function menuHandle(item) {
  $(`.menu__forms`).children().not(`.${item}`).css('display', 'none')
  $(`.${item}`).slideToggle('fast')
}