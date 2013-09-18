**
 *
 * This JavaScript is used to upload and remove files.
 * Usage - $('input[type=submit]').fileUpload()
 * This javascript will be used along with template reportaproblem/inc/fileupload.dust
 * 
 */

(function($) {
		$.widget('FU.fileupload',{
			options:{
				upload_url: '',
				remove_url: '/webapps/disputeresolutionspartaweb/webflow/sparta/removefile'
			},			
			_init: function() {
				var self = this;
				//Removing file input already placed in doc for non-js support
				if($('.fileupload input[type=file]').length > 0)
					$('.fileupload input[type=file]').remove();
					
				this._createElements();
	 			$('#content-area').append(this.elements.form);
				this._addListeners();
				this._updatePosition();
				this._decorateButton();
			},
			_createElements: function(){
				this.elements = {};
				this.elements.form = this._createForm();
				this.elements.frame = this.elements.form.find('iframe');
				this.elements.fileinput = this.elements.form.find('input[type=file]');
				this.elements.uploadbutton = this.element;
				this.elements.mainblock =  this.elements.uploadbutton.parents('.fileupload');
				this.elements.filecontainer = this.elements.mainblock.find('.file-container');
				this.elements.progress = this.elements.mainblock.find('.loading-image');
				this.elements.uploaderror = this.elements.mainblock.find('.uploaderror');
			},
			_createForm: function(){
				var form = $('<form method="post" style="left:-9999px;position:absolute;"/>'),
				 	uploadFile = $('<input size="1" type="file" name="uploadfile" multiple style="z-index:9999;">'),
					formAction =$('<input type="hidden" name="_eventId_UploadDoc" value="Upload file"/>'),
				 	uploadFrame = $('<iframe style="visibility: hidden;"></iframe>');
					uploadFrame.attr({"name": "UploadFrame_" + this.element.attr('id'),
										"id": "UploadFrame_" + this.element.attr('id')});
					uploadFile.attr("id", "uf_"+ this.element.attr('id'));
					form.attr("id", "FileUploadForm_" + this.element.attr('id'));
					form.attr({'enctype' : 'multipart/form-data','target' : uploadFrame.attr('name'), 'action': this.options.upload_url})
						.append(uploadFile)
						.append(formAction)
						.append(uploadFrame);
				return form;
			},
			_decorateButton: function(){
				//Setting up the dimensions and styles 
				this.elements.fileinput.width(this.elements.uploadbutton.width())
									   .height(this.elements.uploadbutton.css('height'))
									   .css({'opacity':'0','font-size':'9px', 'cursor': 'pointer'});
				this.elements.uploadbutton.css({'cursor': 'default'});
			},
			_updatePosition: function(){
				//Placing file input under Upload file link
				this.elements.fileinput.offset({left: this.element.offset().left, top:this.element.offset().top});
			},
			_addListeners: function(){
					var self =  this;
					//Setting up onchange event - which validates the files to be uploaded and submit the form to iframe
					self.elements.fileinput.on('change',function(e){self._upload(e, this)});
		
					//These lines will be called on frame load
					self.elements.frame.on('load', self.elements.frame, function(){ self.loadFiles(this)}); 
					
					// Binding click event with remove buttons
					self.elements.filecontainer.on('click', '.removeFile', function(e){self.removeFile(e);});
					
					//Preventing button submit
					
					self.elements.uploadbutton.on('click', function(e){e.preventDefault();});
			},
			_upload: function(event, elem){
					//Check for IE
					if($.browser.msie){
						var ext = $(elem).val().split('.').pop().toLowerCase();
							if($.inArray(ext, ['gif','png','jpg','pdf']) == -1) {
								this.elements.uploaderror.show();
								this._updatePosition();
								return false;
							}
					}else{
						var totalfiles = elem.files.length,
							filesize = 0,
							maxfilesize = 4194304;
						for(var i=0; i<totalfiles; i++){
							var ext = elem.files[i].name.split('.').pop().toLowerCase();
							if($.inArray(ext, ['gif','png','jpg','pdf']) == -1) {
									this.elements.uploaderror.show();
									this._updatePosition();
								    return false;
							}
							filesize = filesize + elem.files[i].size;
						}

						//File size should not exceed 4MB = 4*1024*1024

						if(filesize > maxfilesize){
							this.elements.uploaderror.show();
							return false;
						}
					}
					this.elements.uploaderror.hide();
					this.elements.progress.show().addClass('spinner'); 
					this.element.addClass('hidden');
					this.elements.form.submit();
			},
			loadFiles: function(elem){
				var self=this;
				self.elements.progress.removeClass('spinner').hide();
				$(elem).contents().find('#wrapper .file-details')
							.each(function(index){
								var li = $('<li> </li>');
								li.append($(this).html())
								self.elements.filecontainer.find('ul').prepend(li);
								$(this).remove();
							});
						self.element.removeClass('hidden');
						self._updatePosition();
						self.elements.fileinput.val('');
			},
			removeFile: function(e){
				e.preventDefault();
				var elem = e.target,
					self = this;
				$(elem).parent('span').addClass('remove-spinner');
				$.post(this.options.remove_url, {"_eventId_RemoveDoc":"remove", "filename": $(elem).data("filename") }, function(data){
							if(data.status == "true"){
								$(elem).parents('li').remove();
								self._updatePosition();
							}
				}, "json")
				.fail(function(){});
			}		
		});		
}(jQuery));
