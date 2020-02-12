var profile = profile || {}
profile = (()=>{
	let context, js, css, img, brdjs, profile_vuejs, edit_profilejs
	let init =()=>{
		context = $.ctx()
		js = $.js()
		css = $.css()
		img = $.img()
		brdjs = js + '/brd/brd.js'
		profile_vuejs = js+'/vue/brd/profile_vue.js'
		edit_profilejs = js + '/brd/edit_profile.js'
	}
	let onCreate = () => {
		init()
		$.when(
			$.getScript(brdjs),
			$.getScript(profile_vuejs),
			$.getScript(edit_profilejs)
		)
		.done(()=>{
			setContentView()
			go_brd()
			go_write()
			go_edit()
			go_profileMain()
		})
		.fail(()=>{
		})
	}
	let setContentView =()=> {
		$('.masthead').remove()
		$('.page-footer').remove()
		$('#mainpage').empty()
		$('<div id="contents" class="container-fluid" style="margin-top : 80px;"></div>').appendTo('#mainpage')
		$('#contents').append(profile_vue.profile_body({css : $.css(),img : $.img()}))
		$.getJSON(context+'/profile/info/'+sessionStorage.getItem('userno'),d=>{
			$.each(d.profileinfo, (i,j)=>{
				if(j.img==null){
					$('#profile header div img').attr("src",context+'/resources/img/temp_profile.png')
				}else{
					$('#profile header div img').attr("src",context+'/resources/upload/'+j.img)
				}
				$('#profile header div p input').val(j.content)
				$('#profile span[class="stat__number"]').text(d.postcount)
			})
		})
		$.getJSON(context+'/post/list/'+sessionStorage.getItem('userno'),d=>{
			console.log(d);
			$.each(d,(i,j)=>{
				$(` 
				<div class="profile__photo" id="loginedUserPost${j.postno}">
				    <img src="${context+'/resources/upload/'+j.img}" />
				    <div class="profile__photo-overlay">
				        <span class="overlay__item">
				            <i class="fa fa-heart"></i>
				        </span>
				        <span class="overlay__item">
				            <i class="fa fa-comment"></i>
				        </span>
				    </div>
				</div>
				
				<div class="modal fade bd-example-modal-lg" id="myFullsizeModal${j.postno}" tabindex="-1" role="dialog" aria-labelledby="myExtraLargeModalLabel" style="max-height: 80%;" aria-hidden="true">
				    <div class="modal-dialog modal-lg">
				        <div class="modal-content" style="height: -webkit-fill-available; overflow: scroll;">
				            <div class="modal-body row" style="width: inherit;">
				                <div class="col-md-8">
				                    <img class="card-img" src="${context+'/resources/upload/'+j.img}" alt="Card image cap"><br>
				                </div>
				                <div class="col-md-4">
				                    <div class="replies">
				                    </div>
				                    <div class="modal-footer" style="padding: 0;">
				                        <textarea name="comment" placeholder="댓글을 입력하세요" style="width: 80%; border-color: white;"></textarea>
										<a name="insertreply" style="font-size: 14px; color: red;">등록 </a>
				                    </div>
				                    <p stype="margin-top:50px;">
										content
										<input type="text" class="modal-content" value="${j.content}">
				                    </p>
				                    <p>
										<button type="button" class="btn btn-default" data-dismiss="modal" style="width: 25%;padding: 5px;">닫기</button>
										<button type="button" class="btn modify" data-dismiss="modal" style="width: 25%;padding: 5px;">수정</button>
										<button type="button" class="btn delete" data-dismiss="modal" style="width: 25%;padding: 5px;">삭제</button>
									</p>
				                </div>
				            </div>
				        </div>
				    </div>
				</div>
		
				`)
				.appendTo('#profile section')
				
				$(`#loginedUserPost${j.postno} div[class="profile__photo-overlay"]`).click(()=>{
					replyModal(j)
					post_update(j)
					post_delete(j)
				})
				writeReply(j)

				$.getJSON(context+'/post/countNum/'+j.postno, d=>{
					$(`#loginedUserPost${j.postno} i[class="fa fa-heart"]`).text(d.likeCount)
					$(`#loginedUserPost${j.postno} i[class="fa fa-comment"]`).text(d.replyCount)
					
				})
			})
		})
	}
	let replyModal =j=>{
		$(`#myFullsizeModal${j.postno} div[class="replies"]`).empty()
		$.getJSON(context+`/reply/list/${j.postno}`,f=>{
			$.each(f,(a,b)=>{
				if(b.userid == sessionStorage.getItem('userid')){
					$(`<textarea name="reply${b.commentno}" style="font-size: 12px; border-color: white;"> ${b.content} </textarea>
					<a name="modify${b.commentno}" style="font-size: 12px; color: red;"> 수정 </a>
					<a name="delete${b.commentno}" style="font-size: 12px; color: red;">삭제</a><br>
					<p style="font-size: 10px;">${b.regdate}</p>
					`)
					.appendTo(`#myFullsizeModal${j.postno} div[class="replies"]`)
					$(`a[name="modify${b.commentno}"]`).click(e=>{
						e.preventDefault()
						
						let json = {
							commentno : parseInt(b.commentno),
							content : $(`textarea[name="reply${b.commentno}"]`).val()
						}
						$.ajax({
							url : context +'/reply/update/'+b.commentno,
							type:'PUT',
							data: JSON.stringify(json),
							dataType :'json',
							contentType : 'application/json',
							success : d =>{
								$(`#myFullsizeModal${j.postno}`).modal("hide")
								$(`#myFullsizeModal${j.postno}`).modal()
							},
							error: 	e =>{
								alert('ajax 실패')
							}
						})
					})
					
					$(`a[name="delete${b.commentno}"]`).click(e=>{
						e.preventDefault()
						let json = {
							commentno : parseInt(b.commentno)
						}
						$.ajax({
							url:context +'/reply/delete/'+b.commentno,
							type:'DELETE',
							data: JSON.stringify(json),
							dataType :'json',
							contentType : 'application/json',
							success : d =>{
								$(`#myFullsizeModal${j.postno}`).modal("hide")
								$(`#myFullsizeModal${j.postno}`).modal()
								
							},
							error: 	e =>{
								alert('ajax 실패')
							}
						})
					})
				}
				else{
					$(`<p>#${b.content} <b style="float: right;">${b.userid}</b></p>`)
					.appendTo(`#myFullsizeModal${j.postno} div[class="replies"]`)
				}
			})
		})
		$(`#myFullsizeModal${j.postno}`).modal()
	}
	
	let writeReply =j=>{
		$(`#myFullsizeModal${j.postno} a[name="insertreply"]`).click(e=>{
		e.preventDefault()
		let json = {
			postno : parseInt(j.postno),
			userid : sessionStorage.getItem('userid'),
			content : $(`#myFullsizeModal${j.postno} textarea[name="comment"]`).val()
		}
			$.ajax({
				url: context +'/reply/create',
				type:'POST',
				data: JSON.stringify(json),
				dataType :'json',
				contentType : 'application/json',
				success : d =>{
					$(`#replymodal${j.postno}`).modal("hide")
					$(`#replymodal${j.postno}`).modal()
					
				},
				error: 	e =>{
					alert('ajax 실패')
				}
			})
		})
	}
	let go_brd =()=>{
		$('#go_brdMain').click(()=>{
          	brd.onCreate()
        })
	}
	let go_write =()=>{
        $('#btn-write').click(()=>{
           	$('#mainpage').html(profile_vue.write_form({css : $.css()}))
           	fileupload()
        })
	}
	let go_profileMain =()=>{
		$('#go_profileMain').click(e=>{
			onCreate()
		})
	}
	let go_edit =()=>{
		$('#btn-edit-profile').click(()=>{
        	edit_profile.onCreate()
        })
	}
	let post_update=x=>{
		$(`#myFullsizeModal${x.postno} div div div button.btn.modify`)
		.click(e=>{
			e.preventDefault()
			let data = {content:$(`#myFullsizeModal${x.postno} div div div input`).val(),
				postno:x.postno
				}
			$.ajax({
				url:context+'/post/update/'+x.postno,
				type:'PUT',
				data: JSON.stringify(data),
				dataType:'json',
				contentType: 'application/json',
				success:d=>{
					onCreate()
				},
				error: e=>{
					alert('에러발생')
				}
			})
		})
	}
	let post_delete=x=>{
		$(`#myFullsizeModal${x.postno} div div div button.btn.delete`)
		.click(e=>{
			alert('삭제클릭'+x.postno)
			e.preventDefault()
			$.ajax({
				url:context+'/post/delete/'+x.postno,
				type:'DELETE',
				data: JSON.stringify({postno:x.postno}),
				dataType:'json',
				contentType: 'application/json',
				success:d=>{
					onCreate()
				},
				error: e=>{
					alert('에러발생')
				}
			})
		})
	}
	let fileupload =()=>{
		go_brd()
		go_profileMain()
	    $('#image').on('change', function() {
	        ext = $(this).val().split('.').pop().toLowerCase();
	       
	        if($.inArray(ext, ['gif', 'png', 'jpg', 'jpeg']) == -1) {
	            resetFormElement($(this));
	            window.alert('이미지 파일이 아닙니다! (gif, png, jpg, jpeg 만 업로드 가능)');
	        } else {
	            file = $('#image').prop("files")[0];
	            blobURL = window.URL.createObjectURL(file);
	            $('#image_preview img').attr('src', blobURL);
	            $('#image_preview').slideDown(); 
	            $(this).slideUp();
	        }
	    })
	    $('#image_preview a').bind('click', function() {
	    	resetFormElement($('#image')); 
	    	$('#image').slideDown();
	    	$(this).parent().slideUp();
	    	return false; 
	    })
	    function resetFormElement(e) {
			e.wrap('<form>').closest('form').get(0).reset(); 
			e.unwrap();
		}
		$('<input>', {
			value: "파일업로드",
			type:"button"
		})
		.appendTo('#upload_form')
		.click(e => {
			e.preventDefault()
			let form = $('#upload_form')[0]
			let formData = new FormData()
			let files = $('#image')[0].files 
			formData.append("userno", sessionStorage.getItem('userno'))
			formData.append("userid", sessionStorage.getItem('userid'))
			formData.append("content", encodeURIComponent($('#upload_form input[name="content"]').val()))
			formData.append("tagname", encodeURIComponent($('#upload_form input[name="tagname"]').val()))
			let i = 0
			for (i = 0; i < files.length; i++) {
				formData.append("uploadFile", files[i])
			}
			$.ajax({
				url: context+ '/post/fileupload',
				type: 'POST',
				data: formData,
				processData: false,
				contentType: false,
				success: () => {
					alert('파일업로드성공')
					onCreate()
				},
				error: e => {
					alert('파일업로드 실패')
				}
			})
		}) 
	}
	return {onCreate}
})()