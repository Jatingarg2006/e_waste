const startButton = document.getElementById("startButton");
const assessment = document.getElementById("assessment");
const deviceForm = document.getElementById("deviceForm");
const result = document.getElementById("result");


// Scroll to assessment section
startButton.addEventListener("click", () => {
    assessment.scrollIntoView({
        behavior: "smooth"
    });
});


// Send device information to backend
deviceForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const device = document.getElementById("deviceType").value;
    const brand = document.getElementById("brand").value;
    const age = Number(document.getElementById("age").value);
    const condition = document.getElementById("condition").value;


    try {

        const response = await fetch("http://localhost:5000/api/analyze", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                device,
                brand,
                age,
                condition
            })
        });


        const data = await response.json();


        // Convert option names into readable text
        const optionNames = {
            repair: "REPAIR",
            reuse: "REUSE",
            sell: "SELL",
            donate: "DONATE",
            recycle: "RECYCLE"
        };


        // Sort scores
        const sortedOptions = Object.entries(data.scores)
            .sort((a, b) => b[1] - a[1]);


        // Create comparison
        let comparisonHTML = "";

        sortedOptions.forEach(([option, score]) => {

            comparisonHTML += `
                <div class="score-item">

                    <div class="score-header">
                        <strong>${optionNames[option]}</strong>
                        <span>${score}/100</span>
                    </div>

                    <div class="score-bar">
                        <div
                            class="score-fill"
                            style="width: ${score}%">
                        </div>
                    </div>

                </div>
            `;
        });


        // Display result
        result.innerHTML = `
            <h3>Recommended: ${optionNames[data.recommendation]}</h3>

            <p>
                Decision score:
                <strong>${data.score}/100</strong>
            </p>

            <p>
                We analyzed your ${data.brand || ""} ${data.device}
                based on its age and current condition.
            </p>

            <h4>Option Comparison</h4>

            ${comparisonHTML}

            <p>
                This is an MVP decision model. The scoring methodology
                will become more data-driven as we add real lifecycle
                and environmental data.
            </p>
        `;

        result.style.display = "block";


        // Useful while developing
        console.log("Backend response:", data);

    } catch (error) {

        console.error("Error:", error);

        result.innerHTML = `
            <h3>Something went wrong</h3>
            <p>Could not connect to the decision engine.</p>
        `;

        result.style.display = "block";
    }
});