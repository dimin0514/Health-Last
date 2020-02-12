var mypage = mypage || {}
mypage = (() => {
	let context, img, css, js
	let mypage_vue_js
	let brd_js
	let app_js,navi_vue_js, auth_js, routine_js
	let height , weight ,bmi
	let currentTitle;
//	let calendarBody;
	let first ,pageYear ,pageFirst

	let init = () => {
		height = sessionStorage.getItem('height')
		weight = sessionStorage.getItem('weight')
		context = $.ctx()
		img = $.img()
		css = $.css()
		js = $.js()
		mypage_vue_js = js + '/vue/user/mypage_vue.js'
		brd_js = js + '/brd/brd.js'
		app_js = js + '/app.js'
		navi_vue_js = js + '/vue/menu/navi_vue.js'
		auth_js  = js + '/user/auth.js'
		routine_js = js + '/user/routine.js'
		
	}
	let onCreate = () => {
		init()
		$.when(
			$.getScript(mypage_vue_js),
			$.getScript(brd_js),
			$.getScript(routine_js),
			$.getScript(app_js),
			$.getScript(navi_vue_js),
			$.getScript(auth_js)
			
		).done(() => {
			setContentView()
			gomodify()
			gochart()
			goroutine()
			gohelgram()
			goHome()
			RecipePage()
		}).fail(() => {
			alert('조졌다')
		})
	}
	let setContentView = () => {
		$('head').append(login_vue.login_head())
		$('.masthead2').remove()
		$('.page-footer').remove()
		$('#mainpage').empty()
		$('<div id="contents" class="container" style="margin-top : 80px;"></div>').appendTo('#mainpage')
		$('#contents').append(mypage_vue.mypage_main())
		$('h1[class="text-center"]').text('어서오세요'+ sessionStorage.getItem('uname') +'님')
	}
	let gomodify = () => {
		$('a[class="myModify"] span')
			.click(e => {
				e.preventDefault()
				$('.masthead').remove()
				$('.page-footer').remove()
				$('#mainpage').empty()
				$('<div id="contents" class="container" style="margin-top : 80px;"></div>').appendTo('#mainpage')
				$('#contents').append(mypage_vue.mypage_modify({ css: $.css() }))
			})
		$('#security').click(e=>{
			e.preventDefault()
			alert('클릭')
		})
	}
	let RecipePage =()=>{
		$('a[class="myRecipe"] span').click(e=>{
			e.preventDefault()
			$('.masthead').remove()
			$('.page-footer').remove()
			$('#mainpage').empty()
			$('<div id="contents" class="container" style="margin-top : 80px;"></div>').appendTo('#mainpage')
			$('#contents').append(mypage_vue.mypage_recipe())
			goRecipe({currPage : 0})
		})
	}
	let goRecipe =x=>{
			$.getJSON(context + '/recipe/info/'+x.currPage+'',d=>{
				$('div[class="row"]').empty()
				$('ul[class="pagination"]').empty()
				console.log(d)
				let page = d.pagination
				let list = d.recipe
//				alert(`page :::  ${page.startRow}`)
//				alert(`자바스크립트로 넘어온 값  :${JSON.stringify(page)}`)
				
				$.each(list,(i,j)=>{
					$(`<div class="col-lg-4" style="float : left; width: 350px;height:300px; margin-bottom:110px;">
						<div class="card-deck" style="
						    width: 336px;
						    height: 300px;
						    margin-bottom : 110px;
						">
					   <div class="card" style="width : 336px; height : 300px;">
					   <img id="recipe_img" src="${j.FIMG}" class="card-img-top" alt="">
					   <div class="card-body" style="height : 120px;">
					   <h5 class="card-title"><a href="${j.LINK}">${j.FNAME}</a></h5>
					  
					   </div>
						</div>
					   </div>`).appendTo('div[class="row"]')
				})
				$('#recipe_img').popover('show')
				if(page.existPrev){
					$(`<li class="page-item"><a class="page-link" href="#">
					   <span aria-hidden="true">&laquo;</span>
					   <span class="sr-only">Previous</span>
					   </a>
					   </li>`).prependTo('ul[class="pagination"]').click(e=>{
						   e.preventDefault()
						   alert('이전클릭')
						   goRecipe({currPage : page.prevBlock})
					   })
				}
					   for(let i =page.startPage; i<=page.endPage; i++){
						   if(page.currPage == i){
							   $(`<li class="page-item"><a class="page-link" href="#">${i+1}</a></li>`)
							   .appendTo('ul[class="pagination"]')
							   .click(e=>{
								   alert(`${i+1} 클릭`)
								   $('html').scrollTop(0)
							   })
						   }else{
							   $(`<li class="page-item"><a class="page-link" href="#">${i+1}</a></li>`)
							   .appendTo('ul[class="pagination"]')
							   .click(function(e){
								   e.preventDefault()
								   alert(`${i + 1}클릭`)
								   goRecipe({currPage : i})
								   $('html').scrollTop(0)
							})
						   }
					   }
				if(page.existNext){
					$(`<li class="page-item">
					   <a class="page-link" href="#" aria-label="Next">
					   <span aria-hidden="true">&raquo;</span>
					   <span class="sr-only">Next</span>
					   </a>
					   </li>`).appendTo('ul[class="pagination"]').click(e=>{
						   e.preventDefault()
						   alert('다음 클릭')
						   goRecipe({currPage : page.nextBlock})
					   })
				}
			})
	}
	let gochart =()=>{
		$('a[class="myChart"] span'  )
		.click(e=>{
			e.preventDefault()
			$('.masthead').remove()
			$('.page-footer').remove()
			$('#mainpage').empty()
			$('<div id="contents" class="container" style="margin-top : 80px;"></div>').appendTo('#mainpage')
			$('#contents').append(mypage_vue.mypage_chart(css))
			var ctx1 = $('#myChart1');
			var ctx2 = $('#myChart2');
			var ctx5 = $('#myChart5');
			bmi_chart()
			bmi_calc()
			line_chart(ctx1)
	//		pie_chart(ctx5)
			calendar()
		})
	
	}
   let calendar =()=>{
	   datepicker_kr()
	   $('<div/>',{id : 'datepicker'}).appendTo('.content')
	   $('#datepicker').datepicker({
		    closeText : '취소',
		    currentText : '출석',
		    showAnim : "slideDown",
			// 해당 월의 다른 월의 날짜가 보이는 여부, 예를 들면 10월이면 전후에 9월 마지막과 11월의 시작 일이 보이는 여부입니다. 즉, 달력이 꽉 차 보이게 하는 것
			showOtherMonths: true,
			// 선택 여부 (showOtherMonths 옵션과 같이 일치시키지 않으면 에러가 발생합니다.)
			selectOtherMonths: true,
			// 달력 밑에 오늘과 닫기 버튼이 보인다.
			showButtonPanel: true,
			// 년 월이 셀렉트 박스로 표현 되어서 선택할 수 있다.
			changeMonth: false,
			changeYear: false,
			// 한번에 보이는 개월 수
			numberOfMonths: 1,
			// 데이터 포멧
			dateFormat: "yy-mm-dd",
			// 텍스트 박스 옆의 달력 포시
			showOn: "button",
			//이미지 타입인지 버튼 타입인지 설정
			buttonImageOnly: true,
			// 이미지 경로
			buttonImage: "https://jqueryui.com/resources/demos/datepicker/images/calendar.gif",
			// 버튼 타입이면 버튼 값
			buttonText: "Select date"
	   })
	   $('#datepicker').datepicker().change(()=>{
		  
	   })
   }
   let datepicker_kr =()=>{
	   $.datepicker.setDefaults({
		   dateFormat : 'yy-mm-dd',
	       monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
	       monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
	       dayNames: ['일', '월', '화', '수', '목', '금', '토'],
	       dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
	       dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
	       showMonthAfterYear : true,
	       yearSuffix : '년'
	   })
   }
   let diet_list =()=>{
	   
   }
   let line_chart =x=>{
	   alert(2)
	   function getRandom(){
		   return Math.random() * (10 - 30) + 10
	   }
	   var myLineChart = new Chart(x, {
			type: 'line',
			data: {
				labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
				datasets: [	{
					label: '내 월 별 근골격량',
					data: [getRandom(), getRandom(), getRandom(), getRandom(), getRandom(), getRandom(), getRandom(), getRandom(), getRandom(), getRandom(), getRandom() ,getRandom()],
					backgroundColor: '#ff0066',
					borderColor: 'rgb(200, 0, 0)',
					borderWidth : 1,
					pointRadius : 5,
					pointHoverRadius : 10,
					pointBorderColor: 'yellow'
					
					},
					{label: '회원 평균 근골격량',
					borderColor: '#0000ff',
					data: [getRandom(), getRandom(), getRandom(), getRandom(), getRandom(), getRandom(), getRandom(), getRandom(), getRandom(), getRandom(), getRandom(), getRandom()],
					pointRadius : 5,
					pointHoverRadius : 10,
					fill:false
					}]
			},
			options: {
				maintainAspectRatio : false,
				animation : {
					animateScale : false,
					animateRotage : true
				}
				}
			})
   }
//   let pie_chart =x=>{
//		var myPieChart = new Chart(x,{
//			type : 'pie',
//			data :{
//				labels : ['월', '화', '수', '목', '금', '토', '일'],
//				datasets : [{
//					data : [3, 5, 6, 2, 6, 8, 6],
//					backgroundColor : ['#f5bd4f', '#f08530', '#d85348', '#861e52', '#15567e', '#23a8c0', '#38af9b'],
//				}]
//			},
//			options:{
//				cutoutPercentage: 80,
//				scaleBeginAtZero : true,
//				animation:{
//					animateRotage : true,
//					animateScale : false,
//				},
//				maintainAspectRatio : false,
//				title:{
//					display : true,
//					text: '부위 별 운동 횟수'
//			},
//			}
//		})
//   }
   let bmi_chart =x=>{
	   alert(`입력한 키 : ${height}  입력한 몸무게 : ${weight}`)
	   bmi = Math.floor(weight / ((height /100)* (height/100)))
	   var ctx2 = document.getElementById("myChart2").getContext("2d");
	   new Chart(ctx2, {
			type: "tsgauge",
			data: {
				labels : ['저체중','정상','비만','고도비만'],
				datasets: [{
					gaugeLabel : ['저체중','정상','비만','고도비만'],
					backgroundColor: ["#0fdc63", "#fd9704", "lime","lightblue","red"],
					borderWidth: 0,
					gaugeData: {
						value: bmi,
						valueColor: "#ff7143"
					},
					gaugeLimits: [10,18.5,23,25,30,40]
				}]
			},
			options: {
		            events: [],
		            showMarkers: true
			}
		})
   }
   let bmi_calc =()=>{
	   $('<span><h2>당신의 BMI지수 계산기</h2></span>').appendTo('.chart2')
		$('<input/>',{
			id : 'cm',
			placeholder : '키를 입력하세요',
		}).css({'margin-right' : '10px'}).appendTo('.chart2 span')
		$('<input/>',{
			id : 'kg',
			placeholder : '몸무게를 입력하세요'
		}).css({'margin-right' : '10px'}).appendTo('.chart2 span')
		$('<button/>',{
			text : '입력',
			id : 'bmi_btn'
		}).addClass('btn-primary').appendTo('.chart2 span')
		$('#bmi_btn').click(()=>{
			height = $('#cm').val()
			weight = $('#kg').val()
			bmi_chart()
		})
   }
	let goroutine = () => {
		$('a[class="myRoutine"] span')
			.click(e => {
				e.preventDefault()
				routine.onCreate()
			})
	}
	let gohelgram = () => {
		$('a[class="myHelgram"] span')
			.click(e => {
				e.preventDefault()
				brd.onCreate()
			})
	}
	let goHome =()=>{
		$('#home').click(e=>{
			e.preventDefault()
			auth.login_home()
		})
	}
	return { onCreate }
})()