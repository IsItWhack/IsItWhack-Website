/**
 * Copyright of IsItWhack.com
 *
 * Authors:
 *     - Mike Lyons (m@IsItWhack.com)
 */

(function() {
    'use strict';

    var lastScrollTop = 0,
        SCROLL_SPEED = 200,
        scrolling = false;

    var startScroll = function( target ) {
        if( scrolling !== target ) {
            scrolling = target;

            $('html, body').stop().animate({
                scrollTop: $(target).offset().top
            }, SCROLL_SPEED, function() {
                scrolling = false;
            } );
        }
    };

    $( document ).ready( function() {
        lastScrollTop = $(this).scrollTop();
        $( window ).scroll( function( mes ) {
            var scrollTop = $(this ).scrollTop();
            if( scrollTop < lastScrollTop ) { // Scroll up
                startScroll( "#search_main" );
            } else { // Scroll down
                startScroll( "#search_after" );
            }
            lastScrollTop = scrollTop;
        } );
    } );

}) ();