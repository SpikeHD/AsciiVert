function menuHandle(item) {
  $(`.menu__forms`).children().not(`.${item}`).css('display', 'none')
  $(`.${item}`).slideToggle('fast')
}

function ajaxSubmitImage(inputId) {
  // Get file from file select
  var file = document.getElementById(inputId).files[0]
  var resolution = {
    width: $(`#${inputId}`).parent().find(`#image_width`).val(),
    height: $(`#${inputId}`).parent().find(`#image_height`).val()
  }

  // FormData object
  var formData = new FormData()
  formData.append('files', file, file.name)
  formData.append('resolution', JSON.stringify(resolution))

  var xhr = new XMLHttpRequest()

  // Send request
  xhr.open('POST', '/image', true)
  xhr.onreadystatechange = function() {
    $('.image_ascii_result').prop('href', `/file?id=${xhr.responseText}`)
    $('.image_ascii_result').text("Here's your file!")
  }
  xhr.send(formData)
}

function ajaxSubmitMini(inputId) {
    // Get file from file select
    var file = document.getElementById(inputId).files[0]
    var resolution = {
      width: $(`#${inputId}`).parent().find(`#image_width`).val(),
      height: $(`#${inputId}`).parent().find(`#image_height`).val()
    }
  
    // FormData object
    var formData = new FormData()
    formData.append('files', file, file.name)
    formData.append('resolution', JSON.stringify(resolution))
  
    var xhr = new XMLHttpRequest()
  
    // Send request
    xhr.open('POST', '/mini', true)
    xhr.onreadystatechange = function() {
      $('.image_mini_result').text(JSON.parse(xhr.responseText).content)
    }
    xhr.send(formData)
}
