'use strict';

var Snap = require('snapsvg');
var _ = require('lodash');
var getConnectionBBox = require('../../util/Elements').getConnectionBBox;

var GraphicsUtil = require('../../util/GraphicsUtil');


/**
 * @class
 *
 * A plugin that adds an outline to shapes and connections that may be activated and styled
 * via CSS classes.
 *
 * @param {EventBus} events the event bus
 */
function Outline(eventBus, styles, elementRegistry) {

  var OUTLINE_OFFSET_SHAPE = 5;
  var OUTLINE_OFFSET_CONNECTION = 7;

  var OUTLINE_STYLE = styles.cls('djs-outline', [ 'no-fill' ]);

  function createOutline(gfx, bounds) {
    return Snap.create('rect', OUTLINE_STYLE).prependTo(gfx);
  }

  function updateShapeOutline(outline, bounds) {

    outline.attr({
      x: -OUTLINE_OFFSET_SHAPE,
      y: -OUTLINE_OFFSET_SHAPE,
      width: bounds.width + OUTLINE_OFFSET_SHAPE * 2,
      height: bounds.height + OUTLINE_OFFSET_SHAPE * 2
    });
  }

  function updateConnectionOutline(outline, connection) {

    var bbox = getConnectionBBox(connection);

    outline.attr({
      x: bbox.x - OUTLINE_OFFSET_CONNECTION,
      y: bbox.y - OUTLINE_OFFSET_CONNECTION,
      width: bbox.width + OUTLINE_OFFSET_CONNECTION * 2,
      height: bbox.height + OUTLINE_OFFSET_CONNECTION * 2
    });
  }

  eventBus.on([ 'shape.added', 'shape.changed' ], function(event) {
    var element = event.element,
        gfx     = event.gfx;

    var outline = gfx.select('.djs-outline');

    if (!outline) {
      outline = createOutline(gfx, element);
    }

    updateShapeOutline(outline, element);
  });

  eventBus.on([ 'connection.added', 'connection.changed' ], function(event) {
    var element = event.element,
        gfx     = event.gfx;

    var outline = gfx.select('.djs-outline');

    if (!outline) {
      outline = createOutline(gfx, element);
    }

    updateConnectionOutline(outline, element);
  });


}


Outline.$inject = ['eventBus', 'styles', 'elementRegistry'];

module.exports = Outline;