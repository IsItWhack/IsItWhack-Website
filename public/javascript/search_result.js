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
        $( "#search_down_arrow" ).click( function() {
            startScroll( "#search_after" )
        } );
    } );

}) ();