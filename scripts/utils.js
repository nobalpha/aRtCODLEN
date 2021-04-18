function windowResized() { // Resizing the window dynamically.
    resizeCanvas(innerWidth, innerHeight * 3 / 4);
}

function oscillatorGrapher(f_i, strum, y_min, y_max) { // Generating the sine wave on the floor.

    beginShape();

    for (let x = -innerWidth; x < innerWidth; x += 3) {
        let new_x = map(x, 0, innerWidth, 0, TWO_PI);
        let angle = atan(Amplitude * sin(f_i * (new_x)));
        let y = map(angle, -strum, strum, y_min, y_max);


        vertex(x, y);
    }
    endShape();
}

function oscillatorPromise(context, f_i, duration) { // Creating a synchronous sound buffer to avoid superpositioned waves to be produced.
    return new Promise((resolve, reject) => {

        const oscillator = context.createOscillator();

        oscillator.type = 'sine';
        oscillator.frequency.value = f_i;
        let now = context.currentTime;
        oscillator.start(now);
        oscillator.connect(context.destination);

        oscillator.stop(now + duration);
        oscillator.onended = () => {
            oscillator.disconnect(context.destination);
            resolve();

        };

    });
}

function generate_random_energy_in_joules() { // Using Joules metric to have a greater random_int range and to avoid floating point logic.
    random_energy_in_joules = (Math.random() * parseInt((max_energy_in_joules - min_energy_in_joules) * GeV_constant ** (-2)) + parseInt(min_energy_in_joules * GeV_constant ** (-2))) * GeV_constant ** (2);

    return random_energy_in_joules;
}

function calculate_frequency_in_petahertz(random_energy_in_joules) { // E = hv
    min_pure_frequency_in_petahertz = min_energy_in_joules / planck_constant_in_joules * Ps_constant;
    max_pure_frequency_in_petahertz = max_energy_in_joules / planck_constant_in_joules * Ps_constant;
    pure_frequency_in_petahertz = random_energy_in_joules / planck_constant_in_joules * Ps_constant;

    return [min_pure_frequency_in_petahertz, max_pure_frequency_in_petahertz, pure_frequency_in_petahertz];
}

function calculate_wavelength_in_nanometers(pure_frequency_in_petahertz) { // c = vλ
    // Due to the decrease of wavelength by energy, it's obligatory to rotate the range by chaning min and max.
    min_pure_wavelength_in_fermometers = speed_of_light_in_meters / max_pure_frequency_in_petahertz * fm_constant * Ps_constant;
    max_pure_wavelength_in_fermometers = speed_of_light_in_meters / min_pure_frequency_in_petahertz * fm_constant * Ps_constant;
    pure_wavelength_in_fermometers = speed_of_light_in_meters / pure_frequency_in_petahertz * fm_constant * Ps_constant;

    return [min_pure_wavelength_in_fermometers, max_pure_wavelength_in_fermometers, pure_wavelength_in_fermometers];
}

function reduction_of_pure_frequency_to_human_hearing_range(pure_frequency_in_petahertz) { // (max_hearable_hz - min_hearable_hz) / (reducted_frequency_in_hz - min_hearable_hz) = (max_pure_frequency_in_petahertz - min_pure_frequency_in_petahertz) / (pure_frequency_in_petahertz - min_pure_frequency_in_petahertz)

    reducted_frequency_in_hz = ((max_hearable_hz - min_hearable_hz) * (pure_frequency_in_petahertz - min_pure_frequency_in_petahertz) + min_hearable_hz * (max_pure_frequency_in_petahertz - min_pure_frequency_in_petahertz)) / (max_pure_frequency_in_petahertz - min_pure_frequency_in_petahertz);

    return reducted_frequency_in_hz;
}

function reduction_of_pure_wavelength_to_visible_range(pure_wavelength_in_fermometers) { // (max_visible_nm - min_visible_nm) / (reducted_wavelength_in_fermometers - min_visible_nm) = (max_pure_wavelength_in_fermometers - min_pure_wavelength_in_fermometers) / (pure_wavelength_in_fermometers- min_pure_wavelength_in_fermometers)

    reducted_wavelength_in_nanometers = ((max_visible_nm - min_visible_nm) * (pure_wavelength_in_fermometers - min_pure_wavelength_in_fermometers) + min_visible_nm * (max_pure_wavelength_in_fermometers - min_pure_wavelength_in_fermometers)) / (max_pure_wavelength_in_fermometers - min_pure_wavelength_in_fermometers);

    return (reducted_wavelength_in_nanometers);
}

// Code from Academo which is the most convenient snippet for now...
// https://academo.org/demos/wavelength-to-colour-relationship/
// https://codepen.io/pen/?&editors=011&prefill_data_id=1841f63c-f89a-41b5-8399-0160ad1584de

function wavelength_to_rgb(wavelength) {
    let Gamma = 0.80,
        IntensityMax = 255,
        factor, red, green, blue;
    if ((wavelength >= 380) && (wavelength < 440)) {
        red = -(wavelength - 440) / (440 - 380);
        green = 0.0;
        blue = 1.0;
    } else if ((wavelength >= 440) && (wavelength < 490)) {
        red = 0.0;
        green = (wavelength - 440) / (490 - 440);
        blue = 1.0;
    } else if ((wavelength >= 490) && (wavelength < 510)) {
        red = 0.0;
        green = 1.0;
        blue = -(wavelength - 510) / (510 - 490);
    } else if ((wavelength >= 510) && (wavelength < 580)) {
        red = (wavelength - 510) / (580 - 510);
        green = 1.0;
        blue = 0.0;
    } else if ((wavelength >= 580) && (wavelength < 645)) {
        red = 1.0;
        green = -(wavelength - 645) / (645 - 580);
        blue = 0.0;
    } else if ((wavelength >= 645) && (wavelength < 781)) {
        red = 1.0;
        green = 0.0;
        blue = 0.0;
    } else {
        red = 0.0;
        green = 0.0;
        blue = 0.0;
    };
    // Let the intensity fall off near the vision limits
    if ((wavelength >= 380) && (wavelength < 420)) {
        factor = 0.3 + 0.7 * (wavelength - 380) / (420 - 380);
    } else if ((wavelength >= 420) && (wavelength < 701)) {
        factor = 1.0;
    } else if ((wavelength >= 701) && (wavelength < 781)) {
        factor = 0.3 + 0.7 * (780 - wavelength) / (780 - 700);
    } else {
        factor = 0.0;
    };
    if (red !== 0) {
        red = Math.round(IntensityMax * Math.pow(red * factor, Gamma));
    }
    if (green !== 0) {
        green = Math.round(IntensityMax * Math.pow(green * factor, Gamma));
    }
    if (blue !== 0) {
        blue = Math.round(IntensityMax * Math.pow(blue * factor, Gamma));
    }
    return [red, green, blue];
}

// Storage

/*
function inverval_finder(value) {
	for (let i = 0; i < mapper.length; i++) {
	let min = mapper[i][0];
	let max = mapper[i][1];
	let hex = mapper[i][2];
    if (min <= value && value < max)
		return [min, max, value.toString(16)]
}	
}

function calculation_of_saturation_percentage(wavelength_in_nanometers) {
	let data, saturation_percentage;
	if (data = inverval_finder(wavelength_in_nanometers)) { // data : (min interval, max interval, hex) of wavelength
		console.log(data);
		saturation_percentage = (max_saturation_percentage - min_saturation_percentage) / (data[1] - data[0]) * (wavelength_in_nanometers - data[0]) + min_saturation_percentage;
            return saturation_percentage
	}
}

function hexToRGB(h) {
  let r = 0, g = 0, b = 0;

  // 3 digits
  if (h.length == 3) {
    r = "0x" + h[0] + h[0];
    g = "0x" + h[1] + h[1];
    b = "0x" + h[2] + h[2];

  // 6 digits
  } else if (h.length == 7) {
    r = "0x" + h[0] + h[1];
    g = "0x" + h[2] + h[3];
    b = "0x" + h[4] + h[5];
  }
  
  return [`rgb(${r}, ${g}, ${b})`, r, g, b];
}

function hexToHSL(hex) {
	
	let r, g, b;
	
	[, r, g, b ] = hexToRGB(hex);
	
	console.log(r, g, b)
    r = parseInt(r, 16);
    g = parseInt(g, 16);
    b = parseInt(b, 16);

    r /= 255, g /= 255, b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max == min){
        h = s = 0; // achromatic
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    s = s*100;
    s = Math.round(s);
    l = l*100;
    l = Math.round(l);
	h = Math.round(360*h);

  return [`hsl(${h}, ${s}%, ${l}%)`, h, s, l];
}

function wavelength_to_hex(wavelength_in_nanometers) {
	return parseInt(32280 * wavelength_in_nanometers - 8.986e+6).toString(16);
}

*/