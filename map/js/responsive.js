var mq992 = window.matchMedia("(min-width: 1025px)");
var mobileDevice;

function handleOrientationChange(mql) {

    if (mql.matches) {
        mobileDevice = false;
    } else {

        mobileDevice = true;
    }

}


