// TODO : REFACTOR !
// INTERFACE STYLIZE
// FUNCTIONS SEPERATION +
// CHART LEGEND 
// Commenting


// Welcome to the backbone of the application! 
// Do not try what you will see now at home!
// And also, I'm sorry for this mess :|

let Amplitude, r, x, y, z, n_side, n_shape, offset, strum, padding, stroke_weight, Amplitude_Shape_factor, y_min, y_max, y_delta, started, random_energy_in_joules, pure_frequency_in_petahertz, min_pure_frequency_in_petahertz, max_pure_frequency_in_petahertz, reducted_frequency_in_hz, color, parsed_color, pure_wavelength_in_fermometers,min_pure_wavelength_in_fermometers, max_pure_wavelength_in_fermometers, particle_count;

started = false;

// Shape Wave Parameters

Amplitude = 140;
Amplitude_Shape_factor = 4; // Amplitude-Shape Factor
stroke_weight = 4
n_side = Math.random() * 30 + 3; // Number of side
n_shape = Amplitude / Amplitude_Shape_factor; // Number of shape instance
offset = 0;

// Surface Wave Parameters

padding = 200;
strum = Amplitude; // Valley - Peak

// Surface Wave Ordinates

y_min = 100; 
y_max = 650;
y_delta = y_max - y_min;

// Constants

const GeV_constant = 1.602176487 * 10 ** (-10); // Based on Joules
const fm_constant = 10 ** 15; // Based on meters
const Zs_constant = 10 ** (-21); // Based on seconds
const Gs_constant = 10 ** (-9); // Based on seconds
const kHz_constant = 10 ** 3; // Based on Hz
const min_energy_in_GeV = 1;
const max_energy_in_GeV = 6;
const min_energy_in_joules = min_energy_in_GeV * GeV_constant;
const max_energy_in_joules = max_energy_in_GeV * GeV_constant;
const planck_constant_in_joules = 6.62607004 * 10**(-34);
const speed_of_light_in_meters = 299792458;
const min_hearable_hz = 22;
const max_hearable_hz = 17 * kHz_constant; // A little padding to be able to hear it :D
const min_visible_nm = 400;
const max_visible_nm = 700;
const data_constant = 10 ** 12;
const available_charts = [energy_particle_data, energy_frequency_data, energy_wavelength_data, frequency_wavelength_data];
const MAX_ANGLE = 360;


// Initiator Values

reducted_frequency_in_hz = 2000;
started = false;
color = "rgb(255, 0, 125)";
particle_count = 0;


function setup() {
	
    createCanvas(innerWidth, innerHeight * 3 / 4, WEBGL);

    angleMode(DEGREES);
	
    document.body.style.backgroundColor = "rgb(30, 30, 30)"; 

    noLoop();
	

    const context = new(window.AudioContext || window.webkitAudioContext)();

    const start_button = document.querySelector("#start");
	const stop_button = document.querySelector("#stop");

    start_button.addEventListener("click", async () => { // As the Autoplay policy has been changed, we needed to create a trigger event.
	
        loop();
		
        started = true;

        while (started) {
			
            await oscillatorPromise(context, reducted_frequency_in_hz, 0.1); // Using an asynchronous function to avoid wave superpositions.
        }

    });

    stop_button.addEventListener("click", () => { // It helps a lot...
		
        noLoop();
		
        started = false;
    });

}

function draw() {
	
    if (!(frameCount % 30)) { // For every 30 frames per second,
		
		n_side = Math.random() * 30 + 3; // Change the form of shape.
		
		particle_count++; // Getting new particles in the simulation.
		
		random_energy_in_joules = generate_random_energy_in_joules(); // In the real experiment, it'll be replaced by the *REAL* data.
		
		[min_pure_frequency_in_petahertz, max_pure_frequency_in_petahertz, pure_frequency_in_petahertz] = calculate_frequency_in_petahertz(random_energy_in_joules);
		
		reducted_frequency_in_hz = reduction_of_pure_frequency_to_human_hearing_range(pure_frequency_in_petahertz);
		
		[min_pure_wavelength_in_fermometers, max_pure_wavelength_in_fermometers, pure_wavelength_in_fermometers] = calculate_wavelength_in_nanometers(pure_frequency_in_petahertz);
		
		reducted_wavelength_in_nanometers = reduction_of_pure_wavelength_to_visible_range(pure_wavelength_in_fermometers);
		
		console.log(reducted_wavelength_in_nanometers);
		
		color = wavelength_to_rgb(reducted_wavelength_in_nanometers);
		
		parsed_color = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
		
		for (let i = 0; i < available_charts.length; i++) {
			colorizeChart(available_charts[i], parsed_color); // Updating chart data colors.
		}
		
		console.log(random_energy_in_joules / GeV_constant);

        addData(energy_particle_line_chart, particle_count, (random_energy_in_joules / GeV_constant).toFixed(2) );
        addData(energy_frequency_line_chart, pure_frequency_in_petahertz.toFixed(2), (random_energy_in_joules / GeV_constant).toFixed(2));
        addData(energy_wavelength_line_chart, pure_wavelength_in_fermometers.toFixed(2), (random_energy_in_joules / GeV_constant).toFixed(2));
        addData(frequency_wavelength_line_chart, pure_wavelength_in_fermometers.toFixed(2), pure_frequency_in_petahertz.toFixed(2));
		
		document.getElementById("info").innerHTML = `The normal scale is ${parseFloat(1 + ((pure_frequency_in_petahertz / Zs_constant - reducted_frequency_in_hz) / reducted_frequency_in_hz)).toExponential()} time bigger than the representation.`;
    }

    background("rgba(0, 0, 0, 0)");

    rotateX(60);

    noFill();
    stroke(color);
	
	document.querySelectorAll("button").forEach( el => {
		el.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
	})

    strokeWeight(1);

    oscillatorGrapher(reducted_frequency_in_hz, strum, y_min, y_max);

    for (let i = 1; i <= 5; i++) {
        oscillatorGrapher(reducted_frequency_in_hz, strum, y_min - y_delta * i, y_max - y_delta * i);
    }


    strokeWeight(stroke_weight)

    for (let i = 0; i < n_shape; i++) {

        beginShape();
        for (let j = MAX_ANGLE; j > 0; j -= MAX_ANGLE / n_side) {
            r = i * Amplitude / n_shape;
            x = r * cos(j);
            y = r * sin(j) - padding;

            z = Amplitude * sin(reducted_frequency_in_hz * frameCount + i * 5);
            vertex(x, y, z);

        }
        endShape(CLOSE);

    }
}

