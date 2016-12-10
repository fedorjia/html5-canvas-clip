var $canvas;
var $pointer;
var $tipIcon;
var $pointerView;
var $finishView;
var _centerX;
var _centerY;
var _canvasWidth;
var _canvasHeight;
var _angleX;
var _angleY;
var _clipArray = [false, false, false, false];
var _isFinishClip = false;

$(function() {
    // init
    init();

    // add events
    addEventListeners();
});

/***
 * initial elements & variables
 */
function init() {
    // clip
    var $canvasWrapper = $('#canvas');
    $canvasWrapper.clip({
        src: '/images/dim.png'
    });

    // init variables
    $pointer = $('#pointer');
    $canvas = $('#canvas');
    $pointerView = $('#pointer_view');
    $finishView = $('#finish_view');
    $tipIcon = $('#pointer_view .tip .icon');

    _centerX = $canvas.width()/2;
    _centerY = $canvas.height()/2;
    _canvasHeight = $canvas.height();
    _canvasWidth = $canvas.width();
    _angleY = Math.atan((_canvasWidth/2) / (_canvasHeight/2)) * 180 / Math.PI;
    _angleX = 90 - _angleY;

    // reset pointer
    transformPointer(_angleY-180);
}

/**
 * add pan event at pointer
 */
function addEventListeners() {
    // pan watch point event
    var hammerPointer = new Hammer(document.querySelector('#pointer'));
    hammerPointer.on('pan', onPanPointer);
}

/**
 * format angle theta
 */
function formatTheta(theta) {
    if(theta == 180) {
        theta = -180;
    }

    if(theta >= -180 && theta <= 90) {
        theta = 90 - theta;
    } else if(theta > 90 && theta < 180) {
        theta = 270 + (180-theta);
    }

    return theta;
}

/**
 * finish clip
 */
function finishClip() {
    _isFinishClip = true;

    $pointerView.hide();
    $finishView.show();

    $tipIcon.removeClass('start').addClass('stop');
}

/**
 * transform pointer
 */
function transformPointer(deg) {
    $pointer.css({
        'transform': "rotate(" + deg + "deg)",
        '-webkit-transform': "rotate(" + deg + "deg)"
    });
}

/**
 * pan pointer event
 */
function onPanPointer(ev) {
    if(_isFinishClip) {
        return;
    }
    if(ev.isFinal) {
        return;
    }

    var x;
    var y;
    var ctx = $canvas.data('clip').ctx;
    var radian = Math.atan2(_centerY - ev.center.y, ev.center.x - _centerX);
    var angle = radian * 180 / Math.PI; // radian to angle
    angle = formatTheta(angle); // format angle

    // clear
    $canvas.clip('clear', ctx);

    if(angle >= 180+_angleY && angle <= 270+_angleX) {
        if(_clipArray[0] && _clipArray[1] && _clipArray[2] && _clipArray[3]) {
            // finish clip
            finishClip();
            return;
        }
        _clipArray = [true, false, false, false];

        // transform pointer
        transformPointer(angle);

        // canvas clip
        y = (_canvasWidth/2) / Math.tan((angle-180)*Math.PI/180);
        ctx.beginPath();
        ctx.moveTo(_centerX, _centerY);
        ctx.lineTo(0, _canvasHeight);
        ctx.lineTo(0, y+_canvasHeight/2);
        ctx.fill();
        ctx.closePath();
    } else if((angle > 270+_angleX && angle < 360) || (angle >= 0 && angle < _angleX)) {
        if(_clipArray[0]) {
            _clipArray[1] = true;
            _clipArray[2] = false;
            _clipArray[3] = false;

            transformPointer(angle);

            x = Math.tan((360-angle)*Math.PI/180) * (_canvasHeight/2);
            ctx.beginPath();
            ctx.moveTo(_centerX, _centerY);
            ctx.lineTo(0, _canvasHeight);
            ctx.lineTo(0, 0);
            ctx.lineTo(_canvasWidth/2-x, 0);
            ctx.fill();
            ctx.closePath();
        }
    } else if(angle >= _angleX && angle < 180) {
        if(_clipArray[0] && _clipArray[1]) {

            _clipArray[2] = true;
            _clipArray[3] = false;

            transformPointer(angle);

            y = Math.tan((90-angle)*Math.PI/180) * (_canvasWidth/2);
            ctx.beginPath();
            ctx.moveTo(_centerX, _centerY);
            ctx.lineTo(0, _canvasHeight);
            ctx.lineTo(0, 0);
            ctx.lineTo(_canvasWidth, 0);
            ctx.lineTo(_canvasWidth, _canvasHeight/2-y);
            ctx.fill();
            ctx.closePath();
        }
    } else if(angle >= 180 && angle < 180+_angleY) {

        if(_clipArray[0] && _clipArray[1] && _clipArray[2]) {

            _clipArray[3] = true;

            transformPointer(angle);

            x = Math.tan((angle-180)*Math.PI/180) * (_canvasHeight/2);
            ctx.beginPath();
            ctx.moveTo(_centerX, _centerY);
            ctx.lineTo(0, _canvasHeight);
            ctx.lineTo(0, 0);
            ctx.lineTo(_canvasWidth, 0);
            ctx.lineTo(_canvasWidth, _canvasHeight);
            ctx.lineTo(_canvasWidth/2-x, _canvasHeight);
            ctx.fill();
            ctx.closePath();
        }
    }
}