$(document).ready(() => {
  inputWatcher()

  menuHandle(document.cookie.split('last_menu=')[1].split(';')[0])
})

function menuHandle(elm, item) {
  $(`.menu__forms`).children().not(`.${item}`).slideUp('fast')//.css('display', 'none')
  $(`.${item}`).slideToggle('fast')

  // Remove all active classes from every menu element
  $(elm).parent().children().each((i, p) => $(p).removeClass('box__active'))
  // Add active class to current element
  $(elm).addClass('box__active')

  document.cookie = "last_menu=" + item
}

function displayFilename(e) {
  // Get file from file select
  var file = e.target.files[0]
  var name = file.name

  $(`#${e.target.id}`).parent().find('.label_inner').text(name)
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
  var respText

  // FormData object
  var formData = new FormData()
  formData.append('files', file, file.name)
  formData.append('resolution', JSON.stringify(resolution))

  var xhr = new XMLHttpRequest()

  // Send request
  xhr.open('POST', '/image', true)
  xhr.onreadystatechange = function() {
    if(xhr.status === 200 && xhr.responseText.length !== 0 && respText != xhr.responseText) {
      let result = $('.image_ascii_result')
      result.prop('src', `/file?id=${xhr.responseText}`)
      result.css('width', '100%')
      result.css('border', '1px solid #000')
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
  var respText

  // FormData object
  var formData = new FormData()
  formData.append('files', file, file.name)
  formData.append('resolution', JSON.stringify(resolution))

  var xhr = new XMLHttpRequest()

  // Send request
  xhr.open('POST', '/mini', true)
  xhr.onreadystatechange = function () {
    if(xhr.status === 200 && xhr.responseText.length !== 0 && respText != xhr.responseText) {
      $('.image_mini_result').css('display', 'block')
      $('.image_mini_result').find('pre').text(JSON.parse(xhr.responseText).content)
    }
  }
  xhr.send(formData)
}

/**
 * Submit video file, return ascii video link.
 * 
 * @param {String} inputId 
 */
function ajaxSubmitVideo(inputId) {
  // Get file from file select
  var file = document.getElementById(inputId).files[0]
  var resolution = {
    width: $(`#${inputId}`).parent().find(`#image_width`).val(),
    height: $(`#${inputId}`).parent().find(`#image_height`).val()
  }
  var framerate = $(`#${inputId}`).parent().find(`#framerate`).val()
  var trim = {
    start: $(`#${inputId}`).parent().find(`#trim_start`).val() || 0,
    end: $(`#${inputId}`).parent().find(`#trim_end`).val()
  }
  var respText

  // FormData object
  var formData = new FormData()
  formData.append('files', file, file.name)
  formData.append('resolution', JSON.stringify(resolution))
  formData.append('framerate', framerate)
  formData.append('trim', JSON.stringify(trim))

  var xhr = new XMLHttpRequest()

  // Send request
  xhr.open('POST', '/video', true)
  xhr.onreadystatechange = function () {
    if(xhr.status === 200 && xhr.responseText.length !== 0 && respText != xhr.responseText) {
      respText = xhr.responseText
      var video = $('.video_ascii_result')
      var source = `/file?id=${xhr.responseText}`

      video.parent().append('<div class="loading"><div></div></div>')
      video.parent().append('<p class="loading_text">Processing | This can take a while</p>')
      $(`#${inputId}`).parent().find('.error_block').css('display', 'none')
      return invokeVideoChecker(video, source)
    } else if (xhr.responseText.length !== 0 && xhr.responseText !== respText) {
      respText = xhr.responseText
      var errorBlock = $(`#${inputId}`).parent().find('.error_block')

      try {
        var json = JSON.parse(xhr.responseText)
        
        errorBlock.find('.error_title').append(json.message)
        errorBlock.find('.error_body').text(`Try reducing framerate to ${json.reduce_frames_to} fps, or reduce the video length to ${json.reduce_length_to}s`)
        errorBlock.slideToggle('fast')
      } catch(e) {
        errorBlock.find('.error_title').append('Error')
        errorBlock.find('.error_body').text(respText)
        errorBlock.slideToggle('fast')
      }
    }
  }
  xhr.send(formData)
}

function inputWatcher() {
  var image_inputs = $('.image__ascii').find('input[type="number"]')
  var mini_inputs = $('.image__text').find('input[type="number"]')
  var video_inputs = $('.video__ascii').find('input[id^="image"]')

  image_inputs.change(evt => {
    var elm = $(evt.target)
    if($(elm).val() > 500) {
      $(elm).parent().append('<p class="alert">Warning: both dimensions need to be under 500</p>')
      $(elm).parents().find('.alert').slideToggle('fast')
    }
  })

  mini_inputs.change(evt => {
    var elm = $(evt.target)
    if($(elm).val() > 100) {
      $(elm).parent().append('<p class="alert">Warning: both dimensions need to be under 100</p>')
      $(elm).parents().find('.alert').slideToggle('fast')
    }
  })

  video_inputs.change(evt => {
    var elm = $(evt.target)
    if($(elm).val() > 100) {
      $(elm).parent().append('<p class="alert">Warning: both dimensions need to be under 100</p>')
      $(elm).parents().find('.alert').slideToggle('fast')
    }
  })
}

function invokeVideoChecker(video, source) {
  var interval = setInterval(() => {
    if(video.prop('readyState') < 3) {
      video.prop('src', '')
      video.prop('src', source)
    } else {
      video.parent().find('.loading').css('display', 'none')
      video.parent().find('.loading_text').css('display', 'none')
      video.prop('controls', true)
      video.css('display', 'block')
      clearInterval(interval)
    }
  }, 10000)
}
