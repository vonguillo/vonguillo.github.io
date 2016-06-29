var mq800 = window.matchMedia("(min-width: 800px)");

function handleOrientationChange(mql) {

    if (mql.matches) {
        mobileDevice = false;
    } else {

        mobileDevice = true;
    }

}