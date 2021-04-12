const energy_per_particle = document.getElementById("energy_particle").getContext("2d");


let energy_particle_data = {
    datasets: [
        {
            label: "Particle's Energy",
            data: [],
            borderColor: "red",
            backgroundColor: "black",
        }
    ]
};

const energy_particle_config = {
    type: 'line',
    data: energy_particle_data,
    options: {
        responsive: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Chart.js Line Chart'
            }
        }
    },
};



const energy_particle_line_chart = new Chart(energy_particle, energy_particle_config);

/////

const energy_frequency = document.getElementById("energy_frequency").getContext("2d");


let energy_frequency_data = {
    datasets: [
        {
            label: "Energy & Frequency",
            data: [],
            borderColor: "red",
            backgroundColor: "black",
        }
    ]
};

const energy_frequency_config = {
    type: 'line',
    data: energy_frequency_data,
    options: {
        responsive: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Chart.js Line Chart'
            }
        }
    },
};


const energy_frequency_line_chart = new Chart(energy_frequency, energy_frequency_config);

/////

const energy_wavelength = document.getElementById("energy_wavelength").getContext("2d");


let energy_wavelength_data = {
    datasets: [
        {
            label: "Energy & Wavelength",
            data: [],
            borderColor: "red",
            backgroundColor: "black",
        }
    ]
};

const energy_wavelength_config = {
    type: 'line',
    data: energy_wavelength_data,
    options: {
        responsive: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Chart.js Line Chart'
            }
        }
    },
};


const energy_wavelength_line_chart = new Chart(energy_wavelength, energy_wavelength_config);

/////

const frequency_wavelength = document.getElementById("frequency_wavelength").getContext("2d");


let frequency_wavelength_data = {
    datasets: [
        {
            label: "Frequency & Wavelength",
            data: [],
            borderColor: "red",
            backgroundColor: "black",
        }
    ]
};

const frequency_wavelength_config = {
    type: 'line',
    data: frequency_wavelength_data,
    options: {
        responsive: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Chart.js Line Chart'
            }
        }
    },
};


const frequency_wavelength_line_chart = new Chart(frequency_wavelength, frequency_wavelength_config);






addData(frequency_wavelength_line_chart, 15, 20); 



function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}