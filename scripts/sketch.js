// TODO : REFACTOR !
// INTERFACE STYLIZE
const MAX_ANGLE = 360;

let A, f_i, f_red, red_index, r, x, y, z, n_side, n_shape, offset, strum, padding, s_w, A_sh_factor, y_min, y_max, y_delta, started;

A = 140; // 1000
A_sh_factor = 4;
red_index = 15;
s_w = 4
f_i = Math.random() * 14000 + 200;
dummy = Math.random() * 255;
f_red = f_i % red_index;
n_side = 160;
n_shape = A / A_sh_factor;
offset = 0;
strum = 100;
padding = 200;
y_min = 100;
y_max = 650;
y_delta = y_max - y_min;

started = false;

console.log(`The normal scale is ${1 + ((f_i - f_red) / f_red)} time bigger than the representation.`);


function setup() {
    createCanvas(innerWidth, innerHeight * 3 / 4, WEBGL);

    angleMode(DEGREES);
    document.body.style.backgroundColor = "rgb(30, 30, 30)";

    noLoop();

    const start = document.querySelector("#start");

    start.addEventListener("click", async () => {
        loop();
        started = true;

        console.log("aye");

        // for (let i = 0; i <= 15; i++) {
        while (started) {
            let random = Math.random() * 10000 + 200;
            // let t1 = performance.now()
            await oscillatorPromise(context, random, 0.1);
            // console.log(performance.now() - t1);
            console.log("hey0");
        }

    });

    const stop = document.querySelector("#stop");

    stop.addEventListener("click", () => {
        noLoop();
        started = false;
    });



    const context = new(window.AudioContext || window.webkitAudioContext)();



    started = false;
}

function draw() {


    /*if (started) {
        



    }*/

    if (!(frameCount % 60)) {
        f_i = Math.random() * 14000 + 200;
        dummy = Math.random() * 255;

        f_red = f_i % red_index;
        console.log("hye");
        addData(energy_particle_line_chart, 1, f_i);
        addData(energy_frequency_line_chart, f_i, 3000);
        addData(energy_wavelength_line_chart, 5, 3000);
        addData(frequency_wavelength_line_chart, 5, f_i);
    }

    background("rgba(0, 0, 0, 0)");

    rotateX(60);

    noFill();
    stroke(255, 0, 125);

    strokeWeight(1);

    oscillatorGrapher(f_i, strum, y_min, y_max);

    for (let i = 1; i <= 5; i++) {
        oscillatorGrapher(f_i, strum, y_min - y_delta * i, y_max - y_delta * i);
    }


    strokeWeight(s_w)

    for (let i = 0; i < n_shape; i++) {
        stroke(dummy, dummy, dummy);

        beginShape();
        for (let j = MAX_ANGLE; j > 0; j -= MAX_ANGLE / n_side) {
            r = i * A / n_shape;
            x = r * cos(j);
            y = r * sin(j) - padding;

            z = A * sin(f_red * frameCount + i * 5);
            vertex(x, y, z);

        }
        endShape(CLOSE);

    }
}


function windowResized() {
    resizeCanvas(innerWidth, innerHeight * 3 / 4);
}

function oscillatorGrapher(f_i, strum, y_min, y_max) {

    beginShape();

    for (let x = -innerWidth; x < innerWidth; x += 3) {
        let new_x = map(x, 0, innerWidth, 0, TWO_PI);
        let angle = atan(A * sin(f_i * (new_x)));
        let y = map(angle, -strum, strum, y_min, y_max);


        vertex(x, y);
    }
    endShape();
}

function oscillatorPromise(context, f_i, duration) {
    return new Promise((resolve, reject) => {

        const oscillator = context.createOscillator();

        oscillator.type = 'sine';
        oscillator.frequency.value = f_i;
        let now = context.currentTime;
        oscillator.start(now);
        oscillator.connect(context.destination);
        console.log(now);

        oscillator.stop(now + duration);
        oscillator.onended = () => {
            oscillator.disconnect(context.destination);
            resolve();

        };

    });
}

/*const REAL_TIME_FREQUENCY = 800;
    const ANGULAR_FREQUENCY = REAL_TIME_FREQUENCY * 2 * Math.PI;

    let audioContext = new AudioContext();
    let myBuffer = audioContext.createBuffer(1, f_i * 2 / 5, f_i * 2);
    let myArray = myBuffer.getChannelData(0);
    for (let sampleNumber = 0 ; sampleNumber < 88200 ; sampleNumber++) {
        myArray[sampleNumber] = generateSample(sampleNumber);
    }

    function generateSample(sampleNumber) {
        let sampleTime = sampleNumber / 44100;
        let sampleAngle = sampleTime * ANGULAR_FREQUENCY;
        return Math.sin(sampleAngle);
    }

    let src = audioContext.createBufferSource();
    src.buffer = myBuffer;
    src.connect(audioContext.destination);
    src.start();
	
*/