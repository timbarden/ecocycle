var ecoCycle = function(target, opts){
	
	var ecoClass = "ecocycle";

	//////////////////////////
	// defaults
	//////////////////////////
	this.defaults = {
		childNodes: '',
		dots: false,
		dotsChild: '<span></span>',
		dotsContainer: '.' + ecoClass +  '__dots',
		groupBy: 1,
		log: false,
		nav: false,
		navChild: ['<button>Prev</button>', '<button>Next</button>'],
		navContainer: ecoClass + '.__nav',
		onChange: function(intNext, intCount, opts){
		},
		onReady: function(opts){
		},
		pauseOnHover: false,
		shuffle: false,
		timeout: 7000
	}
	if (typeof target == "object"){
		target = target
	} else {
		target = document.querySelector(target);
	}
	var blnTarget = target != null;

	if (blnTarget){
		for (var property in opts) {
			opts.hasOwnProperty(property) && (this.defaults[property] = opts[property]);
		}
		var opts = this.defaults,
			blnMouseover = false,
			intSlideIndex = 0,
			trCurrentDir = "next",
			ecoInterval,
			ecoTimer,
			slideItems;
			
		slideItems = target.children;
		opts.childNodes != '' && (opts.shuffle = false, slideItems = target.querySelectorAll(opts.childNodes));
		var intItems = slideItems.length;

		opts.shuffle && shuffleList(slideItems)
	}


	//////////////////////////
	// init
	//////////////////////////
	this.init = function(){
		if (blnTarget){
			opts.log && console.log("initialized " + ecoClass);
	
			//opts.slideItems = 
			target.classList.add(ecoClass)
			for (var i=0; i<intItems; i++){
				slideItems[i].classList.add(ecoClass + '__item');
			}
	
			if (opts.nav){
				if (typeof opts.navContainer == "object"){
					opts.navContainer = opts.navContainer
				} else {
					opts.navContainer = document.querySelector(opts.navContainer);
				}
				if (intItems > 1){
					opts.navContainer.classList.add(ecoClass + '__nav');
					appendNav('prev', opts.navContainer, opts.navChild[0], "");
					appendNav('next', opts.navContainer, opts.navChild[1], "");
				}
			}
			if (opts.dots){
				if (typeof opts.dotsContainer == "object"){
					opts.dotsContainer = opts.dotsContainer
				} else {
					opts.dotsContainer = document.querySelector(opts.dotsContainer);
				}
				opts.dotsContainer.classList.add(ecoClass + '__dots');
				for (var i=0; i<intItems; i+=opts.groupBy){
					appendNav('dots', opts.dotsContainer, opts.dotsChild, i);
				}
			}
			if (opts.pauseOnHover){
				var thisCycle = this;
				target.addEventListener('mouseenter', function(){
					thisCycle.pause();
				});
				target.addEventListener('mouseleave', function(){
					thisCycle.play();
				});
			}

			opts.onReady(opts);
			this.play();
		
			function createElementFromHTML(htmlString) {
				var div = document.createElement('div');
				div.innerHTML = htmlString.trim();
				// Change this to div.childNodes to support multiple top-level nodes
				return div.firstChild; 
			}
			function appendNav(strNavType, strContainer, navBtn, index){
				var navControl = createElementFromHTML(navBtn);
				navControl.addEventListener('click', function(){
					clearInterval(ecoInterval);
					ecoInterval = null;
					if (strNavType == 'dots'){
						intSlideIndex = index;
					} else {
						setSlide(strNavType);
					}
					runSlide(intSlideIndex, "next");
				}, false);
				strContainer.appendChild(navControl);
			}
		}
	}


	//////////////////////////
	// play
	//////////////////////////
	this.play = function(){
		opts.log && console.log("play " + ecoClass);
		runSlide(intSlideIndex, "next");
	}
	
	
	//////////////////////////
	// pause
	//////////////////////////
	this.pause = function(){
		if (blnTarget){
			opts.log && console.log("pause " + ecoClass);
			clearInterval(ecoInterval);
			ecoInterval = null;
		}
	}
	

	//////////////////////////
	// prev
	//////////////////////////
	this.prev = function(){
		setSlide("prev");
	}


	//////////////////////////
	// next
	//////////////////////////
	this.next = function(){
		setSlide("next");
	}


	//////////////////////////
	// destroy
	//////////////////////////
	this.destroy = function(){
		opts.log && console.log("destroy " + ecoClass);
		if (blnTarget){
			clearInterval(ecoInterval);
			ecoInterval = null;
			target.classList.remove(ecoClass);
			for (var i=0; i<intItems; i++){
				slideItems[i].classList.remove(ecoClass + '__item');
				slideItems[i].classList.remove('active');
			}
			opts.navContainer.innerHTML = "";
			opts.dotsContainer.innerHTML = "";
		}
	}


	//////////////////////////
	// general functions
	//////////////////////////
	function runSlide( int, dir ){
		opts.log && console.log(ecoClass + " slide " + int);
		switchClasses( int, function(){
			if (intItems > 1){
				if (opts.timeout){
					ecoTimer = function(){
						ecoInterval = setInterval(function(){
							setSlide(dir);
							switchClasses( intSlideIndex, function(){});
						}, opts.timeout);
					}
					ecoTimer();
				}
			}
		})
	}

	function setSlide(direction){
		if (direction == "prev"){;
			intSlideIndex == 0 ? (intSlideIndex = (Math.ceil(intItems/opts.groupBy)-1)*opts.groupBy) : (intSlideIndex-=opts.groupBy);
		} else {
			intSlideIndex >= intItems-opts.groupBy ? (intSlideIndex = 0) : (intSlideIndex+=opts.groupBy);
		}
	}

	function switchClasses( intSlideIndex, callback ){
		opts.onChange(intSlideIndex, intItems-1, opts);
		function toggleActive(strEl, type){
			for (var i=0; i<intItems; i++){
				strEl[i] != undefined && strEl[i].classList.remove('active');
			}
			switch(type) {
				case "dots":
					strEl[intSlideIndex/opts.groupBy] != undefined && strEl[intSlideIndex/opts.groupBy].classList.add('active');
					break;
				default:
					for (var i=intSlideIndex; i<intSlideIndex+opts.groupBy; i++){
						strEl[i] != undefined && strEl[i].classList.add('active');
					}
			}
		}
		if (slideItems[intSlideIndex] != undefined){
			imgLoadCheck(slideItems[intSlideIndex].querySelector('[data-src]'), false, function(){});
		}
		toggleActive(slideItems, "");
		opts.dots && toggleActive(opts.dotsContainer.children, "dots");
		callback();
	}

	function shuffleList(strEl){
		var temp = document.createDocumentFragment();
		while (strEl.length) {
			temp.appendChild(strEl[Math.floor(Math.random() * strEl.length)]);
		}
		target.appendChild(temp);
	}
}