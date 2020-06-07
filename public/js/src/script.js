
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
		var f = file[0]
		for (var i = 0, f; f = files[i]; i++) {
			// Only process image files.
			if (!f.type.match('image.*')) {
					alert("Image only please....");
			}
			var reader = new FileReader();
			// Closure to capture the file information.
			reader.onload = (function (theFile) {
					return function (e) {
							// Render thumbnail.
							var span = document.createElement('span');
							span.innerHTML = ['<img class="thumb" title="', escape(theFile.name), '" src="', e.target.result, '" />'].join('');
							document.getElementById('output').insertBefore(span, null);
					};
			})(f);
			// Read in the image file as a data URL.
			reader.readAsDataURL(f);
			document.getElementById('upload-image').src = f;
	}
	//	document.getElementById("upload-image").src = f
		
		
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
