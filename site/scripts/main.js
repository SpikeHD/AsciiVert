function menuHandle(item) {
  $(`.menu__forms`).children().not(`.${item}`).slideUp('fast')//.css('display', 'none')
  $(`.${item}`).slideToggle('fast')
}

/**
 * Submit image file, return image in ascii form.
 * 
 * @param {String} inputId 
 */
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
    if(xhr.status === 200) {
      $('.image_ascii_result').prop('href', `/file?id=${xhr.responseText}`)
      $('.image_ascii_result').text("Here's your file!")
    }
  }
  xhr.send(formData)
}

/**
 * Submit image file, return image text.
 * 
 * @param {String} inputId 
 */
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
  xhr.onreadystatechange = function () {
    if(xhr.status === 200) {
      $('.image_mini_result').text(JSON.parse(xhr.responseText).content)
    }
  }
  xhr.send(formData)
}

/**
 * Submit video file, return ascii video link.
 * 
 * @param {String} inputId 
 */
function ajaxSubmitMini(inputId) {
  // Get file from file select
  var file = document.getElementById(inputId).files[0]
  var resolution = {
    width: $(`#${inputId}`).parent().find(`#image_width`).val(),
    height: $(`#${inputId}`).parent().find(`#image_height`).val()
  }
  var framerate = $(`#${inputId}`).parent().find(`#framerate`).val()

  // FormData object
  var formData = new FormData()
  formData.append('files', file, file.name)
  formData.append('resolution', JSON.stringify(resolution))
  formData.append('framerate', framerate)

  var xhr = new XMLHttpRequest()

  // Send request
  xhr.open('POST', '/mini', true)
  xhr.onreadystatechange = function () {
    if(xhr.status === 200) {

    }
  }
  xhr.send(formData)
}
