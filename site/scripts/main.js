function menuHandle(item) {
  $(`.menu__forms`).children().not(`.${item}`).css('display', 'none')
  $(`.${item}`).slideToggle('fast')
}

function ajaxSubmitImage(inputId) {
  // Get file from file select
  var file = document.getElementById(inputId).files[0]
  var resolution = {
    width: $('#image_width').val(),
    height: $('#image_height').val()
  }

  // FormData object
  var formData = new FormData()
  formData.append('files', file, file.name)
  formData.append('resolution', JSON.stringify(resolution))

  var xhr = new XMLHttpRequest()

  // Send request
  xhr.open('POST', '/image', true)
  xhr.onreadystatechange = function() {
    $('.response').prop('href', `/file?id=${xhr.responseText}`)
    $('.response').text("Here's your file!")
  }
  xhr.send(formData)
}
