/**
 * Copyright of IsItWhack.com
 *
 * Authors:
 *     - Mike Lyons (m@IsItWhack.com)
 */

(function() {
    'use strict';

    var createVote = function( item_id, vote, callback ) {
        $.ajax( {
            url: '/rateables/' + item_id + '/votes',
            data: {
                vote_type: vote
            },
            type: 'post'
        } ).done( callback );
    };

    var createItem = function( item_name, vote, callback ) {
        $.ajax( {
            url: '/rateables',
            data: {
                name: item_name,
                link: 'http://google.com/q=' + item_name
            },
            type: 'post'
        } ).done( function( response ) {
            createVote( response.id, vote, function() {
                callback( '/search?q=' + item_name );
            } );
        } )
    };

    $( document ).ready( function() {
        $( "#search_vote_up" ).click( function() {
            createItem( $( "#rateable_name" ).text(), 'up', function( redirect ) {
                window.location.replace( redirect );
            } );
        } );

        $( "#search_vote_down" ).click( function() {
            createItem( $( "#rateable_name" ).text(), 'down',function( redirect ) {
                window.location.replace( redirect );
            } );
        } );
    } );

}) ();