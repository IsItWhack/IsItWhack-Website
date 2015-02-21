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

    $( document ).ready( function() {
        $( "#found_vote_up" ).click( function() {
            createVote( $( "#rateable_id" ).text(), 'up', function() {
                $( "#search_after" ).hide();
            } );
        } );

        $( "#found_vote_down" ).click( function() {
            createVote( $( "#rateable_id" ).text(), 'down', function() {
                $( "#search_after" ).hide();
            } );
        } );
    } );

}) ();