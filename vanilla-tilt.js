var VanillaTilt = (function () {
    'use strict';
    
    var classCallCheck = function (instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    };
    
    /**
     * Created by Sergiu Șandor (micku7zu) on 1/27/2017.
     * Original idea: https://github.com/gijsroge/tilt.js
     * MIT License.
     * Version 1.8.1
     */
    
    var VanillaTilt = function () {
      function VanillaTilt(element) {
        var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        classCallCheck(this, VanillaTilt);
    
        if (!(element instanceof Node)) {
          throw "Can't initialize VanillaTilt because " + element + " is not a Node.";
        }
    
        this.width = null;
        this.height = null;
        this.clientWidth = null;
        this.clientHeight = null;
        this.left = null;
        this.top = null;
    
        // for Gyroscope sampling
        this.gammazero = null;
        this.betazero = null;
        this.lastgammazero = null;
        this.lastbetazero = null;
    
        this.transitionTimeout = null;
        this.updateCall = null;
        this.event = null;
    
        this.updateBind = this.update.bind(this);
        this.resetBind = this.reset.bind(this);
    
        this.element = element;
        this.settings = this.extendSettings(settings);
    
        this.reverse = this.settings.reverse ? -1 : 1;
        this.resetToStart = VanillaTilt.isSettingTrue(this.settings["reset-to-start"]);
        this.glare = VanillaTilt.isSettingTrue(this.settings.glare);
        this.glarePrerender = VanillaTilt.isSettingTrue(this.settings["glare-prerender"]);
        this.fullPageListening = VanillaTilt.isSettingTrue(this.settings["full-page-listening"]);
        this.gyroscope = VanillaTilt.isSettingTrue(this.settings.gyroscope);
        this.gyroscopeSamples = this.settings.gyroscopeSamples;
    
        this.elementListener = this.getElementListener();
    
        if (this.glare) {
          this.prepareGlare();
        }
    
        if (this.fullPageListening) {
          this.updateClientSize();
        }
    
        this.addEventListeners();
        this.reset();
    
        if (this.resetToStart === false) {
          this.settings.startX = 0;
          this.settings.startY = 0;
        }
      }
    
      VanillaTilt.isSettingTrue = function isSettingTrue(setting) {
        return setting === "" || setting === true || setting === 1;
      };
    
      /**
       * Method returns element what will be listen mouse events
       * @return {Node}
       */
    
    
      VanillaTilt.prototype.getElementListener = function getElementListener() {
        if (this.fullPageListening) {
          return window.document;
        }
    
        if (typeof this.settings["mouse-event-element"] === "string") {
          var mouseEventElement = document.querySelector(this.settings["mouse-event-element"]);
    
          if (mouseEventElement) {
            return mouseEventElement;
          }
        }
    
        if (this.settings["mouse-event-element"] instanceof Node) {
          return this.settings["mouse-event-element"];
        }
    
        return this.element;
      };
    
      /**
       * Method set listen methods for this.elementListener
       * @return {Node}
       */
    
    
      VanillaTilt.prototype.addEventListeners = function addEventListeners() {
        this.onMouseEnterBind = this.onMouseEnter.bind(this);
        this.onMouseMoveBind = this.onMouseMove.bind(this);
        this.onMouseLeaveBind = this.onMouseLeave.bind(this);
        this.onWindowResizeBind = this.onWindowResize.bind(this);
        this.onDeviceOrientationBind = this.onDeviceOrientation.bind(this);
    
        this.elementListener.addEventListener("mouseenter", this.onMouseEnterBind);
        this.elementListener.addEventListener("mouseleave", this.onMouseLeaveBind);
        this.elementListener.addEventListener("mousemove", this.onMouseMoveBind);
    
        if (this.glare || this.fullPageListening) {
          window.addEventListener("resize", this.onWindowResizeBind);
        }
    
        if (this.gyroscope) {
          window.addEventListener("deviceorientation", this.onDeviceOrientationBind);
        }
      };
    
      /**
       * Method remove event listeners from current this.elementListener
       */
    
    
      VanillaTilt.prototype.removeEventListeners = function removeEventListeners() {
        this.elementListener.removeEventListener("mouseenter", this.onMouseEnterBind);
        this.elementListener.removeEventListener("mouseleave", this.onMouseLeaveBind);
        this.elementListener.removeEventListener("mousemove", this.onMouseMoveBind);
    
        if (this.gyroscope) {
          window.removeEventListener("deviceorientation", this.onDeviceOrientationBind);
        }
    
        if (this.glare || this.fullPageListening) {
          window.removeEventListener("resize", this.onWindowResizeBind);
        }
      };
    
      VanillaTilt.prototype.destroy = function destroy() {
        clearTimeout(this.transitionTimeout);
        if (this.updateCall !== null) {
          cancelAnimationFrame(this.updateCall);
        }
    
        this.element.style.willChange = "";
        this.element.style.transition = "";
        this.element.style.transform = "";
        this.resetGlare();
    
        this.removeEventListeners();
        this.element.vanillaTilt = null;
        delete this.element.vanillaTilt;
    
        this.element = null;
      };
    
      VanillaTilt.prototype.onDeviceOrientation = function onDeviceOrientation(event) {
        if (event.gamma === null || event.beta === null) {
          return;
        }
    
        this.updateElementPosition();
    
        if (this.gyroscopeSamples > 0) {
          this.lastgammazero = this.gammazero;
          this.lastbetazero = this.betazero;
    
          if (this.gammazero === null) {
            this.gammazero = event.gamma;
            this.betazero = event.beta;
          } else {
            this.gammazero = (event.gamma + this.lastgammazero) / 2;
            this.betazero = (event.beta + this.lastbetazero) / 2;
          }
    
          this.gyroscopeSamples -= 1;
        }
    
        var totalAngleX = this.settings.gyroscopeMaxAngleX - this.settings.gyroscopeMinAngleX;
        var totalAngleY = this.settings.gyroscopeMaxAngleY - this.settings.gyroscopeMinAngleY;
    
        var degreesPerPixelX = totalAngleX / this.width;
        var degreesPerPixelY = totalAngleY / this.height;
    
        var angleX = event.gamma - (this.settings.gyroscopeMinAngleX + this.gammazero);
        var angleY = event.beta - (this.settings.gyroscopeMinAngleY + this.betazero);
    
        var posX = angleX / degreesPerPixelX;
        var posY = angleY / degreesPerPixelY;
    
        if (this.updateCall !== null) {
          cancelAnimationFrame(this.updateCall);
        }
    
        this.event = {
          clientX: posX + this.left,
          clientY: posY + this.top
        };
    
        this.updateCall = requestAnimationFrame(this.updateBind);
      };
    
      VanillaTilt.prototype.onMouseEnter = function onMouseEnter() {
        this.updateElementPosition();
        this.element.style.willChange = "transform";
        this.setTransition();
      };
    
      VanillaTilt.prototype.onMouseMove = function onMouseMove(event) {
        if (this.updateCall !== null) {
          cancelAnimationFrame(this.updateCall);
        }
    
        this.event = event;
        this.updateCall = requestAnimationFrame(this.updateBind);
      };
    
      VanillaTilt.prototype.onMouseLeave = function onMouseLeave() {
        this.setTransition();
    
        if (this.settings.reset) {
          requestAnimationFrame(this.resetBind);
        }
      };
    
      VanillaTilt.prototype.reset = function reset() {
        this.onMouseEnter();
    
        if (this.fullPageListening) {
          this.event = {
            clientX: (this.settings.startX + this.settings.max) / (2 * this.settings.max) * this.clientWidth,
            clientY: (this.settings.startY + this.settings.max) / (2 * this.settings.max) * this.clientHeight
          };
        } else {
          this.event = {
            clientX: this.left + (this.settings.startX + this.settings.max) / (2 * this.settings.max) * this.width,
            clientY: this.top + (this.settings.startY + this.settings.max) / (2 * this.settings.max) * this.height
          };
        }
    
        var backupScale = this.settings.scale;
        this.settings.scale = 1;
        this.update();
        this.settings.scale = backupScale;
        this.resetGlare();
      };
    
      VanillaTilt.prototype.resetGlare = function resetGlare() {
        if (this.glare) {
          this.glareElement.style.transform = "rotate(180deg) translate(-50%, -50%)";
          this.glareElement.style.opacity = "0";
        }
      };
    
      VanillaTilt.prototype.getValues = function getValues() {
        var x = void 0,
            y = void 0;
    
        if (this.fullPageListening) {
          x = this.event.clientX / this.clientWidth;
          y = this.event.clientY / this.clientHeight;
        } else {
          x = (this.event.clientX - this.left) / this.width;
          y = (this.event.clientY - this.top) / this.height;
        }
    
        x = Math.min(Math.max(x, 0), 1);
        y = Math.min(Math.max(y, 0), 1);
    
        var tiltX = (this.reverse * (this.settings.max - x * this.settings.max * 2)).toFixed(2);
        var tiltY = (this.reverse * (y * this.settings.max * 2 - this.settings.max)).toFixed(2);
        var angle = Math.atan2(this.event.clientX - (this.left + this.width / 2), -(this.event.clientY - (this.top + this.height / 2))) * (180 / Math.PI);
    
        return {
          tiltX: tiltX,
          tiltY: tiltY,
          percentageX: x * 100,
          percentageY: y * 100,
          angle: angle
        };
      };
    
      VanillaTilt.prototype.updateElementPosition = function updateElementPosition() {
        var rect = this.element.getBoundingClientRect();
    
        this.width = this.element.offsetWidth;
        this.height = this.element.offsetHeight;
        this.left = rect.left;
        this.top = rect.top;
      };
    
      VanillaTilt.prototype.update = function update() {
        var values = this.getValues();
    
        this.element.style.transform = "perspective(" + this.settings.perspective + "px) " + "rotateX(" + (this.settings.axis === "x" ? 0 : values.tiltY) + "deg) " + "rotateY(" + (this.settings.axis === "y" ? 0 : values.tiltX) + "deg) " + "scale3d(" + this.settings.scale + ", " + this.settings.scale + ", " + this.settings.scale + ")";
    
        if (this.glare) {
          this.glareElement.style.transform = "rotate(" + values.angle + "deg) translate(-50%, -50%)";
          this.glareElement.style.opacity = "" + values.percentageY * this.settings["max-glare"] / 100;
        }
    
        this.element.dispatchEvent(new CustomEvent("tiltChange", {
          "detail": values
        }));
    
        this.updateCall = null;
      };
    
      /**
       * Appends the glare element (if glarePrerender equals false)
       * and sets the default style
       */
    
    
      VanillaTilt.prototype.prepareGlare = function prepareGlare() {
        // If option pre-render is enabled we assume all html/css is present for an optimal glare effect.
        if (!this.glarePrerender) {
          // Create glare element
          var jsTiltGlare = document.createElement("div");
          jsTiltGlare.classList.add("js-tilt-glare");
    
          var jsTiltGlareInner = document.createElement("div");
          jsTiltGlareInner.classList.add("js-tilt-glare-inner");
    
          jsTiltGlare.appendChild(jsTiltGlareInner);
          this.element.appendChild(jsTiltGlare);
        }
    
        this.glareElementWrapper = this.element.querySelector(".js-tilt-glare");
        this.glareElement = this.element.querySelector(".js-tilt-glare-inner");
    
        if (this.glarePrerender) {
          return;
        }
    
        Object.assign(this.glareElementWrapper.style, {
          "position": "absolute",
          "top": "0",
          "left": "0",
          "width": "100%",
          "height": "100%",
          "overflow": "hidden",
          "pointer-events": "none",
          "border-radius": "inherit"
        });
    
        Object.assign(this.glareElement.style, {
          "position": "absolute",
          "top": "50%",
          "left": "50%",
          "pointer-events": "none",
          "background-image": "linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)",
          "transform": "rotate(180deg) translate(-50%, -50%)",
          "transform-origin": "0% 0%",
          "opacity": "0"
        });
    
        this.updateGlareSize();
      };
    
      VanillaTilt.prototype.updateGlareSize = function updateGlareSize() {
        if (this.glare) {
          var glareSize = (this.element.offsetWidth > this.element.offsetHeight ? this.element.offsetWidth : this.element.offsetHeight) * 2;
    
          Object.assign(this.glareElement.style, {
            "width": glareSize + "px",
            "height": glareSize + "px"
          });
        }
      };
    
      VanillaTilt.prototype.updateClientSize = function updateClientSize() {
        this.clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    
        this.clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      };
    
      VanillaTilt.prototype.onWindowResize = function onWindowResize() {
        this.updateGlareSize();
        this.updateClientSize();
      };
    
      VanillaTilt.prototype.setTransition = function setTransition() {
        var _this = this;
    
        clearTimeout(this.transitionTimeout);
        this.element.style.transition = this.settings.speed + "ms " + this.settings.easing;
        if (this.glare) this.glareElement.style.transition = "opacity " + this.settings.speed + "ms " + this.settings.easing;
    
        this.transitionTimeout = setTimeout(function () {
          _this.element.style.transition = "";
          if (_this.glare) {
            _this.glareElement.style.transition = "";
          }
        }, this.settings.speed);
      };
    
      /**
       * Method return patched settings of instance
       * @param {boolean} settings.reverse - reverse the tilt direction
       * @param {number} settings.max - max tilt rotation (degrees)
       * @param {startX} settings.startX - the starting tilt on the X axis, in degrees. Default: 0
       * @param {startY} settings.startY - the starting tilt on the Y axis, in degrees. Default: 0
       * @param {number} settings.perspective - Transform perspective, the lower the more extreme the tilt gets
       * @param {string} settings.easing - Easing on enter/exit
       * @param {number} settings.scale - 2 = 200%, 1.5 = 150%, etc..
       * @param {number} settings.speed - Speed of the enter/exit transition
       * @param {boolean} settings.transition - Set a transition on enter/exit
       * @param {string|null} settings.axis - What axis should be enabled. Can be "x" or "y"
       * @param {boolean} settings.glare - if it should have a "glare" effect
       * @param {number} settings.max-glare - the maximum "glare" opacity (1 = 100%, 0.5 = 50%)
       * @param {boolean} settings.glare-prerender - false = VanillaTilt creates the glare elements for you, otherwise
       * @param {boolean} settings.full-page-listening - If true, parallax effect will listen to mouse move events on the whole document, not only the selected element
       * @param {string|object} settings.mouse-event-element - String selector or link to HTML-element what will be listen mouse events
       * @param {boolean} settings.reset - false = If the tilt effect has to be reset on exit
       * @param {boolean} settings.reset-to-start - true = On reset event (mouse leave) will return to initial start angle (if startX or startY is set)
       * @param {gyroscope} settings.gyroscope - Enable tilting by deviceorientation events
       * @param {gyroscopeSensitivity} settings.gyroscopeSensitivity - Between 0 and 1 - The angle at which max tilt position is reached. 1 = 90deg, 0.5 = 45deg, etc..
       * @param {gyroscopeSamples} settings.gyroscopeSamples - How many gyroscope moves to decide the starting position.
       */
    
    
      VanillaTilt.prototype.extendSettings = function extendSettings(settings) {
        var defaultSettings = {
          reverse: false,
          max: 15,
          startX: 0,
          startY: 0,
          perspective: 1000,
          easing: "cubic-bezier(.03,.98,.52,.99)",
          scale: 1,
          speed: 500,
          transition: true,
          axis: null,
          glare: false,
          "max-glare": 1,
          "glare-prerender": false,
          "full-page-listening": false,
          "mouse-event-element": null,
          reset: true,
          "reset-to-start": true,
          gyroscope: true,
          gyroscopeMinAngleX: -45,
          gyroscopeMaxAngleX: 45,
          gyroscopeMinAngleY: -45,
          gyroscopeMaxAngleY: 45,
          gyroscopeSamples: 10
        };
    
        var newSettings = {};
        for (var property in defaultSettings) {
          if (property in settings) {
            newSettings[property] = settings[property];
          } else if (this.element.hasAttribute("data-tilt-" + property)) {
            var attribute = this.element.getAttribute("data-tilt-" + property);
            try {
              newSettings[property] = JSON.parse(attribute);
            } catch (e) {
              newSettings[property] = attribute;
            }
          } else {
            newSettings[property] = defaultSettings[property];
          }
        }
    
        return newSettings;
      };
    
      VanillaTilt.init = function init(elements, settings) {
        if (elements instanceof Node) {
          elements = [elements];
        }
    
        if (elements instanceof NodeList) {
          elements = [].slice.call(elements);
        }
    
        if (!(elements instanceof Array)) {
          return;
        }
    
        elements.forEach(function (element) {
          if (!("vanillaTilt" in element)) {
            element.vanillaTilt = new VanillaTilt(element, settings);
          }
        });
      };
    
      return VanillaTilt;
    }();
    
    if (typeof document !== "undefined") {
      /* expose the class to window */
      window.VanillaTilt = VanillaTilt;
    
      /**
       * Auto load
       */
      VanillaTilt.init(document.querySelectorAll("[data-tilt]"));
    }
    
    return VanillaTilt;
    
    }());
    /*========= ========================== ================ toggle icon navbar======================== =====*/
    let menuIcon = document.querySelector('#menu-icon');
    let navbar = document.querySelector('.navbar');

    menuIcon.onclick = () => {
      menuIcon.classList.toggle('bx-x');
      navbar.classList.toggle('active');
    };
    /*========= ========================== ================ scroll section avtive link ======================== =====*/
    let sections = document.querySelectorAll('section');
    let navLinks = document.querySelectorAll('header nav a');

    window.onscroll =() => {
      sections.forEach(sec =>{
        let tap =window.scrollY;
        let offset = sec.offsetTop -150;
        let height = sec.getAttribute('id');

        if(top >= offset &&top < offset + height){
          navLinks.forEach(link => {
             links.classList.remove('active');
             document.querySelector('header nav a[href*='+ id +']').classList.add('active');
          });

        };
      });
        <script>
    // Initialize ScrollReveal
    const sr = ScrollReveal({
        origin: 'top',     // The element will come from the top
        distance: '50px',  // Distance the element moves
        duration: 1000,    // Duration of the animation in milliseconds
        delay: 200,        // Delay before the animation starts
        reset: true        // Animation happens every time you scroll back
    });

    // Apply ScrollReveal to elements
    sr.reveal('.home-content', { origin: 'left', delay: 300 });
    sr.reveal('.home-img', { origin: 'right', delay: 400 });
    sr.reveal('.Projects .heading', { delay: 300 });
    sr.reveal('.Projects .card', { interval: 200 });
    sr.reveal('.Skills .heading', { delay: 300 });
    sr.reveal('.Skills .box', { interval: 200 });
    sr.reveal('.contact', { origin: 'bottom', delay: 300 });
</script>

      /*========= ========================== ================ sticky navbar ======================== =====*/
      let header = document.querySelector('header');

      header.classList.toggle('sticky',window.scrollY >100);
      /*========= ========================== remove toggle icon and navbar when click navbar link (scroll)================  ======================== =====*/
      menuIcon.classList.remove('bx-x');
      navbar.classList.remove('active');
    };

    /*========= ========================== scroll tracker ======================== =====*/
  
   /*========= ========================== scroll tracker ======================== =====*/
    navLinks.forEach((navLink) => {
      navLink.addEventListener('click', (e)=> {
         e.preventDefault();
         let target = document.querySelector(e.target.hash);
         let top = target.offsetTop - 120; //subtracting from the total to account for the fixed header size
         window.scrollTo({
          top: top,
          behavior: 'smooth'
          })
       });    navLinks.forEach((navLink) => {
      navLink.addEventListener('click', (e)=> {
         e.preventDefault();
         let target = document.querySelector(e.target.hash);
         let top = target.offsetTop - 120; //subtracting from the total to account for the fixed header size
         window.scrollTo({
          top: top,
          behavior: 'smooth'
          })
       });
    
      window.onscroll = ()=>{
        onScroll(navLinks,menuIcon,navbar);
        }
        });
    });
  

    /*=============projects  section animation ====================== */ 
    $('button').click(function(){
      var lang = $('html').attr('lang');
      if(lang == 'en') $('html').attr('lang','es');
      if(lang == 'es') $('html').attr('lang','en');
    });
    $('.project').hover(function(){
      $(this).find('.overlay').addClass('show');
      $(this).find('.text').addClass('show');
    }, function(){
      $(this).find('.overlay, .text').removeClass('show');
      });

    // Smooth scrolling using jQuery easing
    $(document).ready(function() {
      $('a[href*="#"]:not([href="#"])').click(function(e) {
        e.preventDefault();
    
        const target = $(this.hash);
        const topSpace = $('#header').outerHeight();
    
        if (target.length) {
          $('html, body').animate({
            scrollTop: target.offset().top - topSpace
          }, 1500);
        }
    
        window.location.hash = target.selector;
      });
    });

/*=============skills progress bar ====================== */ 
$(".progress-value").each(function () {
  var $this = $(this),
  $label = $this.next("div"),
  $percent = $this.data("percent");
  var $bar = $("<div class='bar'></div>");
  $bar.css({
    width: $percent + "%"
    });
  $label.html($percent + "%");
  $this.append($bar);
});
// Toggle for dropdown menu in navbar on small devices
$(document).ready(function() {
  $("#navbarToggle").on("click", function(event) {
    event.preventDefault();
    $("#navMenu").toggleClass("show");
  });

  $(window).scroll(function() {
    const scrollTop = $(window).scrollTop();
    const headerHeight = $("#header").outerHeight();

    if (scrollTop >= headerHeight) {
      $("#navbarToggle").addClass("fixed-top");
    } else {
      $("#navbarToggle").removeClass("fixed-top");
    }
  });
});
    /* Show or hide the sticky header when you scroll the page */
    if ($(this).scrollTop() > 200) {
      $('#header').addClass('sticky');
    } else {
      $('#header').removeClass('sticky');
    };

   /*============= Scroll Reveal ========================*/
window.sr = ScrollReveal({ reset: true, mobileCheck: function() { return false; } });

sr.reveal('.foo', {
  duration: 1500,
  origin: 'bottom',
  // distance: '30px',
  // scale: 0.8,
  // easing: 'cubic-bezier(.215, .100,.355,1)' // The ease function support argument: http://easings.net/
});

sr.reveal('#about', {
  delay: 400,
  easing: 'fade'
});

sr.reveal('#skills', {
  delay: 600,
  easing: 'bounce'
});
/*============= Magnific Popup =========================*/
$(".popup-link").magnificPopup({ type: "image" });

/*============= Owl Carousel ===========================*/
$(document).ready(function () {
  $('.owl-carousel').owlCarousel({
    loop:true,
    margin:10,
    nav:false,
    dots: true,
    autoplay: true,
    responsive:{
      0:{
        items:1
        },
        600:{
          items:2
      },
      1000:{
        items:3
        }
    }
    })
})

/*============== Isotope Projects Filter ===============*/
// init Isotope
var $grid = $('#projects').isotope({
  itemSelector: '.project',
  layoutMode: 'fitRows'
});
// filter functions
var filterFns = {
  // show if number is greater than 50
  numberGreaterThan50: function() {
    var number = $(this).find('.number').text();
    return parseFloat( number, 10) > 50;
    },
  // bind filter button click
  bindFilterButton: function( selector, filters ) {
    $(selector).on('click', function() {
      $grid.isotope().filter(filters);
      });
     }
     };
     // bind filter button
     filterFns.bindFilterButton('#filter-button-group .btn', '.filter-class');
     // change active class on buttons
     $('.btn').each(function(i, btn) {
      var $btn = $(btn);
      $btn.on('click', function() {
        $('.btn').removeClass('active');
        $btn.addClass('active');
        });
     });
     /**mobile   */
 
     if ($(window).width() < 768) {
      $('ul#filter-button-group').detach().appendTo('body').css('display','block');
      $("#filter-button-group").sticky({ topSpacing: 43 }).on("stick", function(){
       $(".navbar-toggle").trigger("click");
       }).on("unstick", function(){
       $(".navbar-toggle").trigger("click");
       });
     } else {
      $("#filter-button-group").detach().prependTo('#projects').css('display','inline-block');
     }
     $(window).resize(function(  ){
      if($(window).width() >= 768){
        $('#filter-button-group').detach( ).prependTo('#projects');
        $("#filter-button-group").trigger("sticky_kit:unstick");
        }else{
          $("#filter-button-group").trigger("sticky_kit:unstick");
          $('#filter-button-group').sticky({ topSpacing: 43 });
          }
         })
         .load( function( ){$(window).trigger('resize')});

      

