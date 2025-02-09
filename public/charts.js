document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch("/api/garbage-data"); // Fetch data from API
        const garbageData = await response.json();

        const garbageTypes = {}; // Store garbage type counts

        garbageData.forEach((item) => {
            if (garbageTypes[item.garbage_type]) {
                garbageTypes[item.garbage_type] += item.weight_kg;
            } else {
                garbageTypes[item.garbage_type] = item.weight_kg;
            }
        });

        const labels = Object.keys(garbageTypes);
        const data = Object.values(garbageTypes);

        // ✅ Bar Chart
        new Chart(document.getElementById("barChart"), {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: "Garbage Weight (kg)",
                    data: data,
                    backgroundColor: ["red", "blue", "green", "orange", "purple"],
                    borderColor: "black",
                    borderWidth: 1
                }]
            },
            options: { responsive: true }
        });

        // ✅ Pie Chart
        new Chart(document.getElementById("pieChart"), {
            type: "pie",
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: ["red", "blue", "green", "orange", "purple"]
                }]
            },
            options: { responsive: true }
        });

    } catch (error) {
        console.error("Error fetching garbage data:", error);
    }
});
