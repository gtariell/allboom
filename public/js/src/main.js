import './user_system/user_system'
import $ from 'jquery'
import Notify from 'handy-notification'

// SCROLL TO TOP
$('.page_end').on('click', () => 
  $('html, body').animate({ scrollTop: 0 }, 450))

// CREATE POST
$('.create_blog').on('click', e => {
  e.preventDefault()
  let title = $('.create_username').val(),
    reader = $('.create_reader').val()

  if (!title || !reader) {
    Notify({ value: 'Some values are missing!!' })
  } else {
    $.ajax({
      url: '/api/create_new_post',
      data: {
        title,
        reader
      },
      method: 'POST',
      dataType: 'JSON',
      success: data => {
        let { mssg, postID } = data
        Notify({
          value: mssg,
          done: () => (location.href = `/view_post/${postID}`)
        })
      }
    })
  }
})

// DELETE POST
$('.blog_dlt').on('click', e => {
  e.preventDefault()
  let post = e.currentTarget.dataset['post'],
    session = $('.data').data('session')

  $.ajax({
    url: '/api/delete_post',
    data: { post },
    method: 'POST',
    dataType: 'JSON',
    success: data => {
      let { mssg } = data
      Notify({
        value: mssg,
        done: () => (location.href = `/profile/${session}`)
      })
    }
  })
})

// EDIT POST
$('.d_editing').on('click', e => {
  e.preventDefault()
  let postID = $('.edit').data('post'),
    title = $('.b_title').val(),
    content = $('.b_content').val()

  if (!title || !content) {
    Notify({ value: 'Some values are missing!!' })
  } else {
    $.ajax({
      url: '/api/update_post',
      data: {
        postID,
        title,
        content
      },
      method: 'POST',
      dataType: 'JSON',
      success: data => {
        Notify({ value: data.mssg, done: () => location.reload() })
      }
    })
  }
})

// EDIT PROFILE
$('.ep_done').on('click', e => {
  e.preventDefault()
  let username = $('.ep_username').val(),
    email = $('.ep_email').val(),
    bio = $('.ep_bio').val()

  if (!username || !email) {
    Notify({ value: 'Some values are missing!!' })
  } else {
    $.ajax({
      url: '/api/update_profile',
      data: {
        username,
        email,
        bio
      },
      method: 'POST',
      dataType: 'JSON',
      success: data => {
        let { mssg, success } = data
        console.log(data)
        Notify({
          value: mssg,
          done: () => (success ? location.reload() : null)
        })
      }
    })
  }
})

// CHANGE AVATAR
$('#avatar_file').on('change', e => {
  let file = e.target.files[0],
    form = new FormData()

  form.append('avatar', file)

  $.ajax({
    url: '/api/change_avatar',
    method: 'POST',
    processData: false,
    contentType: false,
    data: form,
    dataType: 'JSON',
    success: data => {
      let { mssg, success } = data
      Notify({
        value: mssg,
        done: () => (success ? location.reload() : null)
      })
    }
  })
})

// FOLLOW USER
$('.follow').on('click', e => {
  e.preventDefault()
  let user = e.currentTarget.dataset['followTo']
  $.ajax({
    url: '/api/follow',
    data: { user },
    method: 'POST',
    dataType: 'JSON',
    success: data => {
      Notify({
        value: data.mssg,
        done: () => location.reload()
      })
    }
  })
})

// UNFOLLOW USER
$('.unfollow').on('click', e => {
  e.preventDefault()
  let user = e.currentTarget.dataset['unfollowTo']
  $.ajax({
    url: '/api/unfollow',
    data: { user },
    method: 'POST',
    dataType: 'JSON',
    success: data => {
      Notify({
        value: data.mssg,
        done: () => location.reload()
      })
    }
  })
})

// LIKE POST
$('.like_post').on('click', e => {
  e.preventDefault()
  let post = e.currentTarget.dataset['post']
  $.ajax({
    url: '/api/like',
    data: { post },
    method: 'POST',
    dataType: 'JSON',
    success: data => {
      Notify({
        value: data.mssg,
        done: () => location.reload()
      })
    }
  })
})

// UNLIKE POST
$('.unlike_post').on('click', e => {
  e.preventDefault()
  let post = e.currentTarget.dataset['post']
  $.ajax({
    url: '/api/unlike',
    data: { post },
    method: 'POST',
    dataType: 'JSON',
    success: data => {
      Notify({
        value: data.mssg,
        done: () => location.reload()
      })
    }
  })
})

// DEACTIVATE ACCOUNT
$('.d_btn').on('click', e => {
  e.preventDefault()
  $.ajax({
    url: '/api/deactivate-account',
    method: 'POST',
    dataType: 'JSON',
    success: data => {
      Notify({
        value: data.mssg,
        done: () => (location.href = '/welcome')
      })
    }
  })
})

$(document).ready(function(){
	var dropZone = $('#upload-container');

	$('#file-input').focus(function() {
		$('label').addClass('focus');
	})
	.focusout(function() {
		$('label').removeClass('focus');
	});


	dropZone.on('drag dragstart dragend dragover dragenter dragleave drop', function(){
		return false;
	});

	dropZone.on('dragover dragenter', function() {
		dropZone.addClass('dragover');
	});

	dropZone.on('dragleave', function(e) {
		let dx = e.pageX - dropZone.offset().left;
		let dy = e.pageY - dropZone.offset().top;
		if ((dx < 0) || (dx > dropZone.width()) || (dy < 0) || (dy > dropZone.height())) {
			dropZone.removeClass('dragover');
		}
	});

	dropZone.on('drop', function(e) {
		dropZone.removeClass('dragover');
		let files = e.originalEvent.dataTransfer.files;
		sendFiles(files);
	});

	$('#file-input').change(function() {
    let files = this.files;
    sendFiles(files);
    document.getElementById("upload-image").src = this.files
	});


	function sendFiles(files) {
		let maxFileSize = 5242880;
		let Data = new FormData();
		$(files).each(function(index, file) {
			if ((file.size <= maxFileSize) && ((file.type == 'image/png') || (file.type == 'image/jpeg'))) {
				Data.append('images[]', file);
			};
		});

		$.ajax({
			url: dropZone.attr('action'),
			type: dropZone.attr('method'),
			data: Data,
			contentType: false,
			processData: false,
			success: function(data) {
				alert ('Файлы были успешно загружены!');
			}
		});
	}
})